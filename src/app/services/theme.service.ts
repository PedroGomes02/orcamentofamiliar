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
  toggleTheme() {
    if (this.isDarkTheme) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }
}
