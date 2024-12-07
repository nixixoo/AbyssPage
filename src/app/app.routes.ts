import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoggedInGuard } from './guards/logged-in.guard';

import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { CharactersComponent } from './pages/characters/characters.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TeamRequestComponent } from './pages/team-request/team-request.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'team-request', redirectTo: '/', pathMatch: 'full' },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [LoggedInGuard]
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [LoggedInGuard]
  },
  { path: 'characters', component: CharactersComponent },
  {
    path: 'profile',
    children: [
      {
        path: 'me',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { type: 'self' }
      },
      {
        path: ':username',
        component: ProfileComponent,
        data: { type: 'other' }
      },
      {
        path: '',
        redirectTo: 'me',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'team-request/:userId',
    loadComponent: () => import('./pages/team-request/team-request.component')
      .then(m => m.TeamRequestComponent)
  }
];
