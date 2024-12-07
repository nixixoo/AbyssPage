import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeamRequest } from '../interfaces/team-request.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamRequestService {
  constructor(
    private firestore: Firestore
  ) {}

  // Create a new team request
  async createTeamRequest(request: TeamRequest): Promise<string> {
    const requestsRef = collection(this.firestore, 'teamRequests');
    const docRef = await addDoc(requestsRef, request);
    return docRef.id;
  }

  // Get requests sent to a specific user
  getRequestsForUser(userId: string): Observable<TeamRequest[]> {
    const requestsRef = collection(this.firestore, 'teamRequests');
    const q = query(requestsRef, where('toUserId', '==', userId));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as TeamRequest))
      )
    );
  }

  // Get requests sent by a specific user
  getRequestsByUser(userId: string): Observable<TeamRequest[]> {
    const requestsRef = collection(this.firestore, 'teamRequests');
    const q = query(requestsRef, where('fromUserId', '==', userId));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as TeamRequest))
      )
    );
  }

  // Delete a team request
  async deleteRequest(requestId: string): Promise<void> {
    const requestRef = doc(this.firestore, 'teamRequests', requestId);
    await deleteDoc(requestRef);
  }

  // Add this method to your service
  async updateRequest(requestId: string, updates: Partial<TeamRequest>): Promise<void> {
    const requestRef = doc(this.firestore, 'teamRequests', requestId);
    await updateDoc(requestRef, updates);
  }
} 