import { Component } from '@angular/core';
import { SummaryService } from 'src/app/services/summary.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent {
  showMovementsList: string = '';

  constructor(public summaryService: SummaryService) {}

  toogleShowCategoryList(categoryName: string) {
    if (this.showMovementsList === categoryName) {
      this.showMovementsList = '';
    } else {
      this.showMovementsList = categoryName;
    }
  }
}
