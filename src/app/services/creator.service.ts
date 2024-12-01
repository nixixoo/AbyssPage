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

  // Create a new creator profile
  async createCreator(creator: Creator) {
    const creatorsRef = collection(this.firestore, 'creators');
    return setDoc(doc(creatorsRef, creator.uid), creator);
  }

  // Update character ownership and constellations
  async updateCharacter(creatorId: string, characterId: string, owned: boolean, cons: number) {
    const creatorRef = doc(this.firestore, 'creators', creatorId);
    return setDoc(creatorRef, {
      characters: {
        [characterId]: { owned, cons }
      }
    }, { merge: true });
  }

  // Get creator by ID
  getCreator(creatorId: string): Observable<any> {
    const creatorRef = doc(this.firestore, 'creators', creatorId);
    return from(getDoc(creatorRef));
  }

  // Search creators by username
  async searchCreators(searchTerm: string) {
    const creatorsRef = collection(this.firestore, 'creators');
    const q = query(creatorsRef, where('username', '>=', searchTerm));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  updateCreator(creator: Creator): Observable<Creator> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('No authenticated user'));
    }

    const creatorDocRef = doc(this.firestore, 'creators', user.uid);
    
    return from(updateDoc(creatorDocRef, { ...creator })).pipe(
      map(() => creator),
      catchError(error => {
        console.error('Error updating creator:', error);
        return throwError(() => new Error('Failed to update creator'));
      })
    );
  }
}