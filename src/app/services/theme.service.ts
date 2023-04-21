import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkTheme: boolean = false;

  constructor() {
    this.isDarkTheme = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    if (this.isDarkTheme) {
      this.setDarkTheme();
    }
  }

  setDarkTheme() {
    document.documentElement.setAttribute('theme', 'dark');
    this.isDarkTheme = true;
  }
  setLightTheme() {
    document.documentElement.setAttribute('theme', 'light');
    this.isDarkTheme = false;
  }
  changeTheme() {
    if (this.isDarkTheme === false) {
      this.setDarkTheme();
    } else {
      this.setLightTheme();
    }
  }
}
