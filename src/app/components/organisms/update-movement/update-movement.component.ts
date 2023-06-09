import { Component, Input, OnInit } from '@angular/core';

import { Observable, map } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CategoriesService } from 'src/app/services/categories.service';
import { MovementsService } from 'src/app/services/movements.service';

import { Category, Movement } from 'src/app/types';

@Component({
  selector: 'app-update-movement',
  templateUrl: './update-movement.component.html',
  styleUrls: ['./update-movement.component.css'],
})
export class UpdateMovementComponent implements OnInit {
  @Input() currentMovement!: Movement;

  updateMovementForm: FormGroup;

  categorie$: Observable<Category[]> | undefined;
  currentMovementType: string = 'expense';
  currentCategorie$: Observable<Category[]> | undefined;
  currentCategory: Category | undefined;
  showNewCategoryComponent: boolean = false;

  constructor(
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private movementsService: MovementsService
  ) {
    this.categorie$ = this.categoriesService.categories;

    this.currentCategorie$ = this.categorie$?.pipe(
      map((categories) =>
        categories.filter(
          (category) => category.type === this.currentMovement.type
        )
      )
    );

    this.currentCategorie$?.subscribe(
      (categories) =>
        (this.currentCategory = categories.filter(
          (element) => element.name === this.currentMovement.category
        )[0])
    );

    this.updateMovementForm = this.fb.group({
      value: [, Validators.required],
      date: ['', Validators.required],
      type: ['', Validators.required],
      category: ['', Validators.required],
      subCategory: null,
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.updateMovementForm.controls['value'].setValue(
      Number(this.currentMovement.value)
    );
    this.updateMovementForm.controls['date'].setValue(
      this.currentMovement.date
    );
    this.updateMovementForm.controls['type'].setValue(
      this.currentMovement.type
    );
    this.updateMovementForm.controls['category'].setValue(
      this.currentMovement.category
    );
    this.updateMovementForm.controls['subCategory'].setValue(
      this.currentMovement.subCategory
    );
    this.updateMovementForm.controls['description'].setValue(
      this.currentMovement.description
    );
  }

  handlerCurrentMovementTypeChange() {
    this.currentMovementType = this.updateMovementForm.value.type;
    this.currentCategorie$ = this.categorie$?.pipe(
      map((categories) =>
        categories.filter(
          (category) => category.type === this.currentMovementType
        )
      )
    );
    this.updateMovementForm.controls['category'].reset();
    this.currentCategory = undefined;
  }

  handlerCurrentCategoryChange() {
    this.currentCategorie$?.subscribe(
      (categories) =>
        (this.currentCategory = categories.filter(
          (element) => element.name === this.updateMovementForm.value.category
        )[0])
    );
    this.updateMovementForm.controls['subCategory'].reset();
  }

  handlerShowNewCategoryComponent(event: any) {
    event.preventDefault();
    this.showNewCategoryComponent = !this.showNewCategoryComponent;
  }

  onNewCategoryFormSubmitted() {
    this.showNewCategoryComponent = false;
    this.categorie$ = this.categoriesService.categories;
    this.currentCategorie$ = this.categorie$?.pipe(
      map((categories) =>
        categories.filter(
          (category) => category.type === this.currentMovementType
        )
      )
    );
    this.updateMovementForm.controls['subCategory'].reset();
  }

  handlerSubmitUpdateMovementForm() {
    const updatedMovement: any = {
      value: this.updateMovementForm.value.value.toFixed(2),
      date: this.updateMovementForm.value.date,
      type: this.updateMovementForm.value.type,
      categoryAvatar: this.currentCategory?.avatar,
      category: this.updateMovementForm.value.category,
      subCategory: this.updateMovementForm.value.subCategory,
      description: this.updateMovementForm.value.description.toLowerCase(),
    };

    this.movementsService.updateMovement(
      this.currentMovement.id,
      updatedMovement
    );
    this.updateMovementForm.reset();
  }
}
