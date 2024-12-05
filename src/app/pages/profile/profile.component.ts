import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { CreatorService } from '../../services/creator.service';
import { Creator } from '../../interfaces/creator.interface';
import { Subject, takeUntil, take, switchMap, of, firstValueFrom, tap } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user: Creator | null = null;
  isOwnProfile: boolean = false;
  showSocialForm: boolean = false;
  isLoading: boolean = true;
  authChecked = false;
  isAuthenticated = false;
  isSelectOpen = false;
  dropdownPosition: { top: number; left: number; width: number } | null = null;
  newSocialMedia = {
    platform: '',
    url: ''
  };
  showLoading = true;

  socialPlatforms = [
    { id: 'youtube', name: 'YouTube', icon: 'fab fa-youtube' },
    { id: 'twitch', name: 'Twitch', icon: 'fab fa-twitch' },
    { id: 'twitter', name: 'Twitter', icon: 'fab fa-twitter' },
    { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private creatorService: CreatorService
  ) {}

  ngOnInit() {
    try {
      console.log('1. Profile Init Started');
      
      // First get the username parameter
      this.route.paramMap.pipe(
        take(1),
        switchMap(params => {
          const username = params.get('username') || 'me';
          console.log('2. Route username:', username);

          // Only check auth for 'me' route
          if (username === 'me') {
            return this.authService.isAuthenticated$.pipe(
              take(1),
              tap(isAuthenticated => {
                console.log('3. Auth check for "me" route:', isAuthenticated);
                this.isAuthenticated = isAuthenticated;
              }),
              switchMap(isAuthenticated => {
                if (!isAuthenticated) return of(null);
                return this.authService.currentUser$.pipe(
                  take(1),
                  switchMap(currentUser => {
                    if (!currentUser) return of(null);
                    return this.creatorService.getCreator(currentUser.uid);
                  })
                );
              })
            );
          } else {
            // For other usernames, don't require auth
            this.isAuthenticated = true; // Always set to true for public profiles
            return this.creatorService.getCreatorByUsername(username);
          }
        }),
        takeUntil(this.destroy$)
      ).subscribe({
        next: async (userData) => {
          if (userData) {
            console.log('4. User data loaded:', userData);
            this.user = userData;
            this.isOwnProfile = await this.checkIfOwnProfile(userData.uid);
          }
          
          // First set authChecked
          this.authChecked = true;
          
          // Wait for minimum loading time
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Then handle the loading states in sequence
          this.isLoading = false;  // Set this first to trigger content load
          
          // Small delay before hiding the loading spinner
          setTimeout(() => {
            this.showLoading = false;  // This triggers the fade-out
            
            // Remove the element after transition
            setTimeout(() => {
              const loadingState = document.querySelector('.loading-state');
              if (loadingState) {
                loadingState.remove();
              }
            }, 400); // Match the transition duration
          }, 100); // Small delay to ensure content is ready
        },
        error: (error) => {
          console.error('Error:', error);
          this.authChecked = true;
          this.isLoading = false;
        }
      });

    } catch (error) {
      console.error('Error in profile initialization:', error);
      this.authChecked = true;
      this.isLoading = false;
    }
  }

  private async checkIfOwnProfile(profileUid: string): Promise<boolean> {
    const currentUser = await firstValueFrom(this.authService.currentUser$.pipe(take(1)));
    return currentUser?.uid === profileUid;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  requestTeam() {
    if (this.user) {
      console.log('Team requested for user:', this.user.uid);
    }
  }

  toggleSocialForm() {
    this.showSocialForm = !this.showSocialForm;
    this.newSocialMedia = { platform: '', url: '' };
    
    const formElement = document.querySelector('.social-form');
    if (formElement) {
      formElement.classList.remove('hiding');
    }
  }

  async addSocialMedia() {
    if (!this.user || !this.newSocialMedia.platform || !this.newSocialMedia.url) return;

    const updatedSocialLinks = {
      ...this.user.socialLinks || {},
      [this.newSocialMedia.platform]: this.newSocialMedia.url
    };

    try {
      const formElement = document.querySelector('.social-form');
      if (formElement) {
        formElement.classList.add('hiding');
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      this.creatorService.updateCreator({
        ...this.user,
        socialLinks: updatedSocialLinks
      }).subscribe({
        next: () => {
          if (this.user) {
            this.user = {
              ...this.user,
              socialLinks: updatedSocialLinks
            };
          }
          this.toggleSocialForm();
        },
        error: (error) => {
          console.error('Error adding social media:', error);
        }
      });
    } catch (error) {
      console.error('Error adding social media:', error);
    }
  }

  getSocialLink(platformId: string): string | undefined {
    return this.user?.socialLinks?.[platformId];
  }

  hasSocialLink(platformId: string): boolean {
    return !!this.getSocialLink(platformId);
  }

  isPlatformDisabled(platformId: string): boolean {
    return this.hasSocialLink(platformId);
  }

  async deleteSocialMedia(platformId: string) {
    if (!this.user) return;

    const linkElement = document.querySelector(`.social-link.${platformId}`);
    if (linkElement) {
      linkElement.classList.add('deleting');
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const updatedSocialLinks = { ...this.user.socialLinks };
    delete updatedSocialLinks[platformId];

    try {
      this.creatorService.updateCreator({
        ...this.user,
        socialLinks: updatedSocialLinks
      }).subscribe({
        next: () => {
          if (this.user) {
            this.user = {
              ...this.user,
              socialLinks: updatedSocialLinks
            };
          }
        },
        error: (error) => {
          console.error('Error deleting social media:', error);
        }
      });
    } catch (error) {
      console.error('Error deleting social media:', error);
    }
  }

  toggleSelect(event: MouseEvent) {
    this.isSelectOpen = !this.isSelectOpen;
    
    if (this.isSelectOpen) {
      const selectElement = (event.target as HTMLElement).closest('.select-header');
      if (selectElement) {
        const rect = selectElement.getBoundingClientRect();
        this.dropdownPosition = {
          top: rect.bottom + window.scrollY + 5,
          left: rect.left + window.scrollX,
          width: rect.width
        };
      }
    }
  }

  selectPlatform(platformId: string) {
    if (!this.isPlatformDisabled(platformId)) {
      this.newSocialMedia.platform = platformId;
      this.isSelectOpen = false;
    }
  }

  getPlatformName(platformId: string): string {
    const platform = this.socialPlatforms.find(p => p.id === platformId);
    return platform ? platform.name : 'Select Platform';
  }

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
