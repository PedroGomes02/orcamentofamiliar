import { Component } from '@angular/core';

import { map } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from 'src/app/services/dialog.service';
import { FirestoreService } from '../../../services/firestore.service';
import { PaginationService } from '../../../services/pagination.service';

import { FilterAndSort } from '../../../types';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent {
  filterAndSortBy: FilterAndSort = { type: 'all', sortBy: 'name' };

  showNewCategoryComponent: boolean = false;
  userId: string = '';

  constructor(
    private authService: AuthenticationService,
    private dialogService: DialogService,
    public firestoreService: FirestoreService,
    public paginationService: PaginationService,
    public categoriesService: CategoriesService
  ) {
    this.authService.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.paginationService.currentPage = 1;

    this.categoriesService.filteredCategories
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.paginationService.calculateNumberOfPages(arrayLength);
      });
  }

  // handlerCategoriesFilterAndSort() {
  //   this.firestoreService.filterAndSortCategories(this.filterAndSortBy);
  // }

  handlerShowNewCategoryComponent() {
    this.showNewCategoryComponent = !this.showNewCategoryComponent;
  }

  onFormSubmitted() {
    this.showNewCategoryComponent = false;
  }

  handlerDeleteAllCategories() {
    this.dialogService.openConfirmDialog(
      'Tem a certeza que pretende apagar todas as categorias?',
      () => this.categoriesService.deleteAllCategories()
    );
  }

  handlerSetDefaultCategories() {
    this.dialogService.openConfirmDialog(
      'Este comando vai apagar todas as categorias atuais e repor as categorias padrão, tem a certeza?',
      () => {
        this.categoriesService.setDefaultCategories();
      }
    );
  }
}
