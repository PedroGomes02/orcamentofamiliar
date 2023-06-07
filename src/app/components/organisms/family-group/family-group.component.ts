import { Component } from '@angular/core';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-family-group',
  templateUrl: './family-group.component.html',
  styleUrls: ['./family-group.component.css'],
})
export class FamilyGroupComponent {
  userEmail: string = '';
  isUpdateGroupOpen: boolean = false;

  constructor(
    public authService: AuthenticationService,
    public firestoreService: FirestoreService,
    public membersService: MembersService
  ) {
    this.authService.afAuth.authState.subscribe((user) => {
      this.userEmail = user?.email || '';
    });
  }
  toogleUpdateGroup() {
    this.isUpdateGroupOpen = !this.isUpdateGroupOpen;
  }
  onFormSubmitted() {
    this.isUpdateGroupOpen = false;
  }
}
