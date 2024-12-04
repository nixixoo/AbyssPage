import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AnimationService } from './services/animation.service';
import { Observable } from 'rxjs';
import { WelcomeAnimationComponent } from './components/welcome-animation/welcome-animation.component';
import { AsyncPipe } from '@angular/common';
import { ProfileButtonComponent } from './components/profile-button/profile-button.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    WelcomeAnimationComponent,
    AsyncPipe,
    ProfileButtonComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Abyss';
  showAnimation$: Observable<boolean>;
  get isLoggedIn(): boolean {
    // Get this from your auth service
    return true; // Temporary, replace with actual auth check
  }
  
  constructor(private animationService: AnimationService, private authService: AuthService) {
    this.showAnimation$ = this.animationService.showAnimation$;
  }
}
