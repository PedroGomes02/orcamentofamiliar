import { Component } from '@angular/core';

import { FirestoreService } from 'src/app/services/firestore.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  constructor(
    public firestoreService: FirestoreService,
    public themeService: ThemeService
  ) {}
  toogleTheme() {
    this.themeService.toggleTheme();
  }
}
