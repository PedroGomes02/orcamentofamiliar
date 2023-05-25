import { Component, Input, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { Category, Movement } from 'src/app/types';
import { map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css'],
})
export class UpdateCategoryComponent implements OnInit {
  @Input() currentCategory!: Category;

  updateCategoryForm: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private db: AngularFirestore
  ) {
    this.updateCategoryForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      avatar: ['', Validators.required],
      subCategories: [''],
    });
  }

  ngOnInit() {
    this.updateCategoryForm.controls['type'].setValue(
      this.currentCategory.type
    );
    this.updateCategoryForm.controls['name'].setValue(
      this.currentCategory.name
    );
    this.updateCategoryForm.controls['avatar'].setValue(
      this.currentCategory.avatar
    );
    this.updateCategoryForm.controls['subCategories'].setValue(
      this.currentCategory.subCategories
    );
  }

  handlerSubmitUpdateCategoryForm() {
    const newCategory: any = {
      type: this.updateCategoryForm.value.type,
      name: this.updateCategoryForm.value.name.toLowerCase(),
      avatar: this.updateCategoryForm.value.avatar,
      subCategories: null,
    };

    if (typeof this.updateCategoryForm.value.subCategories === 'string') {
      newCategory.subCategories = this.updateCategoryForm.value.subCategories
        .toLowerCase()
        .trim()
        .split(',')
        .map((e: string) => e.trim())
        .sort();
    }

    if (Array.isArray(this.updateCategoryForm.value.subCategories)) {
      newCategory.subCategories = this.updateCategoryForm.value.subCategories
        .join(',')
        .toLowerCase()
        .trim()
        .split(',')
        .map((e: string) => e.trim())
        .sort();
    }

    this.firestoreService.updateDoc(
      'categories',
      this.currentCategory.id,
      newCategory
    );
    this.updateCategoryForm.reset();

    //Atualizar todos os movimentos que estavam referenciados a esta categoria!

    const updateMovements = async () => {
      const batchSize = 500;
      let batch = this.db.firestore.batch();
      let numElements = 0;

      try {
        const querySnapshot =
          await this.firestoreService.groupMovementsCollectionRef?.ref.get();
        if (querySnapshot) {
          for (const doc of querySnapshot.docs) {
            if (doc.data().category === this.currentCategory.name) {
              if (numElements >= batchSize) {
                await batch.commit();
                batch = this.db.firestore.batch();
                numElements = 0;
              }

              batch.update(doc.ref, {
                category: newCategory.name,
                type: newCategory.type,
                categoryAvatar: newCategory.avatar,
              });

              numElements++;
            }
          }

          if (numElements > 0) {
            await batch.commit();
          }
        }
      } catch (error) {
        console.log(error);
      }

      console.log(`Movements updated: ${numElements}`);
    };

    updateMovements();

    // this.firestoreService
    //   .getMovements()
    //   .pipe(
    //     map((movements: Movement[]) =>
    //       movements.filter(
    //         (movement: Movement) =>
    //           movement.category === this.currentCategory.name
    //       )
    //     )
    //   )
    //   .subscribe((filteredMovements: Movement[]) => {
    //     filteredMovements.forEach((movement: Movement) => {
    //       movement.category = newCategory.name;
    //       movement.type = newCategory.type;
    //       movement.categoryAvatar = newCategory.avatar;
    //       this.firestoreService.groupMovementsCollectionRef
    //         ?.doc(movement.id)
    //         .update(movement);
    //     });
    //   });
  }
}
