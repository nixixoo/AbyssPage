import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../components/header/header.component';
import { WelcomeAnimationComponent } from '../../components/welcome-animation/welcome-animation.component';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    HeaderComponent,
    WelcomeAnimationComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  usernameError: boolean = false;
  passwordError: boolean = false;
  confirmPasswordError: boolean = false;
  isLoading: boolean = false;
  showPassword: boolean = false;
  showWelcomeAnimation: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private animationService: AnimationService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validateUsername() {
    this.usernameError = this.username.length > 0 && this.username.length < 3;
    this.errorMessage = '';
  }

  validatePassword() {
    this.passwordError = this.password.length > 0 && this.password.length < 6;
    this.errorMessage = '';
  }

  validateConfirmPassword() {
    this.confirmPasswordError = this.confirmPassword.length > 0 && 
      (this.confirmPassword.length < 6 || this.confirmPassword !== this.password);
    this.errorMessage = '';
  }

  isFormValid(): boolean {
    return this.username.length >= 3 && 
           this.password.length >= 6 && 
           this.password === this.confirmPassword &&
           !this.usernameError && 
           !this.passwordError &&
           !this.confirmPasswordError;
  }

  async onRegister() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fix the errors in the form';
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.register(this.username, this.password);
      this.animationService.startAnimation();
      
      setTimeout(() => {
        this.router.navigate(['/characters']);
      }, 3500);
      
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
