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
    return from(this.authService.isFirebaseReady()).pipe(
      switchMap(() => this.authService.isAuthenticated$),
      map(isAuthenticated => {
        if (isAuthenticated) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }
} 