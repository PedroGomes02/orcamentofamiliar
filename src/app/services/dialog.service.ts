import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  dialogMessage: string = '';
  confirmDialogMessage: string = '';
  confirmFunction: () => void = () => {};

  loading: boolean = true;

  constructor() {}

  openDialog(message: string) {
    const myDialog = document.getElementById('dialog') as HTMLDialogElement;
    this.dialogMessage = message;
    myDialog.showModal();
  }

  closeDialog() {
    const myDialog = document.getElementById('dialog') as HTMLDialogElement;
    myDialog.close();
  }

  openConfirmDialog(message: string, confirmFunction: () => void) {
    const myDialog = document.getElementById(
      'confirmDialog'
    ) as HTMLDialogElement;
    this.confirmDialogMessage = message;
    this.confirmFunction = confirmFunction;
    myDialog.showModal();
  }

  confirmDialog() {
    const myDialog = document.getElementById(
      'confirmDialog'
    ) as HTMLDialogElement;
    this.confirmFunction();
    myDialog.close();
  }

  cancelConfirmDialog() {
    const myDialog = document.getElementById(
      'confirmDialog'
    ) as HTMLDialogElement;
    myDialog.close();
  }
}
