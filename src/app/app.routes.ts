import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { CharactersComponent } from './pages/characters/characters.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
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
  }
];
