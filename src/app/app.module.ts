import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
// import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesComponent } from './components/organisms/categories/categories.component';
import { HeaderComponent } from './components/organisms/header/header.component';
import { FooterComponent } from './components/organisms/footer/footer.component';
import { MovementsComponent } from './components/organisms/movements/movements.component';
import { NewCategoryComponent } from './components/organisms/new-category/new-category.component';
import { NewMovementComponent } from './components/organisms/new-movement/new-movement.component';
import { DashBoardComponent } from './components/organisms/dash-board/dash-board.component';
import { NavmenuComponent } from './components/molecules/navmenu/navmenu.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoginComponent } from './components/login/login.component';
import { SummaryComponent } from './components/organisms/summary/summary.component';
import { UpdateMovementComponent } from './components/organisms/update-movement/update-movement.component';
import { MonthlySummaryComponent } from './components/organisms/monthly-summary/monthly-summary.component';
import { PaginationComponent } from './components/molecules/pagination/pagination.component';
import { MovementItemComponent } from './components/molecules/movement-item/movement-item.component';
import { CategoryItemComponent } from './components/molecules/category-item/category-item.component';
import { UpdateCategoryComponent } from './components/organisms/update-category/update-category.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { SettingsComponent } from './components/settings/settings.component';
@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    HeaderComponent,
    FooterComponent,
    MovementsComponent,
    NewCategoryComponent,
    NewMovementComponent,
    DashBoardComponent,
    NavmenuComponent,
    LoadingComponent,
    LoginComponent,
    SummaryComponent,
    UpdateMovementComponent,
    MonthlySummaryComponent,
    PaginationComponent,
    MovementItemComponent,
    CategoryItemComponent,
    UpdateCategoryComponent,
    PrivacyComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
