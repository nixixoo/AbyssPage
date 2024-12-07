import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { Creator } from '../../interfaces/creator.interface';
import { CreatorService } from '../../services/creator.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil, firstValueFrom, first } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { characterList } from '../../constants/character-list';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.5s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CharactersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  creator: Creator | null = null;
  characterList = characterList;
  displayedCharacters: typeof this.characterList = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  characterConstellations: { [key: string]: number } = {};
  pendingChanges: {
    characters: string[];
    constellations: { [key: string]: number };
  } = {
    characters: [],
    constellations: {}
  };

  elements = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'];
  weapons = ['Sword', 'Claymore', 'Polearm', 'Bow', 'Catalyst'];
  
  activeFilters = {
    element: null as string | null,
    weapon: null as string | null,
    rarity: null as number | null
  };

  isSidebarOpen = false;

  selectedRarity: number | null = null;

  authChecked = false;
  isAuthenticated = false;

  constructor(
    private creatorService: CreatorService,
    private authService: AuthService,
    public router: Router
  ) {
    this.characterList = characterList.sort((a, b) => {
      if (b.rarity !== a.rarity) {
        return b.rarity - a.rarity;
      }
      return a.name.localeCompare(b.name);
    });
    this.displayedCharacters = this.characterList;
  }

  async ngOnInit() {
    try {
      this.isLoading = true;
      this.displayedCharacters = [];
      
      // Force minimum 2 seconds loading time
      const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
      
      this.authService.isAuthenticated$
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(async (isAuthenticated) => {
          this.isAuthenticated = isAuthenticated;
          
          if (isAuthenticated) {
            // Process user data
            const userSubscription = this.authService.currentUser$
              .pipe(
                takeUntil(this.destroy$)
              )
              .subscribe(user => {
                if (user) {
                  this.creator = user;
                  this.pendingChanges.characters = user.characters 
                    ? Object.keys(user.characters).filter(key => user.characters[key])
                    : [];
                  
                  if (user.constellations) {
                    this.characterConstellations = { ...user.constellations };
                    this.pendingChanges.constellations = { ...user.constellations };
                  }
                }
              });
          }

          // Wait for minimum loading time
          await minimumLoadingTime;
          
          // Set authChecked after a small delay to allow animations to complete
          setTimeout(() => {
            this.authChecked = true;
            this.isLoading = false;
            
            if (isAuthenticated) {
              setTimeout(() => {
                this.displayedCharacters = this.characterList;
              }, 300);
            }
          }, 100); // Small delay before changing authChecked
        });

    } catch (error) {
      this.errorMessage = 'Error loading user data';
      this.isLoading = false;
      this.authChecked = true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isCharacterOwned(characterId: string): boolean {
    const isOwned = this.pendingChanges.characters.includes(characterId);
    return isOwned;
  }

  getCharacterCons(characterId: string): number {
    return this.pendingChanges.constellations[characterId] || 0;
  }

  toggleCharacter(character: any) {
    const card = document.querySelector(`[data-character-id="${character.id}"]`);
    if (!card || card.classList.contains('toggling')) return; // Prevent double animations
    
    const isCurrentlyOwned = this.pendingChanges.characters.includes(character.id);
    
    // Remove any existing animation classes first
    card.classList.remove('to-owned', 'to-locked');
    
    // Add new animation classes
    card.classList.add('toggling');
    card.classList.add(isCurrentlyOwned ? 'to-locked' : 'to-owned');

    setTimeout(() => {
      if (isCurrentlyOwned) {
        this.pendingChanges.characters = this.pendingChanges.characters.filter(id => id !== character.id);
        delete this.pendingChanges.constellations[character.id];
      } else {
        this.pendingChanges.characters.push(character.id);
        this.pendingChanges.constellations[character.id] = 0;
      }
      
      // Clean up animation classes
      requestAnimationFrame(() => {
        card.classList.remove('toggling', 'to-owned', 'to-locked');
      });
    }, 400);
  }

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
    let filteredList = [...this.characterList];

    if (this.activeFilters.element) {
      filteredList = filteredList.filter(char => {
        if (char.id === 'aether' || char.id === 'lumine') {
          const travelerElements = ['Anemo', 'Geo', 'Electro', 'Dendro', 'Hydro', 'Pyro'];
          return travelerElements.includes(this.activeFilters.element!);
        }
        return char.element === this.activeFilters.element;
      });
    }

    if (this.activeFilters.weapon) {
      filteredList = filteredList.filter(char => char.weaponType === this.activeFilters.weapon);
    }

    if (this.selectedRarity) {
      filteredList = filteredList.filter(char => char.rarity === this.selectedRarity);
    }

    this.displayedCharacters = filteredList;
  }

  increaseConsLevel(event: Event, character: any) {
    event.stopPropagation();
    const currentCons = this.pendingChanges.constellations[character.id] || 0;
    if (currentCons < 6) {
      this.pendingChanges.constellations[character.id] = currentCons + 1;
      this.animateConsNumber(character.id);
    }
  }

  decreaseConsLevel(event: Event, character: any) {
    event.stopPropagation();
    const currentCons = this.pendingChanges.constellations[character.id] || 0;
    if (currentCons > 0) {
      this.pendingChanges.constellations[character.id] = currentCons - 1;
      this.animateConsNumber(character.id);
    }
  }

  private animateConsNumber(characterId: string) {
    const consElement = document.querySelector(`[data-character-id="${characterId}"] .cons-level`) as HTMLElement;
    if (consElement) {
      consElement.classList.remove('bounce');
      // Force a reflow to restart the animation
      void consElement.offsetWidth;
      consElement.classList.add('bounce');
    }
  }

  updateCharacterCons(characterId: string, consLevel: number) {
    this.characterConstellations[characterId] = consLevel;
  }

  // New method to save changes
  saveChanges() {
    if (!this.creator) return;

    this.isLoading = true;
    
    // Convert array to simple object with boolean values
    const charactersObject = this.pendingChanges.characters.reduce((acc, charId) => {
      acc[charId] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    const updatedCreator: Creator = {
      ...this.creator,
      characters: charactersObject,
      constellations: this.pendingChanges.constellations
    };

    this.creatorService.updateCreator(updatedCreator).subscribe({
      next: (response) => {
        this.creator = response;
        this.characterConstellations = { ...this.pendingChanges.constellations };
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  // New method to discard changes
  discardChanges() {
    if (this.creator) {
      // Convert object to array of character IDs
      this.pendingChanges.characters = this.creator.characters 
        ? Object.keys(this.creator.characters)
        : [];
      this.pendingChanges.constellations = { ...this.characterConstellations };
    }
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

  // Add this method to check if there are pending changes
  hasPendingChanges(): boolean {
    if (!this.creator) return false;

    // Check for character ownership changes
    const currentCharacters = this.creator.characters ? Object.keys(this.creator.characters) : [];
    if (currentCharacters.length !== this.pendingChanges.characters.length) return true;
    
    // Check for constellation changes
    for (const charId in this.pendingChanges.constellations) {
      if (this.pendingChanges.constellations[charId] !== (this.characterConstellations[charId] || 0)) {
        return true;
      }
    }

    return false;
  }

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
