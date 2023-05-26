import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(public afAuth: AngularFireAuth) {}
  async loginWithGoogle() {
    try {
      await this.afAuth.signInWithRedirect(new GoogleAuthProvider());
    } catch (error) {
      console.log('Error on user login:', error);
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log('Error on logout:', error);
    }
  }
}
