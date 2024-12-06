import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CreatorService } from '../../services/creator.service';
import { Creator } from '../../interfaces/creator.interface';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
    const searchContainer = document.querySelector('.search-container');
    if (this.isSearchActive && searchContainer && !searchContainer.contains(event.target as Node)) {
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
          console.error('Error searching creators:', error);
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
    this.isSearchActive = active;
    this.uiService.setDarkened(active);
    if (!active) {
      setTimeout(() => {
        this.searchQuery = '';
        this.searchResults = [];
      }, 300);
    }
  }
}
