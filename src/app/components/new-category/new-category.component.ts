import { Component, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { Category } from 'src/app/types';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css'],
})
export class NewCategoryComponent {
  currentCategoryNames: string[] = [];
  userId: string = '';
  categoryForm: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthenticationService,
    private fb: FormBuilder
  ) {
    this.authService.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.firestoreService.getCategories().subscribe((categories) => {
      categories.forEach((category) =>
        this.currentCategoryNames.push(category.name)
      );
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      avatar: ['', Validators.required],
      subCategories: [''],
    });
  }

  @Output() formSubmitted = new EventEmitter<void>();

  handlerSubmitCategoryForm() {
    if (
      this.currentCategoryNames.includes(
        this.categoryForm.value.name.toLowerCase()
      )
    ) {
      alert('Category name already exists!');
      return;
    }

    const newCategory: Category = {
      id: '',
      name: this.categoryForm.value.name.toLowerCase(),
      type: this.categoryForm.value.type,
      avatar: this.categoryForm.value.avatar,
      subCategories:
        this.categoryForm.value.subCategories.toLowerCase().split(' ').sort() ||
        null,
      userId: this.userId,
    };
    this.firestoreService.categoriesCollectionRef?.add(newCategory);
    this.categoryForm.reset();
    this.formSubmitted.emit();
  }
}
