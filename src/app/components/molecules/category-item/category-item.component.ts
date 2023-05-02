import { Component, Input } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Category } from 'src/app/types';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css'],
})
export class CategoryItemComponent {
  @Input()
  categoryItem!: Category;
  idCategoryUpdateOpen: string = '';
  showControlButtons: boolean = false;

  constructor(public firestoreService: FirestoreService) {}

  handlershowControlButtons() {
    this.showControlButtons = !this.showControlButtons;
    this.idCategoryUpdateOpen = '';
  }

  handlerClickCategoryUpdate(categoryId: string) {
    if (this.idCategoryUpdateOpen === categoryId) {
      this.idCategoryUpdateOpen = '';
    } else {
      this.idCategoryUpdateOpen = categoryId;
    }
  }

  handlerClickCategoryDelete(categoryId: string) {
    if (confirm('Deseja apagar esta categoria? Confirme por favor!')) {
      this.firestoreService.deleteDoc('categories', categoryId);
    }
  }
}
