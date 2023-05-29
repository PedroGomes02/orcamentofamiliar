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
    public themeService: ThemeService,
    public firestoreService: FirestoreService
  ) {}
  toogleTheme() {
    this.themeService.toggleTheme();
  }
}
