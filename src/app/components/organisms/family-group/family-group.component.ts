import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-family-group',
  templateUrl: './family-group.component.html',
  styleUrls: ['./family-group.component.css'],
})
export class FamilyGroupComponent {
  constructor(
    public afAuth: AngularFireAuth,
    public firestoreService: FirestoreService
  ) {}
}
