import { Component } from '@angular/core';

import { map, Observable } from 'rxjs';

import { FirestoreService } from '../../../services/firestore.service';
import { PaginationService } from '../../../services/pagination.service';

import { FilterAndSort, Movement } from '../../../types';
import { SummaryService } from 'src/app/services/summary.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css'],
})
export class MovementsComponent {
  movement$: Observable<Movement[]>;
  filteredMovement$: Observable<Movement[]>;
  filterAndSortBy: FilterAndSort = { type: 'all', sortBy: 'date' };
  pagination: PaginationService;

  idMovementUpdateOpen: string = '';

  constructor(
    public firestoreService: FirestoreService,
    public paginationService: PaginationService,
    public summaryService: SummaryService,
    private dialogService: DialogService
  ) {
    this.summaryService.filters.year = new Date().getFullYear();
    this.summaryService.filters.month = new Date().getMonth() + 1;

    this.movement$ = this.firestoreService.getMovements();
    this.filteredMovement$ = this.summaryService.filterMovements();

    this.pagination = this.paginationService;
    this.pagination.currentPage = 1;

    this.filteredMovement$
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.pagination.calculateNumberOfPages(arrayLength);
      });
  }

  handlerMovementsFilterAndSort() {
    this.filteredMovement$ = this.firestoreService.filterAndSortDocs(
      this.summaryService.filterMovements(),
      this.filterAndSortBy
    );
    this.filteredMovement$
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.pagination.calculateNumberOfPages(arrayLength);
      });
    this.pagination.currentPage = 1;
  }

  handlerClickMovementUpdate(movementId: string) {
    if (this.idMovementUpdateOpen === movementId) {
      this.idMovementUpdateOpen = '';
    } else {
      this.idMovementUpdateOpen = movementId;
    }
  }

  handlerEraseAllMovements() {
    this.dialogService.openConfirmDialog(
      'Tem a certeza que pretende apagar todos os movimentos?',
      () => this.firestoreService.batchDeleteMovements()
    );
  }
}
