import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, firstValueFrom } from 'rxjs';

import { DialogService } from './dialog.service';
import { FirestoreService } from './firestore.service';

import { Member } from '../types';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  membersCollectionRef: AngularFirestoreCollection<Member>;
  members: Observable<Member[]>;

  constructor(
    private firestoreService: FirestoreService,
    private dialogService: DialogService
  ) {
    this.membersCollectionRef = this.firestoreService.groupMembersCollectionRef;
    this.members = this.getMembers();
  }

  getMembers() {
    return this.firestoreService.valueChangesCollectionDocs<Member>(
      this.membersCollectionRef
    );
  }

  async addNewMember(newMember: Member) {
    if (
      (await firstValueFrom(this.membersCollectionRef.doc(newMember.id).get()))
        .exists
    ) {
      this.dialogService.loading = false;
      this.dialogService.openDialog(
        `O membro com o email: ${newMember.id} já existe no grupo!`
      );
      return;
    }
    await this.firestoreService.setDocWithIdToCollection(
      this.membersCollectionRef,
      newMember
    );
  }

  //UPDATE MEMBER NOT IMPLEMENT YET
  async updateMember(memberId: string, updatedMember: Member) {
    await this.firestoreService.updateDocOnCollection<Member>(
      this.membersCollectionRef,
      memberId,
      updatedMember
    );
  }

  async deleteMember(memberId: string) {
    await this.firestoreService.deleteDocFromCollection<Member>(
      this.membersCollectionRef,
      memberId
    );
  }
}
