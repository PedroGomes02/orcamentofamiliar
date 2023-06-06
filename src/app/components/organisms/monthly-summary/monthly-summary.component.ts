import { Component } from '@angular/core';
import { MovementsService } from 'src/app/services/movements.service';
import { SummaryService } from 'src/app/services/summary.service';

@Component({
  selector: 'app-monthly-summary',
  templateUrl: './monthly-summary.component.html',
  styleUrls: ['./monthly-summary.component.css'],
})
export class MonthlySummaryComponent {
  constructor(
    public summaryService: SummaryService,
    public movementsService: MovementsService
  ) {
    this.summaryService.filters.year = new Date().getFullYear();
    this.summaryService.filters.month = new Date().getMonth() + 1;
  }
}
