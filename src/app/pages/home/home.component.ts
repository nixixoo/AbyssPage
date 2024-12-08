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

  constructor(
    private router: Router,
    private creatorService: CreatorService,
    private uiService: UiService
  ) {}

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    
    const isSearchInput = clickedElement.classList.contains('search-input');
    const isWithinSearchResults = clickedElement.closest('.search-results');
    const isSearchIcon = clickedElement.closest('.search-icon');
    
    if (isSearchInput || isSearchIcon) {
      return;
    }

    const searchContainer = document.querySelector('.search-container');
    
    if (this.isSearchActive && 
        searchContainer && 
        !searchContainer.contains(event.target as Node) && 
        !isWithinSearchResults) {
      this.toggleSearch(false);
      if (this.searchInput) {
        this.searchInput.nativeElement.blur();
      }
    }
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
      this.isSearchActive = true;
      this.uiService.setDarkened(true);
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 0);
    } else {
      setTimeout(() => {
        this.isSearchActive = false;
        this.uiService.setDarkened(false);
        this.searchQuery = '';
        this.searchResults = [];
      }, 100);
    }
  }
}
