import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';

import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from './dialog.service';

import { Category, FilterAndSort, Group, Member, Movement } from '../types';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  isShowingStartGroupMenu: boolean = false;
  isLoading: boolean = true;

  currentGroupEmail: string;
  nextGroupEmail: string;

  groupsCollectionRef: AngularFirestoreCollection<Group>;
  currentGroup: Observable<Group>;

  groupMembersCollectionRef: AngularFirestoreCollection<Member>;
  groupCategoriesCollectionRef: AngularFirestoreCollection<Category>;
  groupMovementsCollectionRef: AngularFirestoreCollection<Movement>;

  constructor(
    private db: AngularFirestore,
    private authService: AuthenticationService,
    private dialogService: DialogService
  ) {
    this.currentGroupEmail = 'email...';
    if (localStorage.getItem('groupEmail')) {
      this.currentGroupEmail = localStorage.getItem('groupEmail') || '';
    }

    this.nextGroupEmail = this.currentGroupEmail;

    this.groupsCollectionRef = this.db.collection(`groups`);
    this.currentGroup = this.getCurrentGroup();

    this.groupMembersCollectionRef = this.db.collection(
      `groups/${this.currentGroupEmail}/members`
    );
    this.groupCategoriesCollectionRef = this.db.collection(
      `groups/${this.currentGroupEmail}/categories`,
      (ref) => ref.orderBy('name', 'asc')
    );
    this.groupMovementsCollectionRef = this.db.collection(
      `groups/${this.currentGroupEmail}/movements`,
      (ref) => ref.orderBy('date', 'desc')
    );
  }

  handlerSubmitGroupEmail() {
    localStorage.setItem('groupEmail', this.nextGroupEmail || '');
    location.reload();
  }

  startNewGroup(groupData: Group) {
    this.authService.afAuth.authState.subscribe((user) => {
      const groupRef = this.groupsCollectionRef.doc(user?.email || '');
      groupRef.get().subscribe((doc) => {
        if (doc.exists) {
          this.dialogService.openDialog(`O grupo já existe!`);
        } else {
          groupRef.set(groupData);
          this.dialogService.openDialog(`Novo grupo criado!`);
        }
      });
    });
  }

  filterAndSortDocs<T>(
    collection: Observable<T[]>,
    filterAndSortBy: FilterAndSort
  ): Observable<T[]> {
    if (filterAndSortBy.type === 'all') {
      return collection.pipe(
        map((docs: T[]) =>
          docs.sort((a: any, b: any) =>
            filterAndSortBy.sortBy === 'date'
              ? b[filterAndSortBy.sortBy].localeCompare(
                  a[filterAndSortBy.sortBy]
                )
              : a[filterAndSortBy.sortBy].localeCompare(
                  b[filterAndSortBy.sortBy]
                )
          )
        )
      );
    } else {
      return collection.pipe(
        map((docs: T[]) =>
          docs
            .sort((a: any, b: any) =>
              filterAndSortBy.sortBy === 'date'
                ? b[filterAndSortBy.sortBy].localeCompare(
                    a[filterAndSortBy.sortBy]
                  )
                : a[filterAndSortBy.sortBy].localeCompare(
                    b[filterAndSortBy.sortBy]
                  )
            )
            .filter((doc: any) => doc.type === filterAndSortBy.type)
        )
      );
    }
  }

  getCurrentGroup(): Observable<Group> {
    return this.groupsCollectionRef
      .doc(this.currentGroupEmail || '')
      .snapshotChanges()
      .pipe(
        map((doc) => {
          const data = doc.payload.data() as any;
          const id = doc.payload.id;
          return { id, ...data };
        })
      );
  }

  async updateCurrentGroup(updatedGroup: Group) {
    await this.updateDocOnCollection(
      this.groupsCollectionRef,
      this.currentGroupEmail,
      updatedGroup
    );
    this.currentGroup = this.getCurrentGroup();
  }

  valueChangesCollectionDocs<T>(
    collectionRef: AngularFirestoreCollection<T>
  ): Observable<T[]> {
    return collectionRef.valueChanges({
      idField: 'id',
    }) as Observable<T[]>;
  }

  valueChangesLastMovements(numberOfDocs: number): Observable<Movement[]> {
    return this.db
      .collection<Movement>(
        `groups/${this.currentGroupEmail}/movements`,
        (ref) => ref.orderBy('createAt', 'desc').limit(numberOfDocs)
      )
      .valueChanges({ idField: 'id' });
  }

  valueChangesMonthlyMovements(
    year: string,
    month: string
  ): Observable<Movement[]> {
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    return this.db
      .collection<Movement>(
        `groups/${this.currentGroupEmail}/movements`,
        (ref) =>
          ref
            .orderBy('date', 'desc')
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)
      )
      .valueChanges({ idField: 'id' });
  }

  async addNewDocToCollection<T>(
    collectionRef: AngularFirestoreCollection<T>,
    newDoc: T
  ): Promise<void> {
    this.dialogService.loading = true;
    this.dialogService.openDialog(``);

    await collectionRef
      .add(newDoc)
      .then((newDocRef) => {
        console.log(`Document with id:${newDocRef.id} added to collection!`);
        this.dialogService.loading = false;
        this.dialogService.dialogMessage = 'Adicionado com sucesso!';
      })
      .catch((error: Error) => {
        console.log(error.message);
        this.dialogService.loading = false;
        this.dialogService.dialogMessage =
          'Algo correu mal, por favor tente novamente!';
      });
  }

  async setDocWithIdToCollection<T>(
    collectionRef: AngularFirestoreCollection<T>,
    newDoc: any
  ) {
    this.dialogService.loading = true;
    this.dialogService.openDialog(``);

    const docRef = collectionRef.doc(newDoc.id);
    docRef
      .set(newDoc)
      .then(() => {
        this.dialogService.loading = false;
        this.dialogService.dialogMessage = `Adicionado com sucesso!`;
      })
      .catch((error: Error) => {
        console.log(error.message);
        this.dialogService.loading = false;
        this.dialogService.dialogMessage =
          'Algo correu mal, por favor tente novamente!';
      });
  }

  async updateDocOnCollection<T>(
    collectionRef: AngularFirestoreCollection<T>,
    docId: string,
    updatedDoc: T
  ): Promise<void> {
    this.dialogService.openDialog(``);
    this.dialogService.loading = true;

    await collectionRef
      .doc(docId)
      .update(updatedDoc)
      .then(() => {
        console.log(`Document with id ${docId} is updated`);
        this.dialogService.loading = false;
        this.dialogService.dialogMessage = 'Atualizado com sucesso!';
      })
      .catch((error: Error) => {
        console.log(error.message);
        this.dialogService.loading = false;
        this.dialogService.dialogMessage =
          'Algo correu mal, por favor tente novamente!';
      });
  }

  async deleteDocFromCollection<T>(
    collectionRef: AngularFirestoreCollection<T>,
    docId: string
  ): Promise<void> {
    this.dialogService.openDialog(``);
    this.dialogService.loading = true;

    await collectionRef
      .doc(docId)
      .delete()
      .then(() => {
        console.log(`Document with id ${docId} is deleted`);
        this.dialogService.loading = false;
        this.dialogService.dialogMessage = 'Apagado com sucesso!';
      })
      .catch((error: Error) => {
        console.log(error.message);
        this.dialogService.loading = false;
        this.dialogService.dialogMessage =
          'Algo correu mal, por favor tente novamente!';
      });
  }

  async batchDeleteAllCollectionDocs<T>(
    collectionRef: AngularFirestoreCollection<T>
  ) {
    this.dialogService.openDialog(``);
    this.dialogService.loading = true;

    const batchMaxSize = 500;
    let batch = this.db.firestore.batch();
    let numDocs = 0;

    try {
      const querySnapshot = await collectionRef.ref.get();
      if (querySnapshot) {
        for (const doc of querySnapshot.docs) {
          if (numDocs >= batchMaxSize) {
            await batch.commit();
            batch = this.db.firestore.batch();
            numDocs = 0;
          }
          batch.delete(doc.ref);
          numDocs++;
        }
        if (numDocs > 0) {
          await batch.commit();
        }
        this.dialogService.loading = false;
        this.dialogService.dialogMessage = 'Apagados com sucesso!';
      }
    } catch (error) {
      console.log(error);
      this.dialogService.loading = false;
      this.dialogService.dialogMessage =
        'Algo correu mal, por favor tente novamente!';
    }
  }

  async batchSetDefaultCollectionDocs<T>(
    collectionRef: AngularFirestoreCollection<T>,
    defaultDocs: any[]
  ) {
    this.dialogService.closeDialog();
    this.dialogService.openDialog(``);
    this.dialogService.loading = true;
    try {
      const user = await firstValueFrom(this.authService.afAuth.authState);
      const batch = this.db.firestore.batch();
      const docsRef = collectionRef.ref;

      defaultDocs.forEach((defaultDoc) => {
        const newDoc: T = {
          id: '',
          userId: user?.uid || '',
          ...defaultDoc,
        };

        const docRef = docsRef.doc() as DocumentReference<T>;
        batch.set(docRef, newDoc);
      });

      await batch.commit();
      this.dialogService.loading = false;
      this.dialogService.dialogMessage = 'Categorias padrão repostas!';
    } catch (error) {
      console.log(error);
      this.dialogService.loading = false;
      this.dialogService.dialogMessage =
        'Algo correu mal, por favor tente novamente!';
    }
  }
}
