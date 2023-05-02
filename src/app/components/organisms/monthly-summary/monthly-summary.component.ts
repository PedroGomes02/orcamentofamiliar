import { Component, OnInit } from '@angular/core';
import { SummaryService } from 'src/app/services/summary.service';

@Component({
  selector: 'app-monthly-summary',
  templateUrl: './monthly-summary.component.html',
  styleUrls: ['./monthly-summary.component.css'],
})
export class MonthlySummaryComponent implements OnInit {
  constructor(public summaryService: SummaryService) {
    this.summaryService.filters.year = new Date().getFullYear();
    this.summaryService.filters.month = new Date().getMonth() + 1;
  }

  ngOnInit() {}
  //   this.summaryService.getfilteredMovementsSummary();
  // }
}
