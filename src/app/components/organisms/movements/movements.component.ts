import { Component } from '@angular/core';

import { map } from 'rxjs';

import { DialogService } from 'src/app/services/dialog.service';
import { FirestoreService } from '../../../services/firestore.service';
import { MovementsService } from 'src/app/services/movements.service';
import { PaginationService } from '../../../services/pagination.service';
import { SummaryService } from 'src/app/services/summary.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css'],
})
export class MovementsComponent {
  // filteredMovement$: Observable<Movement[]>;
  // filterAndSortBy: FilterAndSort = { type: 'all', sortBy: 'date' };
  // pagination: PaginationService;

  idMovementUpdateOpen: string = '';

  constructor(
    private dialogService: DialogService,
    public firestoreService: FirestoreService,
    public movementsService: MovementsService,
    public paginationService: PaginationService,
    public summaryService: SummaryService
  ) {
    this.movementsService.dateFilters.year = new Date().getFullYear();
    this.movementsService.dateFilters.month = new Date().getMonth() + 1;

    // this.summaryService.filters.year = new Date().getFullYear();
    // this.summaryService.filters.month = new Date().getMonth() + 1;

    // this.filteredMovement$ = this.summaryService.filterMovements();

    // this.pagination = this.paginationService;
    this.paginationService.currentPage = 1;

    this.movementsService.filteredMovements
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.paginationService.calculateNumberOfPages(arrayLength);
      });
  }

  // handlerMovementsFilterAndSort() {
  //   this.filteredMovement$ = this.firestoreService.filterAndSortDocs(
  //     this.summaryService.filterMovements(),
  //     this.filterAndSortBy
  //   );
  //   this.filteredMovement$
  //     .pipe(map((array) => array.length))
  //     .subscribe((arrayLength) => {
  //       this.pagination.calculateNumberOfPages(arrayLength);
  //     });
  //   this.pagination.currentPage = 1;
  // }

  // handlerClickMovementUpdate(movementId: string) {
  //   if (this.idMovementUpdateOpen === movementId) {
  //     this.idMovementUpdateOpen = '';
  //   } else {
  //     this.idMovementUpdateOpen = movementId;
  //   }
  // }

  handlerEraseAllMovements() {
    this.dialogService.openConfirmDialog(
      'Tem a certeza que pretende apagar todos os movimentos?',
      () => this.movementsService.deleteAllMovements()
    );
  }
}
