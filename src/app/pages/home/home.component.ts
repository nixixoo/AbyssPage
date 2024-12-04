import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CreatorService } from '../../services/creator.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  searchQuery: string = '';
  isSearchActive: boolean = false;
  searchResults: any[] = [];

  constructor(
    private router: Router,
    private creatorService: CreatorService
  ) {}

  async onSearch() {
    if (this.searchQuery.trim()) {
      this.searchResults = await this.creatorService.searchCreators(this.searchQuery);
    }
  }

  navigateToProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }

  toggleSearch(active: boolean) {
    this.isSearchActive = active;
  }
}
