import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CreatorService } from '../../services/creator.service';
import { Creator } from '../../interfaces/creator.interface';
import { UiService } from '../../services/ui.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('searchResults', [
      transition(':enter', [
        query('.user-result', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ]),
      transition(':leave', [
        query('.user-result', [
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(10px)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('resultItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class HomeComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  searchQuery: string = '';
  isSearchActive: boolean = false;
  searchResults: Creator[] = [];
  searchTimeout: any;
  private isTransitioning: boolean = false;

  constructor(
    private router: Router,
    private creatorService: CreatorService,
    private uiService: UiService
  ) {}

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    
    if (this.isTransitioning || clickedElement.closest('.search-container')) {
      return;
    }

    if (this.isSearchActive) {
      setTimeout(() => {
        this.toggleSearch(false);
      }, 200);
    }
  }

  onInputFocus() {
    this.toggleSearch(true);
  }

  async onSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(async () => {
      if (this.searchQuery.trim()) {
        try {
          this.searchResults = await this.creatorService.searchCreators(this.searchQuery);
        } catch (error) {
          this.searchResults = [];
        }
      } else {
        this.searchResults = [];
      }
    }, 300);
  }

  navigateToProfile(username: string) {
    this.toggleSearch(false);
    this.router.navigate(['/profile', username]);
  }

  toggleSearch(active: boolean) {
    if (active) {
      this.isTransitioning = true;
      this.isSearchActive = true;
      this.uiService.setDarkened(true);
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    } else {
      this.isSearchActive = false;
      this.uiService.setDarkened(false);
      this.searchQuery = '';
      this.searchResults = [];
    }
  }
}
