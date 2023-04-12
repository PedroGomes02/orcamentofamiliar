import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { MovementsComponent } from './components/movements/movements.component';

const routes: Routes = [
  { path: '', component: DashBoardComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'movements', component: MovementsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
