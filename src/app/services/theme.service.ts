import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkTheme: boolean = false;

  constructor() {
    if (localStorage.getItem('theme')) {
      localStorage.getItem('theme') === 'dark'
        ? this.setDarkTheme()
        : this.setLightTheme();
    } else {
      this.isDarkTheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      if (this.isDarkTheme) {
        this.setDarkTheme();
      }
    }
  }

  setDarkTheme() {
    document.documentElement.setAttribute('theme', 'dark');
    this.isDarkTheme = true;
    localStorage.setItem('theme', 'dark' || '');
  }
  setLightTheme() {
    document.documentElement.setAttribute('theme', 'light');
    this.isDarkTheme = false;
    localStorage.setItem('theme', 'light' || '');
  }

  toggleTheme() {
    if (this.isDarkTheme) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }
  }
}
