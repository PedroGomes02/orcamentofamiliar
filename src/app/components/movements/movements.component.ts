import { Component } from '@angular/core';

import { map, Observable } from 'rxjs';

import { FirestoreService } from '../../services/firestore.service';
import { PaginationService } from '../../services/pagination.service';

import { FilterAndSort, Movement } from '../../types';

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
    public paginationService: PaginationService
  ) {
    this.movement$ = this.firestoreService.getMovements();
    this.filteredMovement$ = this.movement$;
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
      this.movement$,
      this.filterAndSortBy
    );
    this.filteredMovement$
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.pagination.calculateNumberOfPages(arrayLength);
      });
  }

  handlerClickMovementUpdate(movementId: string) {
    if (this.idMovementUpdateOpen === movementId) {
      this.idMovementUpdateOpen = '';
    } else {
      this.idMovementUpdateOpen = movementId;
    }
  }
}
