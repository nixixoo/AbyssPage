import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, query, where, getDocs, updateDoc } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Creator } from '../interfaces/creator.interface';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class CreatorService {
  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  // Create a new creator profile with username validation
  async createCreator(creator: Creator) {
    // Check if username is already taken
    const exists = await this.isUsernameTaken(creator.username);
    if (exists) {
      throw new Error('Username already taken');
    }

    const creatorsRef = collection(this.firestore, 'creators');
    return setDoc(doc(creatorsRef, creator.uid), creator);
  }

  // Check if username is taken
  async isUsernameTaken(username: string): Promise<boolean> {
    const creatorsRef = collection(this.firestore, 'creators');
    const q = query(creatorsRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // Get creator by username
  getCreatorByUsername(username: string): Observable<Creator | null> {
    const creatorsRef = collection(this.firestore, 'creators');
    return from(
      getDocs(query(creatorsRef, where('username', '==', username)))
    ).pipe(
      map(querySnapshot => {
        if (querySnapshot.empty) return null;
        const doc = querySnapshot.docs[0];
        return { ...doc.data(), uid: doc.id } as Creator;
      })
    );
  }

  // Get creator by ID (keep this for internal use)
  getCreator(creatorId: string): Observable<Creator | null> {
    const creatorRef = doc(this.firestore, 'creators', creatorId);
    return from(getDoc(creatorRef)).pipe(
      map(doc => {
        if (doc.exists()) {
          return { ...doc.data(), uid: doc.id } as Creator;
        }
        return null;
      })
    );
  }

  // Update the profile component to use username
  updateCreator(creator: Creator): Observable<Creator> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('No authenticated user'));
    }

    const creatorDocRef = doc(this.firestore, 'creators', user.uid);
    
    return from(updateDoc(creatorDocRef, { ...creator })).pipe(
      map(() => creator),
      catchError(error => {
        return throwError(() => new Error('Failed to update creator'));
      })
    );
  }

  // Validate username format
  validateUsername(username: string): boolean {
    // Only allow letters, numbers, and underscores, 3-20 characters
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  // Search creators by username
  async searchCreators(searchTerm: string): Promise<Creator[]> {
    const creatorsRef = collection(this.firestore, 'creators');
    // Search for usernames that start with the search term
    const q = query(
      creatorsRef, 
      where('username', '>=', searchTerm),
      where('username', '<=', searchTerm + '\uf8ff')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      ...doc.data(), 
      uid: doc.id 
    } as Creator));
  }
}