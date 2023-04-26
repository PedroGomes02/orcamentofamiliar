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

  constructor(public firestoreService: FirestoreService) {}

  handlerClickMovementUpdate(movementId: string) {
    if (this.idCategoryUpdateOpen === movementId) {
      this.idCategoryUpdateOpen = '';
    } else {
      this.idCategoryUpdateOpen = movementId;
    }
  }
}
