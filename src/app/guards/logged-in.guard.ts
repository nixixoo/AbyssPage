import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    return from(this.authService.isFirebaseReady()).pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // If user is logged in, redirect to characters page
          this.router.navigate(['/characters']);
          return false;
        }
        // If user is not logged in, allow access to login/register
        return true;
      })
    );
  }
} 