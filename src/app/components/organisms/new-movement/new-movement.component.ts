import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Category, Movement } from '../../../types';
import { FirestoreService } from '../../../services/firestore.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from 'src/app/services/dialog.service';

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
  showNewCategoryComponent: boolean = false;

  constructor(
    private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private dialogService: DialogService
  ) {
    this.authService.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.categorie$ = this.firestoreService.getCategories();

    this.movementForm = this.fb.group({
      value: [, Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      type: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: null,
      description: ['', Validators.required],
    });
  }

  handlerSubmitMovementForm() {
    this.dialogService.loading = true;
    this.dialogService.openDialog(``);

    const newMovement: Movement = {
      id: '',
      value: this.movementForm.value.value.toFixed(2),
      date: this.movementForm.value.date,
      type: this.movementForm.value.type,
      categoryAvatar: this.currentCategory?.avatar,
      category: this.movementForm.value.category,
      subCategory: this.movementForm.value.subCategory,
      description: this.movementForm.value.description.toLowerCase(),
      userId: this.userId,
      createAt: new Date().toISOString(),
    };

    console.log(newMovement);

    this.firestoreService.groupMovementsCollectionRef
      ?.add(newMovement)
      .then((documentRef) => {
        console.log(documentRef.id);
        this.dialogService.loading = false;
        this.dialogService.dialogMessage = 'Movimento adicionado com Sucesso!';
      })
      .catch((error: Error) => {
        console.log(error.message);
        this.dialogService.loading = false;
        this.dialogService.dialogMessage =
          'Algo correu mal, por favor tente novamente!';
      });
    this.movementForm.reset();
    this.currentCategorie$ = undefined;
    this.currentCategory = undefined;
    this.movementForm.controls['date'].setValue(
      new Date().toISOString().substring(0, 10)
    );
  }

  handlerCurrentMovementTypeChange() {
    this.currentMovementType = this.movementForm.value.type;
    this.currentCategorie$ = this.categorie$?.pipe(
      map((categories) =>
        categories.filter(
          (category) => category.type === this.currentMovementType
        )
      )
    );
    this.movementForm.controls['category'].reset();
    this.currentCategory = undefined;
  }

  handlerCurrentCategoryChange() {
    this.currentCategorie$?.subscribe(
      (categories) =>
        (this.currentCategory = categories.filter(
          (element) => element.name === this.movementForm.value.category
        )[0])
    );
    this.movementForm.controls['subCategory'].reset();
  }

  handlerShowNewCategoryComponent(event: any) {
    event.preventDefault();
    this.showNewCategoryComponent = !this.showNewCategoryComponent;
  }

  onFormSubmitted() {
    this.showNewCategoryComponent = false;
  }
}
