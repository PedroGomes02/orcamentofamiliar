import { Component } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.css'],
})
export class NewMemberComponent {
  userId: string = '';
  userEmail: string = '';
  memberForm: FormGroup;

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

    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  handlerSubmitMemberForm() {
    const memberData = { name: this.memberForm.value.name };
    this.firestoreService.addMember(
      this.firestoreService.groupEmail,
      this.memberForm.value.email,
      memberData
    );
    this.memberForm.reset();
  }
}
