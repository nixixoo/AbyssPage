import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animation-container" 
         [class.active]="isActive" 
         [class.exit]="!isActive && wasActive"
         *ngIf="isActive || wasActive">
      <div class="door left"></div>
      <div class="door right"></div>
      <div class="content">
        <img src="assets/logo.png" alt="Logo" class="logo">
        <h2 class="welcome-text">Welcome, {{ username }}</h2>
      </div>
    </div>
  `,
  styleUrls: ['./welcome-animation.component.scss']
})
export class WelcomeAnimationComponent {
  @Input() isActive: boolean = false;
  wasActive: boolean = false;
  username: string = '';

  constructor(private authService: AuthService) {
    this.loadUsername();
  }

  async loadUsername() {
    const user = await this.authService.getCurrentUser();
    this.username = user?.username || 'User';
  }

  ngOnChanges() {
    if (this.isActive) {
      this.wasActive = true;
      this.loadUsername();
    } else if (this.wasActive) {
      setTimeout(() => {
        this.wasActive = false;
      }, 6600);
    }
  }
}
