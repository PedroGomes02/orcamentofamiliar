import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirestoreService } from '../../services/firestore.service';
import { PaginationService } from '../../services/pagination.service';

import { Category, FilterAndSort } from '../../types';

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

  constructor(
    public firestoreService: FirestoreService,
    public paginationService: PaginationService
  ) {
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
  }

  handlerShowNewCategoryComponent() {
    this.showNewCategoryComponent = !this.showNewCategoryComponent;
  }

  onFormSubmitted() {
    this.showNewCategoryComponent = false;
  }
}
