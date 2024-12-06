import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) {
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