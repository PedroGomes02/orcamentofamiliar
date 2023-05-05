import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardComponent } from './components/organisms/dash-board/dash-board.component';
import { SummaryComponent } from './components/organisms/summary/summary.component';
import { NewMovementComponent } from './components/organisms/new-movement/new-movement.component';
import { MovementsComponent } from './components/organisms/movements/movements.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PrivacyComponent } from './components/privacy/privacy.component';

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
