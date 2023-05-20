import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from 'src/app/services/dialog.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.css'],
})
export class MemberItemComponent {
  @Input()
  memberItem: any;
  userEmail: string = '';

  constructor(
    public firestoreService: FirestoreService,
    public authService: AuthenticationService,
    private dialogService: DialogService
  ) {
    this.authService.afAuth.authState.subscribe((user) => {
      this.userEmail = user?.email || '';
    });
  }
  handlerMemberToDelete(memberId: string) {
    this.dialogService.openConfirmDialog(
      'Deseja apagar este membro? Confirme por favor!',
      () => this.firestoreService.deleteDoc('members', memberId)
    );

    // if (confirm('Deseja apagar este membro? Confirme por favor!')) {
    //   this.firestoreService.deleteDoc('members', memberId);
    // }
  }
}
