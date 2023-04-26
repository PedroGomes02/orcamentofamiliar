import { Component, Input } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Movement } from 'src/app/types';

@Component({
  selector: 'app-movement-item',
  templateUrl: './movement-item.component.html',
  styleUrls: ['./movement-item.component.css'],
})
export class MovementItemComponent {
  @Input()
  movementItem!: Movement;
  idMovementUpdateOpen: string = '';

  constructor(public firestoreService: FirestoreService) {}

  handlerClickMovementUpdate(movementId: string) {
    if (this.idMovementUpdateOpen === movementId) {
      this.idMovementUpdateOpen = '';
    } else {
      this.idMovementUpdateOpen = movementId;
    }
  }
}
