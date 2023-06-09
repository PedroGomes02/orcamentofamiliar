import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// import { AdsenseModule } from 'ng2-adsense';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DialogComponent } from './components/molecules/dialog/dialog.component';

import { SubmitFormButtonComponent } from './components/atoms/submit-form-button/submit-form-button.component';
import { ActionButtonComponent } from './components/atoms/action-button/action-button.component';
import { LoadingComponent } from './components/atoms/loading/loading.component';
import { PaginationComponent } from './components/molecules/pagination/pagination.component';

import { HeaderComponent } from './components/organisms/header/header.component';
import { FooterComponent } from './components/organisms/footer/footer.component';
import { NavmenuComponent } from './components/molecules/navmenu/navmenu.component';

import { NewGroupComponent } from './components/organisms/new-group/new-group.component';
import { UpdateGroupComponent } from './components/organisms/update-group/update-group.component';
import { FamilyGroupComponent } from './components/organisms/family-group/family-group.component';

import { MemberItemComponent } from './components/molecules/member-item/member-item.component';
import { NewMemberComponent } from './components/organisms/new-member/new-member.component';

import { CategoryItemComponent } from './components/molecules/category-item/category-item.component';
import { CategoriesComponent } from './components/organisms/categories/categories.component';
import { NewCategoryComponent } from './components/organisms/new-category/new-category.component';
import { UpdateCategoryComponent } from './components/organisms/update-category/update-category.component';

import { MovementItemComponent } from './components/molecules/movement-item/movement-item.component';
import { MovementsComponent } from './components/organisms/movements/movements.component';
import { NewMovementComponent } from './components/organisms/new-movement/new-movement.component';
import { UpdateMovementComponent } from './components/organisms/update-movement/update-movement.component';

import { MonthlySummaryComponent } from './components/organisms/monthly-summary/monthly-summary.component';
import { SummaryComponent } from './components/templates/summary/summary.component';

import { LoginComponent } from './components/templates/login/login.component';
import { PrivacyComponent } from './components/templates/privacy/privacy.component';
import { StartGroupMenuComponent } from './components/templates/start-group-menu/start-group-menu.component';
import { DashBoardComponent } from './components/templates/dash-board/dash-board.component';
import { SettingsComponent } from './components/templates/settings/settings.component';

import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { HammerModule } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override buildHammer(element: HTMLElement): HammerManager {
    const hammer = new Hammer(element, {
      touchAction: 'pan-y', // Vertical scroll
    });

    hammer.get('swipe').set({
      direction: Hammer.DIRECTION_HORIZONTAL,
    });

    return hammer;
  }
}

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
    FamilyGroupComponent,
    NewMemberComponent,
    NewGroupComponent,
    MemberItemComponent,
    StartGroupMenuComponent,
    DialogComponent,
    UpdateGroupComponent,
    SubmitFormButtonComponent,
    ActionButtonComponent,
  ],
  imports: [
    BrowserModule,
    HammerModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    // AdsenseModule.forRoot(),
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
