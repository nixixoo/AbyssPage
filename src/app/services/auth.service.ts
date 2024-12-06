import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, query, collection, where, getDocs } from '@angular/fire/firestore';
import { Creator } from '../interfaces/creator.interface';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Creator | null>(null);
  public currentUser$: Observable<Creator | null> = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private firebaseReady: Promise<boolean>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('AuthService: Initializing...');
    
    this.firebaseReady = new Promise<boolean>((resolve) => {
      if (isPlatformBrowser(this.platformId)) {
        console.log('AuthService: Setting up Firebase auth...');
        setPersistence(this.auth, browserLocalPersistence);
        
        onAuthStateChanged(this.auth, async (user) => {
          console.log('AuthService: Auth state changed:', !!user);
          if (user) {
            const userDoc = await getDoc(doc(this.firestore, 'creators', user.uid));
            if (userDoc.exists()) {
              console.log('AuthService: User data found, setting authenticated');
              this.currentUserSubject.next(userDoc.data() as Creator);
              this.isAuthenticatedSubject.next(true);
              resolve(true);
            } else {
              console.log('AuthService: No user data found');
              this.currentUserSubject.next(null);
              this.isAuthenticatedSubject.next(false);
              resolve(false);
            }
          } else {
            console.log('AuthService: No user, setting not authenticated');
            this.currentUserSubject.next(null);
            this.isAuthenticatedSubject.next(false);
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  }

  private getUserEmail(username: string): string {
    return `${username.toLowerCase()}@abyss-users.com`;
  }

  async login(username: string, password: string, rememberMe: boolean = false) {
    try {
      const email = this.getUserEmail(username);
      
      // First, check if username exists
      const usersRef = collection(this.firestore, 'creators');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Invalid username or password');
      }

      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      if (isPlatformBrowser(this.platformId)) {
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
      }

      const userDoc = await getDoc(doc(this.firestore, 'creators', userCredential.user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
      
      const userData = userDoc.data() as Creator;
      this.currentUserSubject.next(userData);
      this.isAuthenticatedSubject.next(true);
      return userData;

    } catch (error: any) {
      throw new Error('Invalid username or password');
    }
  }

  async register(username: string, password: string) {
    try {
      const usersRef = collection(this.firestore, 'creators');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('Username already exists');
      }

      const email = this.getUserEmail(username);
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      const newCreator: Creator = {
        uid: userCredential.user.uid,
        username: username,
        characters: {},
        constellations: {},
        socialLinks: {}
      };

      await setDoc(doc(this.firestore, 'creators', userCredential.user.uid), newCreator);
      return newCreator;

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('token');
      }
    } catch (error: any) {
      throw new Error('Error logging out');
    }
  }

  getRememberedUsername(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('rememberedUsername');
    }
    return null;
  }

  async getCurrentUser(): Promise<Creator | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(this.firestore, 'creators', user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as Creator;
    }
    return null;
  }

  async isFirebaseReady() {
    console.log('AuthService: Waiting for Firebase and auth state...');
    const isAuthenticated = await this.firebaseReady;
    console.log('AuthService: Firebase ready, authenticated:', isAuthenticated);
    return isAuthenticated;
  }
}
