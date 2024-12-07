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

@Component({
  selector: 'app-team-request',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  templateUrl: './team-request.component.html',
  styleUrls: ['./team-request.component.scss']
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
            // Get the list of owned characters
            const ownedCharacterIds = Object.keys(this.targetUser.characters || {})
              .filter(id => this.targetUser?.characters[id]);
            
            // Filter the character list to only show owned characters
            this.availableCharacters = characterList
              .filter(char => ownedCharacterIds.includes(char.id));
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

    try {
      const currentUser = await firstValueFrom(this.authService.currentUser$);

      const teamRequest: TeamRequest = {
        fromUserId: currentUser?.uid || null,
        fromUsername: currentUser?.username,
        toUserId: this.targetUser!.uid,
        characters: this.selectedCharacters,
        message: this.message || undefined,
        isAnonymous: !currentUser
      };

      await this.teamRequestService.createTeamRequest(teamRequest);
      
      // Show success message
      // TODO: Add a proper success message UI
      alert('Team request sent successfully!');
      
      // Navigate back to profile
      this.router.navigate(['/profile', this.targetUser!.username]);
      
    } catch (error) {
      console.error('Error sending team request:', error);
      this.errorMessage = 'Error sending team request. Please try again.';
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
    this.activeFilters.element = this.activeFilters.element === element ? null : element;
    this.applyFilters();
  }

  filterByWeapon(weapon: string) {
    this.activeFilters.weapon = this.activeFilters.weapon === weapon ? null : weapon;
    this.applyFilters();
  }

  filterByRarity(rarity: number) {
    this.selectedRarity = this.selectedRarity === rarity ? null : rarity;
    this.applyFilters();
  }

  private applyFilters() {
    let filteredList = [...this.availableCharacters];

    if (this.activeFilters.element) {
      filteredList = filteredList.filter(char => {
        // Special handling for Travelers
        if (char.id === 'aether' || char.id === 'lumine') {
          // Show Travelers for any element except Cryo
          const travelerElements = ['Anemo', 'Geo', 'Electro', 'Dendro', 'Hydro', 'Pyro'];
          return travelerElements.includes(this.activeFilters.element!);
        }
        // Normal filtering for other characters
        return char.element === this.activeFilters.element;
      });
    }

    if (this.activeFilters.weapon) {
      filteredList = filteredList.filter(char => char.weaponType === this.activeFilters.weapon);
    }

    if (this.selectedRarity) {
      filteredList = filteredList.filter(char => char.rarity === this.selectedRarity);
    }

    this.availableCharacters = filteredList;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  isRaritySelected(rarity: number): boolean {
    return this.selectedRarity === rarity;
  }

  isWeaponSelected(weapon: string): boolean {
    return this.activeFilters.weapon === weapon;
  }

  isElementSelected(element: string): boolean {
    return this.activeFilters.element === element;
  }
} 