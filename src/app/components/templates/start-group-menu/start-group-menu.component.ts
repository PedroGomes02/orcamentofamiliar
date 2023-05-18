import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-start-group-menu',
  templateUrl: './start-group-menu.component.html',
  styleUrls: ['./start-group-menu.component.css'],
})
export class StartGroupMenuComponent {
  constructor(public firestoreService: FirestoreService) {}
}
