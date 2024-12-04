import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { CreatorService } from '../../services/creator.service';
import { Creator } from '../../interfaces/creator.interface';
import { Subject, takeUntil } from 'rxjs';
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
      this.isLoading = true;
      
      this.route.params.subscribe(params => {
        const username = params['username'];
        
        this.authService.currentUser$
          .pipe(takeUntil(this.destroy$))
          .subscribe(currentUser => {
            if (currentUser) {
              if (username === 'me') {
                this.isOwnProfile = true;
                this.creatorService.getCreator(currentUser.uid).subscribe({
                  next: (userData) => {
                    if (userData) {
                      this.user = userData;
                      
                      // Start fade out
                      this.isLoading = false;
                      
                      // Set user after a delay to allow fade out to complete
                      setTimeout(() => {
                        const mainElement = document.querySelector('main');
                        if (mainElement) {
                          mainElement.classList.add('loaded');
                        }
                      }, 800); // Match this with the CSS transition duration
                    }
                  },
                  error: (error) => {
                    console.error('Error loading user data:', error);
                    this.isLoading = false;
                  }
                });
              } else {
                this.creatorService.getCreatorByUsername(username).subscribe({
                  next: (userData) => {
                    if (userData) {
                      this.user = userData;
                      this.isOwnProfile = currentUser.uid === userData.uid;
                      
                      // Start fade out
                      this.isLoading = false;
                      
                      // Set user after a delay to allow fade out to complete
                      setTimeout(() => {
                        const mainElement = document.querySelector('main');
                        if (mainElement) {
                          mainElement.classList.add('loaded');
                        }
                      }, 800); // Match this with the CSS transition duration
                    }
                  },
                  error: (error) => {
                    console.error('Error loading profile:', error);
                    this.isLoading = false;
                  }
                });
              }
            } else if (!this.isLoading) {
              this.router.navigate(['/login']);
            }
          });
      });

    } catch (error) {
      console.error('Error in profile initialization:', error);
      this.isLoading = false;
    }
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
  }

  async addSocialMedia() {
    if (!this.user || !this.newSocialMedia.platform || !this.newSocialMedia.url) return;

    const updatedSocialLinks = {
      ...this.user.socialLinks || {},
      [this.newSocialMedia.platform]: this.newSocialMedia.url
    };

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
      
      // Wait for animation to complete (increased to 500ms to match CSS)
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
}
