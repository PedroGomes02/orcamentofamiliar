import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';

import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogService } from './dialog.service';
import { PaginationService } from './pagination.service';

import { Category, Group, Member, Movement } from '../types';

import { defaultCategories } from 'src/assets/defaultCategories';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  currentGroupEmail: string;
  nextGroupEmail: string;

  isShowingStartGroupMenu: boolean = false;
  isLoading: boolean = true;

  groupsCollectionRef: AngularFirestoreCollection<Group>;
  groupData: Observable<Group>;

  groupMembersCollectionRef: AngularFirestoreCollection<Member>;
  groupMembers: Observable<Member[]>;

  groupCategoriesCollectionRef: AngularFirestoreCollection<Category>;
  groupCategories: Observable<Category[]>;
  filteredGroupCategories: Observable<Category[]>;

  groupMovementsCollectionRef: AngularFirestoreCollection<Movement>;
  groupMovements: Observable<Movement[]>;

  constructor(
    private db: AngularFirestore,
    private authService: AuthenticationService,
    private dialogService: DialogService,
    private paginationService: PaginationService,
   
  ) {
    this.currentGroupEmail = 'email...';
    if (localStorage.getItem('groupEmail')) {
      this.currentGroupEmail = localStorage.getItem('groupEmail') || '';
    }

    this.nextGroupEmail = this.currentGroupEmail;

    this.groupsCollectionRef = this.db.collection(`groups`);
    this.groupData = this.getGroup();

    this.groupMembersCollectionRef = this.db.collection(
      `groups/${this.currentGroupEmail}/members`
    );
    this.groupMembers = this.getGroupMembers();

    this.groupCategoriesCollectionRef = this.db.collection(
      `groups/${this.currentGroupEmail}/categories`,
      (ref) => ref.orderBy('name', 'asc')
    );
    this.groupCategories = this.getGroupCategories();
    this.filteredGroupCategories = this.groupCategories;

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

  getGroup(): Observable<Group> {
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

  addGroup(groupData: Group) {
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

  async updateGroup(groupData: { name: string; admin: string }) {
    this.dialogService.loading = true;
    this.dialogService.openDialog(``);

    try {
      await this.groupsCollectionRef.doc(this.currentGroupEmail).set(groupData);
      this.dialogService.loading = false;
      this.dialogService.dialogMessage = `Dados do grupo atualizados com sucesso!`;
      this.groupData = this.getGroup();
    } catch (error) {
      this.dialogService.loading = false;
      this.dialogService.dialogMessage =
        'Algo correu mal, por favor tente novamente!';
    }
  }

  getGroupMembers(): Observable<Member[]> {
    return from(this.groupMembersCollectionRef.get()).pipe(
      map((querySnapshot) => {
        const members: any[] = [];
        querySnapshot.forEach((doc) => {
          const member = doc.data() as any;
          member.id = doc.id;
          members.push(member);
        });
        return members;
      })
    );
  }

  addGroupMember(memberData: Member) {
    this.dialogService.loading = true;
    this.dialogService.openDialog(``);

    const memberRef = this.groupMembersCollectionRef.doc(memberData.id);

    memberRef.get().subscribe((doc) => {
      if (doc.exists) {
        this.dialogService.loading = false;
        this.dialogService.dialogMessage = `O membro com o email ${memberData.id} já existe no grupo!`;
      } else {
        memberRef
          .set({ name: memberData.name })
          .then(() => {
            this.dialogService.loading = false;
            this.dialogService.dialogMessage = `O membro com o email ${memberData.id} foi adicionado ao grupo!`;
            this.groupMembers = this.getGroupMembers();
          })
          .catch((error: Error) => {
            console.log(error.message);
            this.dialogService.loading = false;
            this.dialogService.dialogMessage =
              'Algo correu mal, por favor tente novamente!';
          });
      }
    });
  }

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

  // Use get() to make only one read of all docs of a collection, needs to get call again if something is change! (photo)
  // getGroupMovementsQuerySnapshot(): Observable<Movement[]> {
  //   if (this.groupMovementsCollectionRef) {
  //     return from(this.groupMovementsCollectionRef.get()).pipe(
  //       map((querySnapshot) => {
  //         const movements: Movement[] = [];
  //         querySnapshot.forEach((doc) => {
  //           const movement = doc.data() as Movement;
  //           movement.id = doc.id;
  //           movements.push(movement);
  //         });
  //         return movements;
  //       })
  //     );
  //   }
  //   throw new Error('groupMovementsCollectionRef is not defined');
  // }

  updateDoc(collection: string, docID: string, doc: any) {
    this.dialogService.openDialog(``);
    this.dialogService.loading = true;

    if (collection === 'categories') {
      this.groupCategoriesCollectionRef
        ?.doc(docID)
        .update(doc)
        .then(() => {
          console.log(`Category with id ${docID} is updated`);
          this.dialogService.loading = false;
          this.dialogService.dialogMessage =
            'Categoria atualizada com Sucesso!';
        })
        .catch((error: Error) => {
          console.log(error.message);
          this.dialogService.loading = false;
          this.dialogService.dialogMessage =
            'Algo correu mal, por favor tente novamente!';
        });
    }
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

    if (collection === 'categories') {
      this.groupCategoriesCollectionRef
        ?.doc(docID)
        .delete()
        .then(() => {
          console.log(`Category with id ${docID} is deleted`);
          this.dialogService.loading = false;
          this.dialogService.dialogMessage = 'Categoria apagada com Sucesso!';
          this.paginationService.currentPage = 1;
        })
        .catch((error: Error) => {
          console.log(error.message);
          this.dialogService.loading = false;
          this.dialogService.dialogMessage =
            'Algo correu mal, por favor tente novamente!';
        });
    }
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

    if (collection === 'members') {
      this.db
        .collection(`groups/${this.currentGroupEmail}/members`)
        .doc(docID)
        .delete()
        .then(() => {
          console.log(`Member with id ${docID} is deleted`);
          this.dialogService.loading = false;
          this.dialogService.dialogMessage = 'Membro apagado com sucesso!';
          this.groupMembers = this.getGroupMembers();
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

  filterAndSortCategories(filterAndSortBy: { type: string; sortBy: string }) {
    this.filteredGroupCategories = this.filterAndSortDocs(
      this.groupCategories,
      filterAndSortBy
    );
    this.filteredGroupCategories
      .pipe(map((array) => array.length))
      .subscribe((arrayLength) => {
        this.paginationService.calculateNumberOfPages(arrayLength);
      });
    this.paginationService.currentPage = 1;
  }

  async batchDeleteCategories() {
    this.dialogService.openDialog(``);
    this.dialogService.loading = true;
    try {
      const batch = this.db.firestore.batch();
      const querySnapshot = await this.groupCategoriesCollectionRef?.ref.get();
      if (querySnapshot) {
        querySnapshot?.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        this.dialogService.loading = false;
        this.dialogService.dialogMessage = 'Categorias apagadas com sucesso!';
        this.groupCategories = this.getGroupCategories();
      }
    } catch (error) {
      console.log(error);
      this.dialogService.loading = false;
      this.dialogService.dialogMessage =
        'Algo correu mal, por favor tente novamente!';
    }
  }

  async batchSetDefaultCategories() {
    await this.batchDeleteCategories();
    this.dialogService.loading = true;
    try {
      this.authService.afAuth.authState.subscribe(async (doc) => {
        const batch = this.db.firestore.batch();
        const categoriesRef = this.groupCategoriesCollectionRef?.ref;
        defaultCategories.forEach((defaultCategory) => {
          const newCategory: Category = {
            id: '',
            name: defaultCategory.name,
            type: defaultCategory.type,
            avatar: defaultCategory.avatar,
            subCategories: defaultCategory.subCategories,
            userId: doc?.uid || '',
          };
          const categoryRef =
            categoriesRef?.doc() as DocumentReference<Category>;
          batch.set(categoryRef, newCategory);
        });
        await batch.commit();
        this.dialogService.loading = false;
        this.dialogService.dialogMessage = 'Categorias padrão repostas!';
        this.groupCategories = this.getGroupCategories();
      });
    } catch (error) {
      console.log(error);
      this.dialogService.loading = false;
      this.dialogService.dialogMessage =
        'Algo correu mal, por favor tente novamente!';
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
}
