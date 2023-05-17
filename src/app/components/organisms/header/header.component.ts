import { Component, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input()
  title: string = '';
  showLogIn = false;
  isLoading = true;

  constructor(
    public afAuth: AngularFireAuth,
    public authService: AuthenticationService,
    public firestoreService: FirestoreService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isLoading = false;
      } else {
        this.showLogIn = true;
      }
    });
  }
  // async loginWithGoogle() {
  //   try {
  //     await this.afAuth.signInWithRedirect(new GoogleAuthProvider());
  //   } catch (error) {
  //     console.log('Erro ao autenticar usuário:', error);
  //   }
  // }

  // async logout() {
  //   try {
  //     await this.afAuth.signOut();
  //   } catch (error) {
  //     console.log('Erro ao sair:', error);
  //   }
  // }

  // click() {
  //   console.log(this.afAuth.authState);
  //   // this.afAuth.user.subscribe((doc) => this.auth = doc);
  //   // this.afAuth.authState.subscribe((doc) => console.log(doc?.displayName));
  // }
}
