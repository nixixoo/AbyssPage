import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, query, collection, where, getDocs } from '@angular/fire/firestore';
import { Creator } from '../interfaces/creator.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkRememberedUser();
    }
  }

  private checkRememberedUser() {
    if (isPlatformBrowser(this.platformId)) {
      const rememberedUsername = localStorage.getItem('rememberedUsername');
      if (rememberedUsername) {
        console.log('Found remembered user:', rememberedUsername);
      }
    }
  }

  private getUserEmail(username: string): string {
    return `${username.toLowerCase()}@abyss-users.com`;
  }

  private rememberUser(username: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('rememberedUsername', username);
    }
  }

  private forgetUser() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('rememberedUsername');
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
        socialLinks: {}
      };

      await setDoc(doc(this.firestore, 'creators', userCredential.user.uid), newCreator);
      return newCreator;

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async login(username: string, password: string, rememberMe: boolean = false) {
    try {
      const email = this.getUserEmail(username);
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      if (rememberMe) {
        this.rememberUser(username);
      } else {
        this.forgetUser();
      }

      const userDoc = await getDoc(doc(this.firestore, 'creators', userCredential.user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
      
      return userDoc.data() as Creator;

    } catch (error: any) {
      throw new Error('Invalid username or password');
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.forgetUser();
    } catch (error: any) {
      throw new Error('Error logging out');
    }
  }

  async getCurrentUser(): Promise<Creator | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(this.firestore, 'creators', user.uid));
    return userDoc.exists() ? (userDoc.data() as Creator) : null;
  }

  getRememberedUsername(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('rememberedUsername');
    }
    return null;
  }
}
