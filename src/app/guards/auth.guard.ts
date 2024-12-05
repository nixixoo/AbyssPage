import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    console.log('Auth Guard: Checking authentication...');
    return this.authService.isAuthenticated$.pipe(
      take(1),
      tap(isAuthenticated => console.log('Auth Guard: Is authenticated?', isAuthenticated)),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          console.log('Auth Guard: Not authenticated, redirecting to login');
          this.router.navigate(['/login']);
          return false;
        }
        console.log('Auth Guard: Authentication successful');
        return true;
      })
    );
  }
} 