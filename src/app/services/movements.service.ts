import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { FilterAndSort, Movement } from '../types';
import { FirestoreService } from './firestore.service';
import { PaginationService } from './pagination.service';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  movementsCollectionRef: AngularFirestoreCollection<Movement>;
  movements: Observable<Movement[]>;

  years: Observable<number[]>;
  months: string[] = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];

  dateFilters: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };

  filterAndSortMovementsBy: FilterAndSort = {
    type: 'all',
    sortBy: 'date',
  };
  filteredMovements: Observable<Movement[]>;

  constructor(
    private firestoreService: FirestoreService,
    private paginationService: PaginationService
  ) {
    this.movementsCollectionRef =
      this.firestoreService.groupMovementsCollectionRef;
    this.movements = this.getMovements();

    this.years = this.getYears();

    this.filteredMovements = this.getFilteredMovements();
  }

  getYears(): Observable<number[]> {
    return this.movements.pipe(
      map((movements: Movement[]) => {
        const yearsSet = movements.reduce((acc, movement) => {
          const year = new Date(movement.date).getFullYear();
          acc.add(year);
          return acc;
        }, new Set<number>());
        return [...yearsSet];
      })
    );
  }

  getMovements() {
    return this.firestoreService.getCollectionDocs<Movement>(
      this.movementsCollectionRef
    );
  }

  dateFilterMovements() {
    return this.movements.pipe(
      map((movements: Movement[]) =>
        movements
          .filter(
            (movement: Movement) =>
              new Date(movement.date).getFullYear() === this.dateFilters.year
          )
          .filter(
            (movement: Movement) =>
              new Date(movement.date).getMonth() + 1 === this.dateFilters.month
          )
      )
    );
  }

  getFilteredMovements() {
    return this.firestoreService.filterAndSortDocs<Movement>(
      this.dateFilterMovements(),
      this.filterAndSortMovementsBy
    );
  }

  refreshMovements() {
    this.movements = this.getMovements();
    this.filteredMovements = this.getFilteredMovements();
    this.filteredMovements
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.paginationService.calculateNumberOfPages(arrayLength);
      });
    this.paginationService.currentPage = 1;
  }

  handlerFilterAndSortMovementsBy() {
    this.refreshMovements()
  }

  async addNewMovement(newMovement: Movement) {
    await this.firestoreService.addNewDocToCollection<Movement>(
      this.movementsCollectionRef,
      newMovement
    );
    this.refreshMovements();
  }

  async updateMovement(movementId: string, updatedMovement: Movement) {
    await this.firestoreService.updateDocOnCollection<Movement>(
      this.movementsCollectionRef,
      movementId,
      updatedMovement
    );
    this.refreshMovements();
  }

  async deleteMovement(movementId: string) {
    await this.firestoreService.deleteDocFromCollection<Movement>(
      this.movementsCollectionRef,
      movementId
    );
    this.refreshMovements();
  }

  async deleteAllMovements() {
    await this.firestoreService.batchDeleteAllCollectionDocs<Movement>(
      this.movementsCollectionRef
    );
    this.refreshMovements();
  }
}
