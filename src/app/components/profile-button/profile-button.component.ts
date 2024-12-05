import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    { url: 'assets/images/avatars/avatar1.png', name: 'Avatar 1' },
    { url: 'assets/images/avatars/avatar2.png', name: 'Avatar 2' },
    { url: 'assets/images/avatars/avatar3.png', name: 'Avatar 3' },
    // Añade más avatares según necesites
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

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
    this.router.navigate(['/profile/me']);
  }

  openAvatarSelector() {
    this.showAvatarSelector = true;
  }

  closeAvatarSelector() {
    this.showAvatarSelector = false;
  }

  selectAvatar(avatar: any) {
    // Implement avatar selection logic here
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
