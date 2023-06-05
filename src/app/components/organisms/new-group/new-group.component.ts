import { Component } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { defaultCategories } from 'src/assets/defaultCategories';

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
    const newGroup = {
      name: this.groupForm.value.name,
      admin: this.groupForm.value.admin,
    };
    this.firestoreService.startNewGroup(newGroup);
    this.firestoreService.currentGroupEmail = this.userEmail;
    this.firestoreService.batchSetDefaultCollectionDocs(
      this.firestoreService.groupCategoriesCollectionRef,
      defaultCategories
    );

    // this.groupForm.reset();
  }
}
