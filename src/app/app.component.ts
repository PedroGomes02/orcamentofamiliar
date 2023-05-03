import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from './services/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Orçamento Familiar';
  showLogIn = false;
  isLoading = true;
  privacyOpen = false;

  constructor(
    public authService: AuthenticationService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isLoading = false;
      } else {
        this.showLogIn = true;
      }
    });
  }

  showPrivacy() {
    this.privacyOpen = !this.privacyOpen;
  }
}
