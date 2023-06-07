import { Injectable } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

import { DialogService } from './dialog.service';
import { FirestoreService } from './firestore.service';

import { Member } from '../types';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  membersCollectionRef: AngularFirestoreCollection<Member>;
  members: Observable<Member[]>;

  currentMembersEmails: string[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private dialogService: DialogService
  ) {
    this.membersCollectionRef = this.firestoreService.groupMembersCollectionRef;
    this.members = this.getMembers();

    this.members.subscribe((members: Member[]) => {
      members.forEach((member: Member) => {
        this.currentMembersEmails.push(member.id || '');
      });
    });
  }

  getMembers() {
    return this.firestoreService.getCollectionDocs<Member>(
      this.membersCollectionRef
    );
  }

  refreshMembers() {
    this.members = this.getMembers();
    this.members.subscribe((members: Member[]) => {
      members.forEach((member: Member) => {
        this.currentMembersEmails.push(member.id || '');
      });
    });
  }

  async addNewMember(newMember: Member) {
    if (this.currentMembersEmails.includes(newMember.id || '')) {
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
    this.refreshMembers();
  }

  //UPDATE MEMBER NOT IMPLEMENT YET
  async updateMember(memberId: string, updatedMember: Member) {
    await this.firestoreService.updateDocOnCollection<Member>(
      this.membersCollectionRef,
      memberId,
      updatedMember
    );
    this.refreshMembers();
  }

  async deleteMember(memberId: string) {
    await this.firestoreService.deleteDocFromCollection<Member>(
      this.membersCollectionRef,
      memberId
    );
    this.refreshMembers();
  }
}
