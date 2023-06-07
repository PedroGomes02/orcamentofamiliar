import { Component } from '@angular/core';

import { MovementsService } from 'src/app/services/movements.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashBoardComponent {
  constructor(public movementsService: MovementsService) {}
}
