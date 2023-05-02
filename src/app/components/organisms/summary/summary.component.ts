import { Component } from '@angular/core';
import { SummaryService } from 'src/app/services/summary.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent {
  constructor(public summaryService: SummaryService) {}
}
