import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  alertMessage: string = '';
  confirmMessage: string = '';
  confirmFunction: () => void = () => {};

  constructor() {}

  openDialog(message: string) {
    const myDialog = document.getElementById('my-dialog') as HTMLDialogElement;
    this.alertMessage = message;
    myDialog.showModal();
  }

  closeDialog() {
    const myDialog = document.getElementById('my-dialog') as HTMLDialogElement;
    myDialog.close();
  }

  openConfirmDialog(message: string, confirmFunction: () => void) {
    const myDialog = document.getElementById(
      'my-confirm-dialog'
    ) as HTMLDialogElement;
    this.confirmMessage = message;
    this.confirmFunction = confirmFunction;
    myDialog.showModal();
  }

  confirmDialog() {
    const myDialog = document.getElementById(
      'my-confirm-dialog'
    ) as HTMLDialogElement;
    this.confirmFunction();
    myDialog.close();
  }

  abortConfirmDialog() {
    const myDialog = document.getElementById(
      'my-confirm-dialog'
    ) as HTMLDialogElement;
    myDialog.close();
  }
}
