import { Component, Input } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SummaryService } from 'src/app/services/summary.service';
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
  showControlButtons: boolean = false;

  constructor(
    public firestoreService: FirestoreService,
    public summaryService: SummaryService
  ) {}

 handlershowControlButtons() {
    this.showControlButtons = !this.showControlButtons;
    this.idMovementUpdateOpen = '';
  }

  handlerClickMovementUpdate(movementId: string) {
    if (this.idMovementUpdateOpen === movementId) {
      this.idMovementUpdateOpen = '';
    } else {
      this.idMovementUpdateOpen = movementId;
    }
  }

  handlerClickMovementDelete(movementId: string) {
    if (confirm('Deseja apagar este movimento? Confirme por favor!')) {
      this.firestoreService.deleteDoc('movements', movementId);
    }
  }
}
