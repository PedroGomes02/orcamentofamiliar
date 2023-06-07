import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-submit-form-button',
  templateUrl: './submit-form-button.component.html',
  styleUrls: ['./submit-form-button.component.css'],
})
export class SubmitFormButtonComponent {
  @Input()
  buttonText!: string;

  @Input()
  disabledButton!: boolean;
}
