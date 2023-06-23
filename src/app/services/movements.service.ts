import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, map, of } from 'rxjs';

import { CategoriesService } from './categories.service';
import { FirestoreService } from './firestore.service';
import { PaginationService } from './pagination.service';

import { Category, FilterAndSort, Movement } from '../types';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  movementsCollectionRef: AngularFirestoreCollection<Movement>;

  lastMovements: Observable<Movement[]>;

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

  monthlyMovementsByType: any = { income: [], savings: [], expense: [] };
  monthlySummaryTotals: any = {
    income: 0,
    expense: 0,
    savings: 0,
    balance: 0,
  };
  incomeSummaryByCategorie$: Observable<any>;
  savingsSummaryByCategorie$: Observable<any>;
  expenseSummaryByCategorie$: Observable<any>;

  constructor(
    private firestoreService: FirestoreService,
    private paginationService: PaginationService,
    private categoriesService: CategoriesService
  ) {
    this.movementsCollectionRef =
      this.firestoreService.groupMovementsCollectionRef;

    this.lastMovements = this.getLastMovements();

    this.years = this.getYears();

    this.filteredMovements = this.getFilteredMovements();

    this.getMonthlyMovementsByTypeAndSummaryTotals();
    this.incomeSummaryByCategorie$ =
      this.getMonthlySummaryByCategories('income');
    this.savingsSummaryByCategorie$ =
      this.getMonthlySummaryByCategories('savings');
    this.expenseSummaryByCategorie$ =
      this.getMonthlySummaryByCategories('expense');
  }

  getYears(): Observable<number[]> {
    return of([2023, 2024, 2025]);
    // Below I have to read all the documents...
    // return this.movements.pipe(
    //   map((movements: Movement[]) => {
    //     const yearsSet = movements.reduce((acc, movement) => {
    //       const year = new Date(movement.date).getFullYear();
    //       acc.add(year);
    //       return acc;
    //     }, new Set<number>());
    //     return [...yearsSet];
    //   })
    // );
  }

  getMovements() {
    return this.firestoreService.valueChangesCollectionDocs<Movement>(
      this.movementsCollectionRef
    );
  }

  getLastMovements() {
    return this.firestoreService.valueChangesLastMovements(5);
  }

  getFilteredMovements() {
    return this.firestoreService.filterAndSortDocs<Movement>(
      this.firestoreService.valueChangesMonthlyMovements(
        this.dateFilters.year,
        this.dateFilters.month > 9
          ? this.dateFilters.month
          : `0${this.dateFilters.month}`
      ),
      this.filterAndSortMovementsBy
    );
  }

  refreshPagination() {
    this.filteredMovements
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.paginationService.calculateNumberOfPages(arrayLength);
      });
    this.paginationService.currentPage = 1;
  }

  handlerFilterAndSortMovementsBy() {
    this.filteredMovements = this.getFilteredMovements();
    this.getMonthlyMovementsByTypeAndSummaryTotals();
    this.incomeSummaryByCategorie$ =
      this.getMonthlySummaryByCategories('income');
    this.savingsSummaryByCategorie$ =
      this.getMonthlySummaryByCategories('savings');
    this.expenseSummaryByCategorie$ =
      this.getMonthlySummaryByCategories('expense');
    this.refreshPagination();
  }

  async addNewMovement(newMovement: Movement) {
    await this.firestoreService.addNewDocToCollection<Movement>(
      this.movementsCollectionRef,
      newMovement
    );
    this.refreshPagination();
  }

  async updateMovement(movementId: string, updatedMovement: Movement) {
    await this.firestoreService.updateDocOnCollection<Movement>(
      this.movementsCollectionRef,
      movementId,
      updatedMovement
    );
    this.refreshPagination();
  }

  async deleteMovement(movementId: string) {
    await this.firestoreService.deleteDocFromCollection<Movement>(
      this.movementsCollectionRef,
      movementId
    );
    this.refreshPagination();
  }

  async deleteAllMovements() {
    await this.firestoreService.batchDeleteAllCollectionDocs<Movement>(
      this.movementsCollectionRef
    );
    this.refreshPagination();
  }

  getMonthlyMovementsByTypeAndSummaryTotals() {
    this.filteredMovements.forEach((movements) => {
      this.monthlySummaryTotals.income = 0;
      this.monthlySummaryTotals.savings = 0;
      this.monthlySummaryTotals.expense = 0;
      this.monthlySummaryTotals.balance = 0;
      movements.forEach((movement) => {
        if (movement.type === 'income') {
          this.monthlyMovementsByType.income.push(movement);
          this.monthlySummaryTotals.income = (
            Number(this.monthlySummaryTotals.income) + Number(movement.value)
          ).toFixed(2);
          this.monthlySummaryTotals.balance = (
            Number(this.monthlySummaryTotals.balance) + Number(movement.value)
          ).toFixed(2);
        }
        if (movement.type === 'savings') {
          this.monthlyMovementsByType.savings.push(movement);
          this.monthlySummaryTotals.savings = (
            Number(this.monthlySummaryTotals.savings) + Number(movement.value)
          ).toFixed(2);
          this.monthlySummaryTotals.balance = (
            Number(this.monthlySummaryTotals.balance) - Number(movement.value)
          ).toFixed(2);
        }
        if (movement.type === 'expense') {
          this.monthlyMovementsByType.expense.push(movement);
          this.monthlySummaryTotals.expense = (
            Number(this.monthlySummaryTotals.expense) + Number(movement.value)
          ).toFixed(2);
          this.monthlySummaryTotals.balance = (
            Number(this.monthlySummaryTotals.balance) - Number(movement.value)
          ).toFixed(2);
        }
      });
    });
  }

  getMonthlySummaryByCategories(movementType: string) {
    const selectedTypeCategories: Observable<Category[]> =
      this.categoriesService.categories.pipe(
        map((categories: Category[]) =>
          categories.filter(
            (category: Category) => category.type === movementType
          )
        )
      );
    const selectedTypeMovements: Observable<Movement[]> =
      this.filteredMovements.pipe(
        map((movements: Movement[]) =>
          movements.filter(
            (movement: Movement) => movement.type === movementType
          )
        )
      );

    return combineLatest([selectedTypeCategories, selectedTypeMovements]).pipe(
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
}
