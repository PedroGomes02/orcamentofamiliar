import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from 'src/app/services/dialog.service';
import { FirestoreService } from '../../../services/firestore.service';
import { PaginationService } from '../../../services/pagination.service';

import { Category, FilterAndSort } from '../../../types';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent {
  categorie$: Observable<Category[]>;
  filteredCategorie$: Observable<Category[]>;
  filterAndSortBy: FilterAndSort = { type: 'all', sortBy: 'name' };
  pagination: PaginationService;
  showNewCategoryComponent: boolean = false;
  userId: string = '';

  constructor(
    private authService: AuthenticationService,
    private dialogService: DialogService,
    public firestoreService: FirestoreService,
    public paginationService: PaginationService
  ) {
    this.authService.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.categorie$ = this.firestoreService.getCategories();
    this.filteredCategorie$ = this.categorie$;
    this.pagination = this.paginationService;

    this.pagination.currentPage = 1;

    this.filteredCategorie$
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.pagination.calculateNumberOfPages(arrayLength);
      });
  }

  handlerCategoriesFilterAndSort() {
    this.filteredCategorie$ = this.firestoreService.filterAndSortDocs(
      this.categorie$,
      this.filterAndSortBy
    );
    this.filteredCategorie$
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.pagination.calculateNumberOfPages(arrayLength);
      });
    this.pagination.currentPage = 1;
  }

  handlerShowNewCategoryComponent() {
    this.showNewCategoryComponent = !this.showNewCategoryComponent;
  }

  onFormSubmitted() {
    this.showNewCategoryComponent = false;
  }

  async handlerEraseAllCategories() {
    this.dialogService.openConfirmDialog(
      'Tem a certeza que pretende apagar todas as categorias?',
      () => this.firestoreService.batchDeleteCategories()
    );
  }

  async handlerSetDefaultCategories() {
    this.dialogService.openConfirmDialog(
      'Este comando vai apagar todas as categorias atuais e repor as categorias padrão, tem a certeza?',
      async () => {
        await this.firestoreService.batchSetDefaultCategories();
      }
    );
  }
}
