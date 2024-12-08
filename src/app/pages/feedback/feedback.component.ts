import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { Feedback } from '../../interfaces/feedback.interface';
import { FeedbackService } from '../../services/feedback.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent
  ],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  feedback: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private feedbackService: FeedbackService,
    private router: Router
  ) {}

  async onSendFeedback() {
    if (!this.feedback.trim()) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.feedbackService.sendFeedback(this.feedback);
      this.feedback = '';
      this.successMessage = 'Feedback sent successfully!';
      
      // Redirect after showing success message
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
      
    } catch (error: any) {
      console.error('Error sending feedback:', error);
      this.errorMessage = 'Failed to send feedback. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
} 