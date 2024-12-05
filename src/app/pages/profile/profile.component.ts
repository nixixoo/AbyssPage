import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { CreatorService } from '../../services/creator.service';
import { Creator } from '../../interfaces/creator.interface';
import { Subject, takeUntil, take } from 'rxjs';
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
  newSocialMedia = {
    platform: '',
    url: ''
  };
  isSelectOpen = false;
  dropdownPosition: { top: number; left: number; width: number } | null = null;
  authChecked = false;
  isAuthenticated = false;

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
      this.isLoading = true;
      
      const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));

      this.authService.isAuthenticated$
        .pipe(
          takeUntil(this.destroy$),
          take(1)
        )
        .subscribe(async (isAuthenticated) => {
          console.log('2. Auth state:', isAuthenticated);
          this.isAuthenticated = isAuthenticated;

          if (isAuthenticated) {
            this.route.paramMap.subscribe(params => {
              console.log('3. Full route:', this.router.url);
              console.log('3.1 ParamMap:', params);
              
              const username = params.get('username') || 'me';
              console.log('4. Resolved username:', username);
              
              if (username === 'me') {
                console.log('5. Handling "me" route');
                this.authService.currentUser$
                  .pipe(
                    takeUntil(this.destroy$),
                    take(1)
                  )
                  .subscribe({
                    next: (currentUser) => {
                      console.log('6. Current User Data:', currentUser);
                      if (currentUser) {
                        this.user = currentUser;
                        this.isOwnProfile = true;
                        console.log('7. Setting initial user data:', this.user);
                        
                        console.log('8. Loading full user data for uid:', currentUser.uid);
                        this.loadUserData(currentUser.uid);
                      } else {
                        console.log('5a. No current user, redirecting to login');
                        this.router.navigate(['/login']);
                      }
                    },
                    error: (error) => {
                      console.error('5b. Error getting current user:', error);
                      this.isLoading = false;
                      this.router.navigate(['/login']);
                    }
                  });
              } else {
                this.creatorService.getCreatorByUsername(username).subscribe({
                  next: (userData) => {
                    if (userData) {
                      this.user = userData;
                      
                      this.authService.currentUser$.pipe(take(1)).subscribe(currentUser => {
                        this.isOwnProfile = currentUser?.uid === userData.uid;
                      });
                      
                      this.isLoading = false;
                      
                      setTimeout(() => {
                        const mainElement = document.querySelector('main');
                        if (mainElement) {
                          mainElement.classList.add('loaded');
                        }
                      }, 800);
                    } else {
                      console.error('User not found');
                      this.isLoading = false;
                    }
                  },
                  error: (error) => {
                    console.error('Error loading profile:', error);
                    this.isLoading = false;
                  }
                });
              }
            });
          }

          await minimumLoadingTime;
          this.authChecked = true;
          this.isLoading = false;
        });

    } catch (error) {
      console.error('Error in profile initialization:', error);
      this.isLoading = false;
      this.authChecked = true;
    }
  }

  private loadUserData(uid: string) {
    console.log('7. loadUserData called with uid:', uid);
    this.creatorService.getCreator(uid).subscribe({
      next: (userData) => {
        console.log('8. Received user data:', userData);
        if (userData) {
          this.user = userData;
          this.isLoading = false;
          console.log('9. Updated user data:', this.user);
          
          setTimeout(() => {
            const mainElement = document.querySelector('main');
            if (mainElement) {
              mainElement.classList.add('loaded');
              console.log('10. Added loaded class to main element');
            }
          }, 800);
        }
      },
      error: (error) => {
        console.error('8a. Error loading user data:', error);
        this.isLoading = false;
      }
    });
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
