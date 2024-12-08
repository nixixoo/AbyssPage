import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamRequest } from '../../interfaces/team-request.interface';
import { Character, characterList } from '../../constants/character-list';
import { TeamRequestService } from '../../services/team-request.service';
import {AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../components/header/header.component';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-team-see',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './team-see.component.html',
  styleUrls: ['./team-see.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.5s ease-out', style({ 
          opacity: 0
        }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate('0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ transform: 'scale(0.8)', opacity: 0, height: 0, margin: 0, padding: 0 }))
      ])
    ])
  ]
})
export class TeamSeeComponent implements OnInit, OnDestroy {
  pendingRequests: TeamRequest[] = [];
  approvedRequests: TeamRequest[] = [];
  characterList = characterList;
  isLoading: boolean = true;
  errorMessage: string = '';
  removingRequests: Set<string> = new Set();
  displayContent: boolean = false;
  isMobile = false;
  currentFilter: 'pending' | 'approved' = 'pending';

  constructor(
    private teamRequestService: TeamRequestService,
    private authService: AuthService
  ) {
    // Check if mobile on init
    this.checkIfMobile();
    // Listen for window resize
    window.addEventListener('resize', () => this.checkIfMobile());
  }

  ngOnInit() {
    this.loadRequests();
  }

  private checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  setFilter(filter: 'pending' | 'approved') {
    this.currentFilter = filter;
  }

  ngOnDestroy() {
    // Clean up event listener
    window.removeEventListener('resize', () => this.checkIfMobile());
  }

  loadRequests() {
    this.isLoading = true;
    this.displayContent = false;

    // Force minimum 1.5 seconds loading time to match characters page
    const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 1000));
    
    this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user?.uid) {
          return this.teamRequestService.getRequestsForUser(user.uid);
        }
        return of([]);
      })
    ).subscribe({
      next: async (requests) => {
        // Wait for minimum loading time
        await minimumLoadingTime;
        
        this.pendingRequests = requests.filter(req => !req.approved);
        this.approvedRequests = requests.filter(req => req.approved);
        this.isLoading = false;

        // Show content after a small delay
        setTimeout(() => {
          this.displayContent = true;
        }, 300);
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.errorMessage = 'Error loading team requests. Please try again.';
        this.isLoading = false;
        this.displayContent = true;
      }
    });
  }

  getCharacterDetails(characterId: string): Character | undefined {
    return this.characterList.find(char => char.id === characterId);
  }

  acceptRequest(requestId: string) {
    event?.stopPropagation();
    this.teamRequestService.updateRequest(requestId, { approved: true }).then(() => {
      const requestToMove = this.pendingRequests.find(req => req.id === requestId);
      if (requestToMove) {
        this.pendingRequests = this.pendingRequests.filter(req => req.id !== requestId);
        requestToMove.approved = true;
        this.approvedRequests = [...this.approvedRequests, requestToMove];
      }
    }).catch(error => {
      console.error('Error accepting request:', error);
      this.errorMessage = 'Error accepting request. Please try again.';
    });
  }

  rejectRequest(requestId: string) {
    event?.stopPropagation();
    this.pendingRequests = this.pendingRequests.filter(req => req.id !== requestId);
    
    this.teamRequestService.deleteRequest(requestId).catch(error => {
      console.error('Error rejecting request:', error);
      this.errorMessage = 'Error rejecting request. Please try again.';
      this.loadRequests();
    });
  }

  markAsReady(requestId: string) {
    event?.stopPropagation();
    this.removingRequests.add(requestId);
    
    // Wait for animation
    setTimeout(() => {
      this.approvedRequests = this.approvedRequests.filter(req => req.id !== requestId);
      
      this.teamRequestService.deleteRequest(requestId).catch(error => {
        console.error('Error marking request as ready:', error);
        this.errorMessage = 'Error removing request. Please try again.';
        this.removingRequests.delete(requestId);
        this.loadRequests();
      });
    }, 300); // Match animation duration
  }
}


