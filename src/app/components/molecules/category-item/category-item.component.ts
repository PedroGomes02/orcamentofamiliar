import { Component, Input } from '@angular/core';

import { CategoriesService } from 'src/app/services/categories.service';
import { DialogService } from 'src/app/services/dialog.service';

import { Category } from 'src/app/types';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css'],
})
export class CategoryItemComponent {
  @Input()
  categoryItem!: Category;
  
  selectedCategoryId: string = '';
  showCategoryControlButtons: boolean = false;

  constructor(
    private categoryService: CategoriesService,
    private dialogService: DialogService
  ) {}

  toggleShowControlButtons() {
    this.showCategoryControlButtons = !this.showCategoryControlButtons;
    this.selectedCategoryId = '';
  }

  handlerCategoryToUpdate(categoryId: string) {
    if (this.selectedCategoryId === categoryId) {
      this.selectedCategoryId = '';
    } else {
      this.selectedCategoryId = categoryId;
    }
  }

  handlerCategoryToDelete(categoryId: string) {
    this.dialogService.openConfirmDialog(
      'Deseja apagar esta categoria? Confirme por favor!',
      () => this.categoryService.deleteCategory(categoryId)
    );
  }
}
