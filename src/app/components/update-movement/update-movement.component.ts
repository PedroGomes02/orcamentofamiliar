import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-update-movement',
  templateUrl: './update-movement.component.html',
  styleUrls: ['./update-movement.component.css'],
})
export class UpdateMovementComponent {
  @Input() idMovement!: string;
}
