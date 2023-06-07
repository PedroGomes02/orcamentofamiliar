import { Component } from '@angular/core';

import { MovementsService } from 'src/app/services/movements.service';
// import { SummaryService } from 'src/app/services/summary.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent {
  showMovementsList: string = '';

  constructor(
    // public summaryService: SummaryService,
    public movementsService: MovementsService
  ) {}

  toogleShowCategoryList(categoryName: string) {
    if (this.showMovementsList === categoryName) {
      this.showMovementsList = '';
    } else {
      this.showMovementsList = categoryName;
    }
  }
}
