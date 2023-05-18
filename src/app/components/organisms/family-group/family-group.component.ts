import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-family-group',
  templateUrl: './family-group.component.html',
  styleUrls: ['./family-group.component.css'],
})
export class FamilyGroupComponent {
  userEmail: string = '';

  constructor(
    public authService: AuthenticationService,
    public firestoreService: FirestoreService
  ) {
    this.authService.afAuth.authState.subscribe((user) => {
      this.userEmail = user?.email || '';
    });
  }
}
