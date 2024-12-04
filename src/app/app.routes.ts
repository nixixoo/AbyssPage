import { Routes } from '@angular/router';
    
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
  { path: 'profile/:username', component: ProfileComponent },
  { path: 'profile', redirectTo: 'profile/me', pathMatch: 'full' },
];
