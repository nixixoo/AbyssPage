import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimationService } from './services/animation.service';
import { Observable } from 'rxjs';
import { WelcomeAnimationComponent } from './components/welcome-animation/welcome-animation.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WelcomeAnimationComponent,
    AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Abyss';
  showAnimation$: Observable<boolean>;
  
  constructor(private animationService: AnimationService) {
    this.showAnimation$ = this.animationService.showAnimation$;
  }
}
