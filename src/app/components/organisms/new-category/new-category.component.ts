import { Component, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { Category } from 'src/app/types';
import { DialogService } from 'src/app/services/dialog.service';
import { CategoriesService } from 'src/app/services/categories.service';

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
    private authService: AuthenticationService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {
    this.authService.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.categoriesService.categories.subscribe((categories) => {
      categories.forEach((category) =>
        this.currentCategoryNames.push(category.name)
      );
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      avatar: ['', Validators.required],
      subCategories: [],
    });
  }

  @Output() formSubmitted = new EventEmitter<void>();

  async handlerSubmitCategoryForm() {
    if (
      this.currentCategoryNames.includes(
        this.categoryForm.value.name.toLowerCase()
      )
    ) {
      this.dialogService.loading = false;
      this.dialogService.openDialog(`Já existe uma categoria com esse nom`);
      return;
    }

    const newCategory: Category = {
      id: '',
      name: this.categoryForm.value.name.toLowerCase(),
      type: this.categoryForm.value.type,
      avatar: this.categoryForm.value.avatar,
      subCategories: this.categoryForm.value.subCategories
        ? this.categoryForm.value.subCategories
            .toLowerCase()
            .trim()
            .split(',')
            .map((e: string) => e.trim())
            .sort()
        : null,
      userId: this.userId,
    };

    await this.categoriesService.addNewCategory(newCategory);

    this.categoryForm.reset();
    this.formSubmitted.emit();
  }

  // handlerSubmitCategoryForm() {
  //   this.dialogService.loading = true;
  //   this.dialogService.openDialog(``);

  //   if (
  //     this.currentCategoryNames.includes(
  //       this.categoryForm.value.name.toLowerCase()
  //     )
  //   ) {
  //     this.dialogService.loading = false;
  //     this.dialogService.dialogMessage =
  //       'Já existe uma categoria com esse nome!';
  //     return;
  //   }

  //   const newCategory: Category = {
  //     id: '',
  //     name: this.categoryForm.value.name.toLowerCase(),
  //     type: this.categoryForm.value.type,
  //     avatar: this.categoryForm.value.avatar,
  //     subCategories: this.categoryForm.value.subCategories
  //       ? this.categoryForm.value.subCategories
  //           .toLowerCase()
  //           .trim()
  //           .split(',')
  //           .map((e: string) => e.trim())
  //           .sort()
  //       : null,
  //     userId: this.userId,
  //   };

  //   this.firestoreService.groupCategoriesCollectionRef
  //     ?.add(newCategory)
  //     .then((documentRef) => {
  //       console.log(documentRef.id);
  //       this.dialogService.loading = false;
  //       this.dialogService.dialogMessage = 'Categoria adicionada com Sucesso!';
  //       this.firestoreService.groupCategories =
  //         this.firestoreService.getGroupCategories();
  //       this.firestoreService.filteredGroupCategories =
  //         this.firestoreService.groupCategories;
  //       this.firestoreService.filteredGroupCategories
  //         .pipe(map((array) => array.length))
  //         .subscribe((arrayLength) => {
  //           this.paginationService.calculateNumberOfPages(arrayLength);
  //         });
  //       this.paginationService.currentPage = 1;
  //     })
  //     .catch((error: Error) => {
  //       console.log(error.message);
  //       this.dialogService.loading = false;
  //       this.dialogService.dialogMessage =
  //         'Algo correu mal, por favor tente novamente!';
  //     });
  //   this.categoryForm.reset();
  //   this.formSubmitted.emit();
  // }
}
