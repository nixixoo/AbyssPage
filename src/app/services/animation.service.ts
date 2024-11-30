import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private showAnimationSubject = new BehaviorSubject<boolean>(false);
  showAnimation$ = this.showAnimationSubject.asObservable();

  startAnimation() {
    this.showAnimationSubject.next(true);
    setTimeout(() => {
      this.showAnimationSubject.next(false);
    }, 7000);
  }
}
