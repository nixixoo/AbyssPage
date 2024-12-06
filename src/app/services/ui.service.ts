import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private isDarkenedSubject = new BehaviorSubject<boolean>(false);
  isDarkened$ = this.isDarkenedSubject.asObservable();

  setDarkened(isDarkened: boolean) {
    this.isDarkenedSubject.next(isDarkened);
  }
}