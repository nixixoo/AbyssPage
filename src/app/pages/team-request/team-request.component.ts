import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Creator } from '../../interfaces/creator.interface';
import { CreatorService } from '../../services/creator.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { characterList, Character } from '../../constants/character-list';
import { TeamRequest } from '../../interfaces/team-request.interface';
import { TeamRequestService } from '../../services/team-request.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-team-request',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  templateUrl: './team-request.component.html',
  styleUrls: ['./team-request.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.5s ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class TeamRequestComponent implements OnInit {
  isLoading: boolean = true;
  isAuthenticated: boolean = false;
  authChecked: boolean = false;
  targetUser: Creator | null = null;
  selectedCharacters: string[] = [];
  message: string = '';
  errorMessage: string = '';
  availableCharacters: Character[] = [];

  // Add these properties for filters
  elements = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'];
  weapons = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];
  
  activeFilters = {
    element: null as string | null,
    weapon: null as string | null,
    rarity: null as number | null
  };

  isSidebarOpen = false;
  selectedRarity: number | null = null;
  selectedElement: string | null = null;
  selectedWeapon: string | null = null;

  // Add this property to store the original list
  private originalCharacters: Character[] = [];

  // Add this property
  isSubmitting: boolean = false;
  requestSent: boolean = false;

  // Add this property
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private creatorService: CreatorService,
    private teamRequestService: TeamRequestService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get target user ID from route
    const targetUserId = this.route.snapshot.params['userId'];
    
    if (!targetUserId) {
      this.errorMessage = 'No target user specified';
      return;
    }

    // Check if user is logged in but don't require it
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        this.authChecked = true;
      }
    );

    // Load target user data
    this.creatorService.getCreator(targetUserId)
      .subscribe({
        next: (userData) => {
          this.targetUser = userData;
          if (this.targetUser) {
            const ownedCharacterIds = Object.keys(this.targetUser.characters || {})
              .filter(id => this.targetUser?.characters[id]);
            
            // Store in both arrays with sorting
            this.originalCharacters = characterList
              .filter(char => ownedCharacterIds.includes(char.id))
              .sort((a, b) => {
                // First sort by rarity (descending)
                if (b.rarity !== a.rarity) {
                  return b.rarity - a.rarity;
                }
                // Then sort alphabetically by name
                return a.name.localeCompare(b.name);
              });

            this.availableCharacters = [...this.originalCharacters];
          } else {
            this.errorMessage = 'User not found';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading user data:', error);
          this.errorMessage = 'Error loading user data';
          this.isLoading = false;
        }
      });
  }

  selectCharacter(characterId: string) {
    if (this.selectedCharacters.includes(characterId)) {
      this.selectedCharacters = this.selectedCharacters.filter(id => id !== characterId);
    } else if (this.selectedCharacters.length < 4) {
      this.selectedCharacters.push(characterId);
    }
  }

  async submitRequest() {
    if (this.selectedCharacters.length !== 4) {
      this.errorMessage = 'Please select exactly 4 characters';
      return;
    }

    if (this.requestSent) {
      return;
    }

    this.isSubmitting = true;

    try {
      const currentUser = await firstValueFrom(this.authService.currentUser$);

      const teamRequest: TeamRequest = {
        fromUserId: currentUser?.uid || 'anonymous',
        toUserId: this.targetUser!.uid,
        characters: this.selectedCharacters,
        isAnonymous: !currentUser,
        message: this.message?.trim() || ''
      };

      if (currentUser?.username) {
        teamRequest.fromUsername = currentUser.username;
      }

      await this.teamRequestService.createTeamRequest(teamRequest);
      
      this.requestSent = true;
      this.successMessage = 'Team request sent successfully!';
      setTimeout(() => {
        this.successMessage = '';
        this.router.navigate(['/profile', this.targetUser!.username]);
      }, 3000);
      
    } catch (error) {
      this.errorMessage = 'Error sending team request. Please try again.';
      this.requestSent = false;
    } finally {
      this.isSubmitting = false;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  getConstellationLevel(characterId: string): number {
    return this.targetUser?.constellations?.[characterId] || 0;
  }

  // Add these methods for filters
  filterByElement(element: string) {
    if (this.selectedElement === element) {
      this.selectedElement = null;
    } else {
      this.selectedElement = element;
    }
    this.applyFilters();
  }

  filterByWeapon(weapon: string) {
    if (this.selectedWeapon === weapon) {
      this.selectedWeapon = null;
    } else {
      this.selectedWeapon = weapon;
    }
    this.applyFilters();
  }

  filterByRarity(rarity: number) {
    if (this.selectedRarity === rarity) {
      this.selectedRarity = null;
    } else {
      this.selectedRarity = rarity;
    }
    this.applyFilters();
  }

  private applyFilters() {
    let filteredCharacters = [...this.originalCharacters];

    // Apply element filter
    if (this.selectedElement) {
      filteredCharacters = filteredCharacters.filter(char => {
        if (char.id === 'aether' || char.id === 'lumine') {
          const travelerElements = ['Anemo', 'Geo', 'Electro', 'Dendro', 'Hydro', 'Pyro'];
          return travelerElements.includes(this.selectedElement!);
        }
        return char.element === this.selectedElement;
      });
    }

    // Apply weapon filter
    if (this.selectedWeapon) {
      filteredCharacters = filteredCharacters.filter(char => 
        char.weaponType === this.selectedWeapon
      );
    }

    // Apply rarity filter
    if (this.selectedRarity) {
      filteredCharacters = filteredCharacters.filter(char => 
        char.rarity === this.selectedRarity
      );
    }

    // Update the available characters
    this.availableCharacters = filteredCharacters;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  isRaritySelected(rarity: number): boolean {
    return this.selectedRarity === rarity;
  }

  isWeaponSelected(weapon: string): boolean {
    return this.selectedWeapon === weapon;
  }

  isElementSelected(element: string): boolean {
    return this.selectedElement === element;
  }

  getCharacterById(id: string): Character | undefined {
    const character = this.originalCharacters.find(char => char.id === id);
    return character;
  }

  removeCharacter(index: number) {
    if (index >= 0 && index < this.selectedCharacters.length) {
      this.selectedCharacters.splice(index, 1);
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/default-character.png';
  }
} 