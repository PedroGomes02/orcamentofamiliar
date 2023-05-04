import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirestoreService } from '../../../services/firestore.service';
import { PaginationService } from '../../../services/pagination.service';

import { Category, FilterAndSort } from '../../../types';
import { defaultCategories } from 'src/assets/defaultCategories';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
    public firestoreService: FirestoreService,
    public paginationService: PaginationService,
    private authService: AuthenticationService
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
    if (confirm('Tem a certeza que pretende apagar todas as categorias?')) {
      try {
        this.firestoreService.batchDeleteCategories();
      } catch (error) {
        console.error('Error deleting categories:', error);
      }
    }
  }

  // handlerEraseAllCategories() {
  //   if (confirm('Are You Sure?')) {
  //     this.categorie$.subscribe((data) => {
  //       data.forEach((e) =>
  //         this.firestoreService.categoriesCollectionRef?.doc(e.id).delete()
  //       );
  //     });
  //   }
  // }

  async handlerSetDefaultCategories() {
    if (
      confirm(
        'Este comando vai apagar todas as categorias atuais e repor as categorias padrão, tem a certeza?'
      )
    ) {
      try {
        await this.firestoreService.batchDeleteCategories();
        await this.firestoreService.batchSetDefaultCategories();
      } catch (error) {
        console.error('Error setting default categories:', error);
      }
    }
  }

  // async handlerSetDefaultCategories() {
  //   if (confirm('Este comando vai apagar todas as categorias atuais e repor as categorias padrão, tem a certeza?')) {
  //     try {
  //       await this.firestoreService.batchDeleteCategories();
  //       // Adicione todas as categorias padrão em paralelo
  //       const promises = defaultCategories.map((defaultCategory) => {
  //         const newCategory: Category = {
  //           id: '',
  //           name: defaultCategory.name,
  //           type: defaultCategory.type,
  //           avatar: defaultCategory.avatar,
  //           subCategories: null,
  //           userId: this.userId,
  //         };
  //         return this.firestoreService.categoriesCollectionRef?.add(
  //           newCategory
  //         );
  //       });
  //       await Promise.all(promises);
  //     } catch (error) {
  //       console.error('Error setting default categories:', error);
  //     }
  //   }
  // }
}
