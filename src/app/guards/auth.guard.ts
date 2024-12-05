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
    console.log('Auth Guard: Starting guard check...', {
      url: this.router.url,
      currentRoute: this.router.routerState.snapshot.url
    });
    return from(this.authService.isFirebaseReady()).pipe(
      tap(initialAuth => console.log('Auth Guard: Initial auth state:', initialAuth)),
      switchMap(initialAuth => {
        if (!initialAuth) {
          console.log('Auth Guard: Not authenticated after initialization');
          this.router.navigate(['/login']);
          return of(false);
        }
        console.log('Auth Guard: User is authenticated, allowing navigation');
        return of(true);
      })
    );
  }
} 