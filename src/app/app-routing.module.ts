import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './components/organisms/categories/categories.component';
import { DashBoardComponent } from './components/organisms/dash-board/dash-board.component';
import { MovementsComponent } from './components/organisms/movements/movements.component';
import { NewMovementComponent } from './components/organisms/new-movement/new-movement.component';
import { NewCategoryComponent } from './components/organisms/new-category/new-category.component';
import { SummaryComponent } from './components/organisms/summary/summary.component';
import { PrivacyComponent } from './components/privacy/privacy.component';

const routes: Routes = [
  { path: '', component: DashBoardComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'movements', component: MovementsComponent },
  { path: 'newmovement', component: NewMovementComponent },
  { path: 'newcategory', component: NewCategoryComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'privacy', component: PrivacyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
