import { Injectable } from '@angular/core';
import { Observable, combineLatest, map, reduce } from 'rxjs';

import { FirestoreService } from 'src/app/services/firestore.service';
import { Movement } from '../types';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  movement$: Observable<Movement[]>;

  incomeMovement$: Observable<Movement[]>;
  savingsMovement$: Observable<Movement[]>;
  expenseMovement$: Observable<Movement[]>;

  incomeTotal: Observable<number>;
  savingsTotal: Observable<number>;
  expenseTotal: Observable<number>;

  filteredMovement$: Observable<Movement[]>;
  filters: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };

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

  incomeSummaryByCategorie$: Observable<any>;
  savingsSummaryByCategorie$: Observable<any>;
  expenseSummaryByCategorie$: Observable<any>;

  constructor(public firestoreService: FirestoreService) {
    this.movement$ = this.firestoreService.getMovements();
    this.filteredMovement$ = this.filterMovements();

    this.years = this.getYears();

    this.incomeMovement$ = this.getFilteredMovementsByType('income');
    this.savingsMovement$ = this.getFilteredMovementsByType('savings');
    this.expenseMovement$ = this.getFilteredMovementsByType('expense');

    this.incomeTotal = this.getFilteredMovementsTotalsByType(
      this.incomeMovement$
    );
    this.savingsTotal = this.getFilteredMovementsTotalsByType(
      this.savingsMovement$
    );
    this.expenseTotal = this.getFilteredMovementsTotalsByType(
      this.expenseMovement$
    );

    this.incomeSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('income');
    this.savingsSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('savings');
    this.expenseSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('expense');
  }

  getYears(): Observable<number[]> {
    return this.movement$.pipe(
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

  filterMovements() {
    return this.movement$.pipe(
      map((movements: Movement[]) =>
        movements
          .filter(
            (movement: Movement) =>
              new Date(movement.date).getFullYear() === this.filters.year
          )
          .filter(
            (movement: Movement) =>
              new Date(movement.date).getMonth() + 1 === this.filters.month
          )
      )
    );
  }

  getFilteredMovementsByType(movementsType: string) {
    return this.filteredMovement$.pipe(
      map((movements) =>
        movements.filter((movement) => movement.type === movementsType)
      )
    );
  }

  getFilteredMovementsTotalsByType(movementsByType: Observable<any>) {
    return movementsByType.pipe(
      map((movements) =>
        movements.reduce(
          (total: number, movement: { value: any }) =>
            total + Number(movement.value),
          0
        )
      )
    );
  }

  getFilteredMovementsTypeSummaryByCategories(movementType: string) {
    const selectedTypeCategories$ = this.firestoreService
      .getCategories()
      .pipe(
        map((categories) =>
          categories.filter((category) => category.type === movementType)
        )
      );

    // const selectedCategorySubCategorie$ = selectedTypeCategories$.pipe(
    //   map((categories) =>
    //     categories.filter((category) => category.subCategories)
    //   )
    // );

    const selectedTypeMovement$ = this.filteredMovement$.pipe(
      map((movements) =>
        movements.filter((movement) => movement.type === movementType)
      )
    );

    return combineLatest([selectedTypeCategories$, selectedTypeMovement$]).pipe(
      map(([categories, movements]) =>
        categories.map((category) => {
          const accumulatedValue = movements
            .filter((movement) => movement.category === category.name)
            .reduce((acc, movement) => Number(acc) + Number(movement.value), 0);

          if (category.subCategories) {
            const accumulatedSubCategoryValue = movements
              .filter((movement) => movement.category === category.name)
              .reduce(
                (acc, movement) => Number(acc) + Number(movement.value),
                0
              );
          }

          return {
            avatar: category.avatar,
            category: category.name,
            accumulatedValue: accumulatedValue.toFixed(2),
          };
        })
      )
    );
  }

  handlerChangeFilters() {
    this.filteredMovement$ = this.filterMovements();

    this.incomeTotal = this.getFilteredMovementsTotalsByType(
      this.incomeMovement$
    );
    this.savingsTotal = this.getFilteredMovementsTotalsByType(
      this.savingsMovement$
    );
    this.expenseTotal = this.getFilteredMovementsTotalsByType(
      this.expenseMovement$
    );

    this.incomeSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('income');
    this.savingsSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('savings');
    this.expenseSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('expense');
  }
}
