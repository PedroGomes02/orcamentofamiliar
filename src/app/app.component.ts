import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from './services/dialog.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'Orçamento Familiar';
  isShowingLogIn: boolean = false;
  isLoading: boolean = true;
  isPrivacyOpen: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isLoading = false;
      } else {
        this.isShowingLogIn = true;
      }
    });
  }

  togglePrivacy(): void {
    this.isPrivacyOpen = !this.isPrivacyOpen;
  }
}
