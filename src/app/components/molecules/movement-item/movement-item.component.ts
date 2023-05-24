import { Component, Input } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
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
  selectedMovementId: string = '';
  showCategoryControlButtons: boolean = false;

  constructor(
    public firestoreService: FirestoreService,
    public summaryService: SummaryService,
    private dialogService: DialogService
  ) {}

  toggleShowControlButtons() {
    this.showCategoryControlButtons = !this.showCategoryControlButtons;
    this.selectedMovementId = '';
  }

  handlerMovementToUpdate(movementId: string) {
    if (this.selectedMovementId === movementId) {
      this.selectedMovementId = '';
    } else {
      this.selectedMovementId = movementId;
    }
  }

  handlerMovementToDelete(movementId: string) {
    this.dialogService.openConfirmDialog(
      'Deseja apagar este movimento? Confirme por favor!',
      () => this.firestoreService.deleteDoc('movements', movementId)
    );
  }
}
