import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    console.log('LoggedIn Guard: Starting check...');
    return from(this.authService.isFirebaseReady()).pipe(
      switchMap(() => this.authService.isAuthenticated$),
      map(isAuthenticated => {
        console.log('LoggedIn Guard: Auth state:', isAuthenticated);
        if (isAuthenticated) {
          console.log('LoggedIn Guard: User is authenticated, redirecting to home');
          this.router.navigate(['/']);
          return false;
        }
        console.log('LoggedIn Guard: User is not authenticated, allowing access');
        return true;
      })
    );
  }
} 