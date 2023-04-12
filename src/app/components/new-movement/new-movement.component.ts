import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Category, Movement } from '../../types';
import { FirestoreService } from '../../services/firestore.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-new-movement',
  templateUrl: './new-movement.component.html',
  styleUrls: ['./new-movement.component.css'],
})
export class NewMovementComponent {
  movementForm: FormGroup;
  categorie$: Observable<Category[]> | undefined;
  currentMovementType: string = 'expense';
  currentCategorie$: Observable<Category[]> | undefined;
  currentCategory: Category | undefined;
  userId: string = '';

  constructor(
    private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.authService.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.categorie$ = this.firestoreService.getCategories();
    this.currentCategorie$ = this.categorie$.pipe(
      map((data) =>
        data.filter((category) => category.type === this.currentMovementType)
      )
    );
    this.currentCategorie$.subscribe((doc) => (this.currentCategory = doc[0]));

    this.movementForm = this.fb.group({
      value: [0, Validators.required],
      date: [, Validators.required],
      type: ['expense', Validators.required],
      category: ['', Validators.required],
      subCategory: [''],
      description: ['', Validators.required],
    });
  }

  handlerSubmitMovementForm() {
    const newMovement: Movement = {
      id: '',
      value: this.movementForm.value.value.toFixed(2),
      date: this.movementForm.value.date,
      type: this.movementForm.value.type,
      category: this.movementForm.value.category,
      subCategory: this.movementForm.value.subCategory || null,
      description: this.movementForm.value.description.toLowerCase(),
      userId: this.userId,
    };
    this.firestoreService.movementsCollectionRef?.add(newMovement);
    this.movementForm.reset();
  }

  handlerCurrentMovementTypeChange() {
    this.currentMovementType = this.movementForm.value.type;
    this.currentCategorie$ = this.categorie$?.pipe(
      map((data) =>
        data.filter((category) => category.type === this.currentMovementType)
      )
    );
    this.currentCategory = {
      id: '',
      name: '',
      type: '',
      avatar: '',
      subCategories: [],
      userId: '',
    };
  }

  handlerCurrentCategoryChange() {
    this.currentCategorie$?.subscribe(
      (data) =>
        (this.currentCategory = data.filter(
          (element) => element.name === this.movementForm.value.category
        )[0])
    );
  }
}
