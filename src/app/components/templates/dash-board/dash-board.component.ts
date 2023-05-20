import { Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Movement } from 'src/app/types';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashBoardComponent {
  movement$: Observable<Movement[]>;

  orderedMovement$: Observable<Movement[]>;

  constructor(
    public firestoreService: FirestoreService,
    public dialogService: DialogService
  ) {
    this.movement$ = this.firestoreService.getMovements();
    this.orderedMovement$ = this.filterMovements();
  }

  filterMovements() {
    return this.movement$.pipe(
      map((movements: Movement[]) =>
        movements.sort(
          (a: any, b: any) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        )
      )
    );
  }

  testDialog() {
    console.log('dashboard dialog works!');
  }
}
