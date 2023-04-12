import { Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Movement } from 'src/app/types';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashBoardComponent {
  movement$: Observable<Movement[]>;

  incomeMovement$: Observable<Movement[]>;
  savingsMovement$: Observable<Movement[]>;
  expenseMovement$: Observable<Movement[]>;

  filteredMovement$: Observable<Movement[]>;
  filters: any = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };

  filteredMovementsSummary: any = {
    income: 0,
    savings: 0,
    expense: 0,
    balance: 0,
  };

  incomeSummaryByCategorie$: Observable<any>;
  savingsSummaryByCategorie$: Observable<any>;
  expenseSummaryByCategorie$: Observable<any>;

  constructor(private firestoreService: FirestoreService) {
    this.movement$ = this.firestoreService.getMovements();
    this.filteredMovement$ = this.filterMovements();
    this.getfilteredMovementsSummary();

    this.incomeMovement$ = this.filteredMovement$.pipe(
      map((movements) =>
        movements.filter((movement) => movement.type === 'income')
      )
    );
    this.savingsMovement$ = this.movement$.pipe(
      map((movements) =>
        movements.filter((movement) => movement.type === 'savings')
      )
    );
    this.expenseMovement$ = this.movement$.pipe(
      map((movements) =>
        movements.filter((movement) => movement.type === 'expense')
      )
    );

    this.incomeSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('income');
    this.savingsSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('savings');
    this.expenseSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('expense');
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

  getfilteredMovementsSummary() {
    this.getFilteredMovementTypeSummary('income');
    this.getFilteredMovementTypeSummary('savings');
    this.getFilteredMovementTypeSummary('expense');
  }

  getFilteredMovementTypeSummary(movementType: string) {
    this.filteredMovement$
      .pipe(
        map((movements: Movement[]) =>
          movements
            .filter((doc) => doc.type === movementType)
            .reduce((a, c) => Number(a) + Number(c.value), 0)
        )
      )
      .subscribe((total) => {
        this.filteredMovementsSummary[movementType] = total.toFixed(2);
        if (movementType === 'income') {
          this.filteredMovementsSummary.balance = (
            Number(this.filteredMovementsSummary.balance) + Number(total)
          ).toFixed(2);
        } else {
          this.filteredMovementsSummary.balance = (
            Number(this.filteredMovementsSummary.balance) - Number(total)
          ).toFixed(2);
        }
      });
  }

  getFilteredMovementsTypeSummaryByCategories(movementType: string) {
    const selectedTypeCategories$ = this.firestoreService
      .getCategories()
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
    this.filteredMovementsSummary.balance = 0;
    this.getfilteredMovementsSummary();
    this.incomeSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('income');
    this.savingsSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('savings');
    this.expenseSummaryByCategorie$ =
      this.getFilteredMovementsTypeSummaryByCategories('expense');
  }
}
