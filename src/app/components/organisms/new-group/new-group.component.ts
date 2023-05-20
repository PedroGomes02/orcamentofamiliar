import { Component } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.css'],
})
export class NewGroupComponent {
  userId: string = '';
  userEmail: string = '';
  groupForm: FormGroup;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthenticationService,
    private fb: FormBuilder
  ) {
    this.authService.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.userId = user.uid;
        this.userEmail = user.email;
      }
    });

    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      admin: ['', Validators.required],
    });
  }

  handlerSubmitGroupForm() {
    const groupData = {
      name: this.groupForm.value.name,
      admin: this.groupForm.value.admin,
    };
    this.firestoreService.addGroup(groupData);
    this.firestoreService.groupEmail = this.userEmail;
    this.firestoreService.batchSetDefaultCategories();

    // this.groupForm.reset();
  }
}
