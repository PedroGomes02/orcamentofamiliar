import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirestoreService } from '../../services/firestore.service';
import { PaginationService } from '../../services/pagination.service';

import { Category } from '../../types';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent {
  categorie$: Observable<Category[]>;
  filteredCategorie$: Observable<Category[]>;
  filterAndSortBy: any = { categoryType: 'all', sortBy: 'name' };
  pagination: any;

  constructor(
    public firestoreService: FirestoreService,
    public paginationService: PaginationService
  ) {
    this.categorie$ = this.firestoreService.getCategories();
    this.filteredCategorie$ = this.categorie$;
    this.pagination = this.paginationService;

    this.filteredCategorie$
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        // this.pagination.totalDocs = arrayLength;
        // this.pagination.numberOfPages = Math.ceil(
        //   arrayLength / this.pagination.numberDocsByPage
        // );
        this.pagination.calculateNumberOfPages(arrayLength);
      });
  }

  handlerCategoriesFilterAndSort() {
    if (this.filterAndSortBy.categoryType === 'all') {
      this.filteredCategorie$ = this.categorie$.pipe(
        map((categories) =>
          categories.sort((a: any, b: any) =>
            a[this.filterAndSortBy.sortBy].localeCompare(
              b[this.filterAndSortBy.sortBy]
            )
          )
        )
      );
    } else {
      this.filteredCategorie$ = this.categorie$.pipe(
        map((categories) =>
          categories
            .sort((a: any, b: any) =>
              a[this.filterAndSortBy.sortBy].localeCompare(
                b[this.filterAndSortBy.sortBy]
              )
            )
            .filter(
              (category) => category.type === this.filterAndSortBy.categoryType
            )
        )
      );
    }
  }
}
