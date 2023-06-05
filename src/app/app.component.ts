import { Component } from '@angular/core';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from './services/firestore.service';
import { HorizontalSwipeService } from './services/horizontal-swipe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'Orçamento Familiar';
  isShowingLogIn: boolean = false;
  isPrivacyOpen: boolean = false;

  constructor(
    private authService: AuthenticationService,
    public firestoreService: FirestoreService,
    public horizontalSwipeService: HorizontalSwipeService
  ) {}

  ngOnInit(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (!user) {
        this.isShowingLogIn = true;
      }
    });

    this.firestoreService.currentGroup
      .forEach(() => {
        this.firestoreService.isLoading = false;
      })
      .catch(() => {
        this.firestoreService.isShowingStartGroupMenu = true;
      });
  }

  togglePrivacy(): void {
    this.isPrivacyOpen = !this.isPrivacyOpen;
  }
}
