import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HorizontalSwipeService {
  swipeRoutes: string[] = [
    '/',
    '/summary',
    '/newmovement',
    '/movements',
    '/settings',
  ];
  constructor(private router: Router) {
    if (this.isMobileDevice()) {
      const hammer = new Hammer(document.documentElement);
      hammer.on('swiperight', () => this.navigatePrevious());
      hammer.on('swipeleft', () => this.navigateNext());
    }
  }

  isMobileDevice(): boolean {
    return (
      'ontouchstart' in window ||
      (window.matchMedia && window.matchMedia('(max-width: 767px)').matches)
    );
  }

  navigateNext() {
    const currentRouteIndex = this.swipeRoutes.indexOf(this.router.url);
    const nextRouteIndex = (currentRouteIndex + 1) % this.swipeRoutes.length;
    const nextRoute = this.swipeRoutes[nextRouteIndex];
    this.router.navigate([nextRoute]);
  }

  navigatePrevious() {
    const currentRouteIndex = this.swipeRoutes.indexOf(this.router.url);
    const previousRouteIndex =
      (currentRouteIndex - 1 + this.swipeRoutes.length) %
      this.swipeRoutes.length;
    const previousRoute = this.swipeRoutes[previousRouteIndex];
    this.router.navigate([previousRoute]);
  }
}
