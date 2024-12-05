import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

interface AvatarOption {
  url: string;
  name: string;
}

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-button.component.html',
  styleUrls: ['./profile-button.component.scss']
})
export class ProfileButtonComponent implements AfterViewInit {
  @ViewChild('menuContent') menuContent!: ElementRef;
  showAvatarSelector = false;
  menuHeight = 0;
  
  avatarOptions: AvatarOption[] = [
    { url: 'assets/character_profile/kuki_shinobu_avatar.png', name: 'Kuki Shinobu' },
    { url: 'assets/character_profile/klee_blossoming.webp', name: 'Klee' },
    { url: 'assets/character_profile/layla_avatar.png', name: 'Layla' },
    { url: 'assets/character_profile/lisa_avatar.png', name: 'Lisa' },
    { url: 'assets/character_profile/lisa_sobriquet.webp', name: 'Lisa Sobriquet' },
    { url: 'assets/character_profile/lynette_avatar.png', name: 'Lynette' },
    { url: 'assets/character_profile/lyney_avatar.png', name: 'Lyney' },
    { url: 'assets/character_profile/mika_avatar.png', name: 'Mika' },
    { url: 'assets/character_profile/mona_avatar.png', name: 'Mona' },
    { url: 'assets/character_profile/ningguang_avatar.png', name: 'Ningguang' },
    { url: 'assets/character_profile/nilou_avatar.png', name: 'Nilou' },
    { url: 'assets/character_profile/nilou_breeze.webp', name: 'Nilou Breeze' }
  ];

  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    console.log('ProfileButton: Initializing...');
    // Subscribe to auth state changes
    this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        console.log('ProfileButton: Auth state changed:', isAuthenticated);
        this.isLoggedIn = isAuthenticated;
      }
    );
  }

  ngAfterViewInit() {
    this.calculateMenuHeight();
  }

  calculateMenuHeight() {
    if (this.menuContent) {
      const menuItems = this.menuContent.nativeElement.querySelectorAll('.menu-item');
      let totalHeight = 0;
      
      menuItems.forEach((item: HTMLElement) => {
        totalHeight += item.offsetHeight;
      });

      // Añadir padding y márgenes
      totalHeight += 32; // 16px padding top + 16px padding bottom
      
      this.menuHeight = totalHeight;
      
      // Aplicar altura calculada
      const menu = this.menuContent.nativeElement;
      menu.style.setProperty('--menu-height', `${this.menuHeight}px`);
    }
  }

  navigateToProfile() {
    console.log('ProfileButton: Attempting to navigate to profile...');
    // First check if user is authenticated
    this.authService.isAuthenticated$.pipe(take(1)).subscribe(
      isAuthenticated => {
        console.log('ProfileButton: Current auth state:', isAuthenticated);
        console.log('ProfileButton: Component isLoggedIn state:', this.isLoggedIn);
        
        if (isAuthenticated) {
          console.log('ProfileButton: User is authenticated, navigating to profile...');
          this.router.navigate(['profile', 'me']).then(
            success => console.log('ProfileButton: Navigation result:', success),
            error => console.error('ProfileButton: Navigation error:', error)
          );
        } else {
          console.log('ProfileButton: User not authenticated, redirecting to login...');
          this.router.navigate(['/login']);
        }
      },
      error => console.error('ProfileButton: Error checking auth state:', error)
    );
  }

  openAvatarSelector() {
    this.showAvatarSelector = true;
  }

  closeAvatarSelector() {
    this.showAvatarSelector = false;
  }

  selectAvatar(avatar: AvatarOption) {
    console.log('Selected avatar:', avatar);
    this.closeAvatarSelector();
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
