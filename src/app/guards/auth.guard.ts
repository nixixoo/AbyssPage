import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap, first, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate() {
    return from(this.authService.isFirebaseReady()).pipe(
      switchMap(initialAuth => {
        if (!initialAuth) {
          this.router.navigate(['/login']);
          return of(false);
        }
        return of(true);
      })
    );
  }
} 