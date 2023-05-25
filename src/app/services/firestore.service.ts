import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/services/authentication.service';

import { Category, Movement } from '../types';

import { defaultCategories } from 'src/assets/defaultCategories';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  // categoriesCollectionRef: AngularFirestoreCollection<Category> | undefined;
  // movementsCollectionRef: AngularFirestoreCollection<Movement> | undefined;

  groupEmail: string | '';
  submitedGroupEmail: string | '' = '';
  groupData: Observable<{ id: string; name: string; admin: string }>;
  groupMembers: Observable<{ id: string; name: string }[]>;

  isShowingStartGroupMenu: boolean = false;
  isLoading: boolean = true;

  groupCategoriesCollectionRef:
    | AngularFirestoreCollection<Category>
    | undefined;
  groupMovementsCollectionRef: AngularFirestoreCollection<Movement> | undefined;

  // groupCategories: Observable<Category[]> | undefined;
  // groupMovements: Observable<Movement[]> | undefined;

  constructor(
    private db: AngularFirestore,
    private authService: AuthenticationService,
    private dialogService: DialogService
  ) {
    this.groupEmail = 'email...';
    if (localStorage.getItem('groupEmail')) {
      this.groupEmail = localStorage.getItem('groupEmail') || '';
    }
    if (this.groupEmail !== 'email...') {
      this.submitedGroupEmail = this.groupEmail;
    }
    this.groupData = this.getGroupData();
    this.groupMembers = this.getGroupMembers();

    this.groupCategoriesCollectionRef = this.db.collection(
      `groups/${this.groupEmail}/categories`,
      (ref) => ref.orderBy('name', 'asc')
    );

    this.groupMovementsCollectionRef = this.db.collection(
      `groups/${this.groupEmail}/movements`,
      (ref) => ref.orderBy('date', 'desc')
    );
  }

  getGroupData(): Observable<{ id: string; name: string; admin: string }> {
    return this.db
      .collection('groups')
      .doc(this.groupEmail || '')
      .snapshotChanges()
      .pipe(
        map((doc) => {
          const data = doc.payload.data() as any;
          const id = doc.payload.id;
          return { id, ...data };
        })
      );
  }

  addGroup(groupData: { name: string; admin: string }) {
    this.authService.afAuth.authState.subscribe((user) => {
      const groupRef = this.db.collection(`groups`).doc(user?.email || '');

      groupRef.get().subscribe((doc) => {
        if (doc.exists) {
          this.dialogService.openDialog(`O grupo já existe!`);
          console.log(`O grupo já existe!`);
        } else {
          groupRef.set(groupData);
          this.dialogService.openDialog(`Novo grupo criado!`);
          console.log(`Novo grupo criado!`);
        }
      });
    });
  }

  getGroupMembers(): any {
    return this.db
      .collection(`groups/${this.groupEmail}/members`)
      .valueChanges({
        idField: 'id', //Acrescenta ids aos objectos do array quando subscribe
      });
  }

  handlerSubmitGroupEmail() {
    localStorage.setItem('groupEmail', this.groupEmail || '');
    location.reload();
    // this.submitedGroupEmail = this.groupEmail;
    // this.isShowingStartGroupMenu = false;
    // this.isLoading = true;
    // this.getGroupIdData()
    //   .forEach((groupData) => (this.isLoading = false))
    //   .catch(() => (this.isShowingStartGroupMenu = true));
    // this.groupIdData = this.getGroupIdData();
    // this.groupMembers = this.getGroupMembers();
    // this.groupIdData.subscribe((data) => {
    //   if (data) {
    //     this.isShowingStartGroupMenu = false;
    //     this.isLoading = false;
    //   }
    // });
    // this.groupCategoriesCollectionRef = this.db.collection(
    //   `groups/${this.groupEmail}/categories`,
    //   (ref) => ref.orderBy('name', 'asc')
    // );
    // this.groupMovementsCollectionRef = this.db.collection(
    //   `groups/${this.groupEmail}/movements`,
    //   (ref) => ref.orderBy('date', 'desc')
    // );
    // this.groupCategories = this.getCategories();
    // this.groupMovements = this.getMovements();
  }

  addMember(
    groupEmail: string,
    userEmail: string,
    memberData: { name: string }
  ) {
    this.dialogService.loading = true;
    this.dialogService.openDialog(``);

    const memberRef = this.db
      .collection(`groups/${groupEmail}/members`)
      .doc(userEmail);

    memberRef.get().subscribe((doc) => {
      if (doc.exists) {
        this.dialogService.loading = false;
        this.dialogService.dialogMessage = `O membro com o email ${userEmail} já existe no grupo!`;
      } else {
        memberRef
          .set(memberData)
          .then(() => {
            this.dialogService.loading = false;
            this.dialogService.dialogMessage = `O membro com o email ${userEmail} foi adicionado ao grupo!`;
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

  getMovements(): Observable<Movement[]> {
    return this.groupMovementsCollectionRef?.valueChanges({
      idField: 'id', //Acrescenta ids aos objectos do array quando subscribe
    }) as Observable<Movement[]>;
  }

  getCategories(): Observable<Category[]> {
    return this.groupCategoriesCollectionRef?.valueChanges({
      idField: 'id', //Acrescenta ids aos objectos do array quando subscribe
    }) as Observable<Category[]>;
  }

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
        .collection(`groups/${this.groupEmail}/members`)
        .doc(docID)
        .delete()
        .then(() => {
          console.log(`Member with id ${docID} is deleted`);
          this.dialogService.loading = false;
          this.dialogService.dialogMessage = 'Membro apagado com sucesso!';
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
      }
    } catch (error) {
      console.log(error);
      this.dialogService.loading = false;
      this.dialogService.dialogMessage =
        'Algo correu mal, por favor tente novamente!';
    }
  }

  async batchSetDefaultCategories() {
    this.dialogService.openDialog(``);
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

  //JUNTAR OS DOIS BATCHS?? DELETE CATEGORIES E ADD CATEGORIAS PADRÃO??
  // async handlerSetDefaultCategories() {
  //   if (confirm('Este comando vai apagar todas as categorias atuais e repor as categorias padrão, tem a certeza?')) {
  //     try {
  //       const batch = this.firestoreService.batch();

  //       // Adicionar todas as novas categorias no batch
  //       defaultCategories.forEach((defaultCategory) => {
  //         const newCategory: Category = {
  //           id: '',
  //           name: defaultCategory.name,
  //           type: defaultCategory.type,
  //           avatar: defaultCategory.avatar,
  //           subCategories: null,
  //           userId: this.userId,
  //         };
  //         const categoryRef = this.firestoreService.categoriesCollectionRef?.doc();
  //         batch.set(categoryRef, newCategory);
  //       });

  //       // Apagar todas as categorias atuais no batch
  //       const currentCategories = await this.firestoreService.categoriesCollectionRef?.get().toPromise();
  //       currentCategories?.forEach((category) => {
  //         const categoryRef = this.firestoreService.categoriesCollectionRef?.doc(category.id);
  //         batch.delete(categoryRef);
  //       });

  //       // Executar o batch
  //       await batch.commit();
  //     } catch (error) {
  //       console.error('Error setting default categories:', error);
  //     }
  //   }
  // }

  // getUserCategories(): Observable<Category[]> {
  //   return this.authService.afAuth.authState.pipe(
  //     switchMap((user: any) => {
  //       this.categoriesCollectionRef = this.db.collection(
  //         `users/${user.uid}/categories`,
  //         (ref) => ref.orderBy('name', 'asc')
  //       );
  //       return this.categoriesCollectionRef.valueChanges({
  //         idField: 'id', //Acrescenta ids aos objectos do array quando subscribe
  //       });
  //     })
  //   );
  // }
  // getUserMovements(): Observable<Movement[]> {
  //   return this.authService.afAuth.authState.pipe(
  //     switchMap((user: any) => {
  //       this.movementsCollectionRef = this.db.collection(
  //         `users/${user.uid}/movements`,
  //         (ref) => ref.orderBy('date', 'desc')
  //       );
  //       return this.movementsCollectionRef.valueChanges({
  //         idField: 'id',
  //       });
  //     })
  //   );
  // }
}
