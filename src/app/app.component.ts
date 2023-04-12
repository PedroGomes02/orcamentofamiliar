import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'O Meu Orçamento Familiar';
  showLogIn = false;
  isLoading = true;

  constructor(public authService: AuthenticationService) {}

  ngOnInit() {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isLoading = false;
      } else {
        this.showLogIn = true;
      }
    });
  }
}
