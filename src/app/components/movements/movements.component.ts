import { Component } from '@angular/core';

import { map, Observable } from 'rxjs';

import { FirestoreService } from '../../services/firestore.service';
import { PaginationService } from '../../services/pagination.service';

import { Movement } from '../../types';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css'],
})
export class MovementsComponent {
  movement$: Observable<Movement[]>;
  filteredMovement$: Observable<Movement[]>;
  filterAndSortBy: any = { movementType: 'all', sortBy: 'date' };
  pagination: any;

  constructor(
    public firestoreService: FirestoreService,
    public paginationService: PaginationService
  ) {
    this.movement$ = this.firestoreService.getMovements();
    this.filteredMovement$ = this.movement$;
    this.pagination = this.paginationService;

    this.filteredMovement$
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.pagination.calculateNumberOfPages(arrayLength);
      });
  }

  handlerMovementsFilterAndSort() {
    if (this.filterAndSortBy.movementType === 'all') {
      this.filteredMovement$ = this.movement$.pipe(
        map((movements) =>
          movements.sort((a: any, b: any) =>
            b[this.filterAndSortBy.sortBy].localeCompare(
              a[this.filterAndSortBy.sortBy]
            )
          )
        )
      );
    } else {
      this.filteredMovement$ = this.movement$.pipe(
        map((movements) =>
          movements
            .sort((a: any, b: any) =>
              b[this.filterAndSortBy.sortBy].localeCompare(
                a[this.filterAndSortBy.sortBy]
              )
            )
            .filter(
              (movement) => movement.type === this.filterAndSortBy.movementType
            )
        )
      );
    }
  }
}
