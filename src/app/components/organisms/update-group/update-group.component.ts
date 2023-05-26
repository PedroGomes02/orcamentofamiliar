import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-update-group',
  templateUrl: './update-group.component.html',
  styleUrls: ['./update-group.component.css'],
})
export class UpdateGroupComponent {
  updateGroupForm: FormGroup;

  groupName: string = '';
  groupAdmin: string = '';

  constructor(
    private firestoreService: FirestoreService,
    private fb: FormBuilder
  ) {
    this.updateGroupForm = this.fb.group({
      groupName: [''],
      groupAdmin: [''],
    });
  }

  ngOnInit() {
    this.firestoreService.groupData.subscribe((data) => {
      this.updateGroupForm.controls['groupName'].setValue(data.name);
      this.updateGroupForm.controls['groupAdmin'].setValue(data.admin);
    });
  }

  handlerSubmitUpdateGroupForm() {
    this.firestoreService.updateGroup({
      name: this.updateGroupForm.value.groupName,
      admin: this.updateGroupForm.value.groupAdmin,
    });
    this.updateGroupForm.reset();
  }
}
