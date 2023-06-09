import { Component } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { MembersService } from 'src/app/services/members.service';

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
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private membersService: MembersService
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
    const newMember = {
      name: this.memberForm.value.name,
      id: this.memberForm.value.email,
    };
    this.membersService.addNewMember(newMember);
    this.memberForm.reset();
  }
}
