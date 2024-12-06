import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  usernameError: boolean = false;
  passwordError: boolean = false;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    const savedUsername = this.authService.getRememberedUsername();
    if (savedUsername) {
      this.username = savedUsername;
      this.rememberMe = true;
    }
  }

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

  isFormValid(): boolean {
    return this.username.length >= 3 && 
           this.password.length >= 6 && 
           !this.usernameError && 
           !this.passwordError;
  }

  async onLogin() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fix the errors in the form';
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.login(this.username, this.password, this.rememberMe);
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
