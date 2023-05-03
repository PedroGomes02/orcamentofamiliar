import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirestoreService } from '../../../services/firestore.service';
import { PaginationService } from '../../../services/pagination.service';

import { Category, FilterAndSort } from '../../../types';
import { defaultCategories } from 'src/assets/defaultCategories';

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
    this.pagination.currentPage = 1;
  }

  handlerShowNewCategoryComponent() {
    this.showNewCategoryComponent = !this.showNewCategoryComponent;
  }

  onFormSubmitted() {
    this.showNewCategoryComponent = false;
  }

  handlerSetDefaultCategories() {
    this.categorie$.subscribe((data) => {
      if (data.length === 0) {
        console.log(
          'o array de dados emitido pela Observable tem um length de zero'
        );
      } else {
        console.log(
          'o array de dados emitido pela Observable tem um length maior que zero'
        );
      }
    });

    defaultCategories.forEach((e) => console.log(e));
    //Colocar um confirm!!!! Atenção
    //Apagar todas as categorias existentes, e carregar estas novas!
  }
}
