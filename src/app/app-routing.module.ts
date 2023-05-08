import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardComponent } from './components/templates/dash-board/dash-board.component';
import { SummaryComponent } from './components/templates/summary/summary.component';
import { NewMovementComponent } from './components/organisms/new-movement/new-movement.component';
import { MovementsComponent } from './components/organisms/movements/movements.component';
import { SettingsComponent } from './components/templates/settings/settings.component';
import { PrivacyComponent } from './components/templates/privacy/privacy.component';

const routes: Routes = [
  { path: '', component: DashBoardComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'newmovement', component: NewMovementComponent },
  { path: 'movements', component: MovementsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'privacy', component: PrivacyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
