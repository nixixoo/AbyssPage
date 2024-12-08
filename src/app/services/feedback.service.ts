import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Feedback } from '../interfaces/feedback.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  async sendFeedback(message: string): Promise<void> {
    try {
      const user = await this.authService.getCurrentUser();
      
      const feedback: any = {
        message,
        createdAt: new Date(),
        userId: user?.uid || 'anonymous',
        username: user?.username || 'anonymous'
      };

      const feedbackRef = collection(this.firestore, 'feedback');
      await addDoc(feedbackRef, feedback);
    } catch (error) {
      console.error('Error sending feedback:', error);
      throw new Error('Failed to send feedback');
    }
  }
} 