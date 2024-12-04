import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
export class ProfileButtonComponent {
  showAvatarSelector = false;
  avatarOptions: AvatarOption[] = [
    { url: 'assets/images/avatars/avatar1.png', name: 'Avatar 1' },
    { url: 'assets/images/avatars/avatar2.png', name: 'Avatar 2' },
    // Add more avatar options here
  ];

  constructor(private router: Router) {}

  navigateToProfile() {
    this.router.navigate(['/profile/me']);
  }

  openAvatarSelector() {
    this.showAvatarSelector = true;
  }

  closeAvatarSelector() {
    this.showAvatarSelector = false;
  }

  selectAvatar(avatar: AvatarOption) {
    // Implement avatar selection logic here
    console.log('Selected avatar:', avatar);
    this.closeAvatarSelector();
  }
}
