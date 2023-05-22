import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from './services/dialog.service';
import { FirestoreService } from './services/firestore.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'Orçamento Familiar';
  isShowingLogIn: boolean = false;
  isShowingGroupMenu: boolean = false;
  isLoading: boolean = true;
  isPrivacyOpen: boolean = false;

  constructor(
    private authService: AuthenticationService,
    public firestoreService: FirestoreService,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isLoading = false;
      } else {
        this.isShowingLogIn = true;
      }
    });

    this.firestoreService.groupIdData.subscribe((data) => {
      if (data) {
        this.isLoading = false;
      } else {
        this.isShowingGroupMenu = true;
      }
    });
  }

  togglePrivacy(): void {
    this.isPrivacyOpen = !this.isPrivacyOpen;
  }
}
