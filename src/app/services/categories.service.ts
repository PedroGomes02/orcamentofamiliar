import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { defaultCategories } from 'src/assets/defaultCategories';
import { FirestoreService } from './firestore.service';
import { PaginationService } from './pagination.service';

import { Category, FilterAndSort } from '../types';
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  categoriesCollectionRef: AngularFirestoreCollection<Category>;
  categories: Observable<Category[]>;
  filterAndSortCategoriesBy: FilterAndSort = { type: 'all', sortBy: 'name' };
  filteredCategories: Observable<Category[]>;

  constructor(
    private firestoreService: FirestoreService,
    private paginationService: PaginationService
  ) {
    this.categoriesCollectionRef =
      this.firestoreService.groupCategoriesCollectionRef;
    this.categories = this.getCategories();
    this.filteredCategories = this.getFilteredCategories();
  }

  getCategories() {
    return this.firestoreService.valueChangesCollectionDocs<Category>(
      this.categoriesCollectionRef
    );
  }

  getFilteredCategories() {
    return this.firestoreService.filterAndSortDocs<Category>(
      this.getCategories(),
      this.filterAndSortCategoriesBy
    );
  }

  refreshPagination() {
    this.filteredCategories
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.paginationService.calculateNumberOfPages(arrayLength);
      });
    this.paginationService.currentPage = 1;
  }

  handlerFilterAndSortCategoriesBy() {
    this.filteredCategories = this.getFilteredCategories();
    this.refreshPagination();
  }

  async addNewCategory(newCategory: Category) {
    await this.firestoreService.addNewDocToCollection<Category>(
      this.categoriesCollectionRef,
      newCategory
    );
    this.refreshPagination();
  }

  async updateCategory(categoryId: string, updatedCategory: Category) {
    await this.firestoreService.updateDocOnCollection<Category>(
      this.categoriesCollectionRef,
      categoryId,
      updatedCategory
    );
    this.refreshPagination();
  }

  async deleteCategory(categoryId: string) {
    await this.firestoreService.deleteDocFromCollection<Category>(
      this.categoriesCollectionRef,
      categoryId
    );
    this.refreshPagination();
  }

  async setDefaultCategories() {
    await this.firestoreService.batchDeleteAllCollectionDocs<Category>(
      this.categoriesCollectionRef
    );
    await this.firestoreService.batchSetDefaultCollectionDocs<Category>(
      this.categoriesCollectionRef,
      defaultCategories
    );
    this.refreshPagination();
  }

  async deleteAllCategories() {
    await this.firestoreService.batchDeleteAllCollectionDocs<Category>(
      this.categoriesCollectionRef
    );
    this.refreshPagination();
  }
}
