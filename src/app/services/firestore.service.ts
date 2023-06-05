import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';

import { Observable, firstValueFrom, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from './dialog.service';

import { Category, Group, Member, Movement } from '../types';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  currentGroupEmail: string;
  nextGroupEmail: string;

  isShowingStartGroupMenu: boolean = false;
  isLoading: boolean = true;

  groupsCollectionRef: AngularFirestoreCollection<Group>;
  currentGroup: Observable<Group>;

  groupMembersCollectionRef: AngularFirestoreCollection<Member>;
  groupCategoriesCollectionRef: AngularFirestoreCollection<Category>;

  // groupMembers: Observable<Member[]>;
  // groupCategories: Observable<Category[]>;
  // filteredGroupCategories: Observable<Category[]>;

  groupMovementsCollectionRef: AngularFirestoreCollection<Movement>;
  groupMovements: Observable<Movement[]>;

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
    this.groupMovements = this.getGroupMovements();
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

  // USED IN SUMMARY...
  getGroupCategories(): Observable<Category[]> {
    return this.groupCategoriesCollectionRef?.valueChanges({
      idField: 'id', //Adds ids to array objects when subscribe
    }) as Observable<Category[]>;
  }

  // Use get() to make only one read of all docs of a collection, needs to get call again if something is change! (photo)
  // getGroupCategories(): Observable<Category[]> {
  //   if (this.groupCategoriesCollectionRef) {
  //     return from(this.groupCategoriesCollectionRef.get()).pipe(
  //       map((querySnapshot) => {
  //         const categories: Category[] = [];
  //         querySnapshot.forEach((doc) => {
  //           const category = doc.data() as Category;
  //           category.id = doc.id;
  //           categories.push(category);
  //         });
  //         return categories;
  //       })
  //     );
  //   }
  //   throw new Error('groupCategoriesCollectionRef is not defined');
  // }

  getGroupMovements(): Observable<Movement[]> {
    return this.groupMovementsCollectionRef?.valueChanges({
      idField: 'id', //Adds ids to array objects when subscribe
    }) as Observable<Movement[]>;
  }

  updateDoc(collection: string, docID: string, doc: any) {
    this.dialogService.openDialog(``);
    this.dialogService.loading = true;

    if (collection === 'movements') {
      this.groupMovementsCollectionRef
        ?.doc(docID)
        .update(doc)
        .then(() => {
          console.log(`Movement with id ${docID} is updated`);
          this.dialogService.loading = false;
          this.dialogService.dialogMessage =
            'Movimento atualizado com Sucesso!';
        })
        .catch((error: Error) => {
          console.log(error.message);
          this.dialogService.loading = false;
          this.dialogService.dialogMessage =
            'Algo correu mal, por favor tente novamente!';
        });
    }
  }

  deleteDoc(collection: string, docID: string) {
    this.dialogService.openDialog(``);
    this.dialogService.loading = true;

    if (collection === 'movements') {
      this.groupMovementsCollectionRef
        ?.doc(docID)
        .delete()
        .then(() => {
          console.log(`Movement with id ${docID} is deleted`);
          this.dialogService.loading = false;
          this.dialogService.dialogMessage = 'Movimento apagado com Sucesso!';
        })
        .catch((error: Error) => {
          console.log(error.message);
          this.dialogService.loading = false;
          this.dialogService.dialogMessage =
            'Algo correu mal, por favor tente novamente!';
        });
    }
  }

  filterAndSortDocs<T>(
    collection: Observable<T[]>,
    filterAndSortBy: {
      type: string;
      sortBy: string;
    }
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

  async batchDeleteMovements() {
    this.dialogService.openDialog(``);
    this.dialogService.loading = true;
    const batchSize = 500;
    let batch = this.db.firestore.batch();
    let numElements = 0;
    try {
      const querySnapshot = await this.groupMovementsCollectionRef?.ref.get();
      if (querySnapshot) {
        for (const doc of querySnapshot.docs) {
          if (numElements >= batchSize) {
            await batch.commit();
            batch = this.db.firestore.batch();
            numElements = 0;
          }
          batch.delete(doc.ref);
          numElements++;
        }
        if (numElements > 0) {
          await batch.commit();
        }
        this.dialogService.loading = false;
        this.dialogService.dialogMessage = 'Movimentos apagados com sucesso!';
      }
    } catch (error) {
      console.log(error);
      this.dialogService.loading = false;
      this.dialogService.dialogMessage =
        'Algo correu mal, por favor tente novamente!';
    }
  }

  //NEW FUNCTIONS

  getCurrentGroup(): Observable<Group> {
    return this.groupsCollectionRef
      .doc(this.currentGroupEmail || '')
      .get()
      .pipe(
        map((doc) => {
          const data = doc.data() as any;
          const id = doc.id;
          return { id, ...data };
        })
      );
  }

  async updateCurrentGroup(updatedGroup: { name: string; admin: string }) {
    await this.updateDocOnCollection(
      this.groupsCollectionRef,
      this.currentGroupEmail,
      updatedGroup
    );
    this.currentGroup = this.getCurrentGroup();
  }

  getCollectionDocs<T>(
    collectionRef: AngularFirestoreCollection<T>
  ): Observable<T[]> {
    return from(collectionRef.get()).pipe(
      map((querySnapshot) => {
        const collectionDocs: T[] = [];
        querySnapshot.forEach((collectionDoc) => {
          const doc = collectionDoc.data() as any;
          doc.id = collectionDoc.id;
          collectionDocs.push(doc);
        });
        return collectionDocs;
      })
    );
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
        this.dialogService.dialogMessage = 'Documento adicionado com sucesso!';
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
        this.dialogService.dialogMessage = 'Documento apagado com sucesso!';
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
        this.dialogService.dialogMessage = 'Documentos apagados com sucesso!';
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
