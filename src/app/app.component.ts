import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from './services/dialog.service';
import { FirestoreService } from './services/firestore.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'Orçamento Familiar';
  isShowingLogIn: boolean = false;
  isPrivacyOpen: boolean = false;

  routes: string[] = [
    '/',
    '/summary',
    '/newmovement',
    '/movements',
    '/settings',
  ];

  constructor(
    private authService: AuthenticationService,
    public firestoreService: FirestoreService,
    public dialogService: DialogService,
    private router: Router
  ) {
    const hammer = new Hammer(document.documentElement);
    hammer.on('swiperight', () => this.navigatePrevious());
    hammer.on('swipeleft', () => this.navigateNext());
  }

  ngOnInit(): void {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
      } else {
        this.isShowingLogIn = true;
      }
    });

    this.firestoreService.groupData
      .forEach(() => (this.firestoreService.isLoading = false))
      .catch(() => (this.firestoreService.isShowingStartGroupMenu = true));
  }

  togglePrivacy(): void {
    this.isPrivacyOpen = !this.isPrivacyOpen;
  }

  async navigateNext() {
    const currentRouteIndex = this.routes.indexOf(this.router.url);
    const nextRouteIndex = (currentRouteIndex + 1) % this.routes.length;
    const nextRoute = this.routes[nextRouteIndex];
    this.router.navigate([nextRoute]);
  }

  navigatePrevious() {
    const currentRouteIndex = this.routes.indexOf(this.router.url);
    const previousRouteIndex =
      (currentRouteIndex - 1 + this.routes.length) % this.routes.length;
    const previousRoute = this.routes[previousRouteIndex];
    this.router.navigate([previousRoute]);
  }
}
