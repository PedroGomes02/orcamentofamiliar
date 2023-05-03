import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  alertMessage: string = '';
  confirmMessage: string = '';
  constructor() {}

  openConfirmDialog() {}

  openDialog() {
    const myDialog = document.getElementById('my-dialog') as HTMLDialogElement;
    this.alertMessage = 'gogogoggoogog';
    myDialog.showModal();
  }

  closeDialog() {
    const myDialog = document.getElementById('my-dialog') as HTMLDialogElement;
    myDialog.close();
  }
}
