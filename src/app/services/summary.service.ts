import { Injectable } from '@angular/core';
import { Observable, combineLatest, from, map, reduce } from 'rxjs';

import { FirestoreService } from 'src/app/services/firestore.service';
import { Movement } from '../types';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  summaryMovement$: Observable<Movement[]>;

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
    // this.summaryMovement$ = this.getGroupMovementsQuerySnapshot();//QUERYSNAPSHOT!
    this.summaryMovement$ = this.firestoreService.getGroupMovements();

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
    return this.summaryMovement$.pipe(
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
    return this.summaryMovement$.pipe(
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
      .getGroupCategories()
      .pipe(
        map((categories) =>
          categories.filter((category) => category.type === movementType)
        )
      );

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

          const accumulatedSubCategoryValue: any[] = [];

          if (category.subCategories) {
            category.subCategories.map((subCategory) => {
              const accumulatedValue = movements
                .filter(
                  (movement) =>
                    movement.category === category.name &&
                    movement.subCategory === subCategory
                )
                .reduce(
                  (acc, movement) => Number(acc) + Number(movement.value),
                  0
                );
              accumulatedSubCategoryValue.push({
                name: subCategory,
                accumulatedValue: accumulatedValue.toFixed(2),
              });
            });
          }
          return {
            avatar: category.avatar,
            category: category.name,
            accumulatedValue: accumulatedValue.toFixed(2),
            movements: movements.filter(
              (movement) => movement.category === category.name
            ),
            subCategories:
              accumulatedSubCategoryValue.length > 0
                ? accumulatedSubCategoryValue
                : null,
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

  getGroupMovementsQuerySnapshot(): Observable<Movement[]> {
    if (this.firestoreService.groupMovementsCollectionRef) {
      return from(this.firestoreService.groupMovementsCollectionRef.get()).pipe(
        map((querySnapshot) => {
          const movements: Movement[] = [];
          querySnapshot.forEach((doc) => {
            const movement = doc.data() as Movement;
            movement.id = doc.id;
            movements.push(movement);
          });
          return movements;
        })
      );
    }
    throw new Error('groupMovementsCollectionRef is not defined');
  }
}
