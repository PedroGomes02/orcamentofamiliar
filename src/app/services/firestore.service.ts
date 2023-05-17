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

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  categoriesCollectionRef: AngularFirestoreCollection<Category> | undefined;
  movementsCollectionRef: AngularFirestoreCollection<Movement> | undefined;

  groupEmail: string | '';
  submitedGroupEmail: string | '' = '';
  groupIdData: Observable<{ id: string; name: string; admin: string }>;
  groupMembers: Observable<{ id: string; name: string }[]>;

  groupCategoriesCollectionRef:
    | AngularFirestoreCollection<Category>
    | undefined;
  groupMovementsCollectionRef: AngularFirestoreCollection<Movement> | undefined;

  groupCategories: Observable<Category[]> | undefined;
  groupMovements: Observable<Movement[]> | undefined;

  constructor(
    private db: AngularFirestore,
    private authService: AuthenticationService
  ) {
    this.groupEmail = localStorage.getItem('groupEmail') || 'null';
    this.groupIdData = this.getGroupIdData();
    this.groupMembers = this.getGroupMembers();

    this.groupCategoriesCollectionRef = this.db.collection(
      `groups/${this.groupEmail}/categories`,
      (ref) => ref.orderBy('name', 'asc')
    );

    this.groupMovementsCollectionRef = this.db.collection(
      `groups/${this.groupEmail}/movements`,
      (ref) => ref.orderBy('date', 'desc')
    );

    // this.groupCategories = this.getGroupCategories();
    // this.groupMovements = this.getGroupMovements();
  }

  getUserCategories(): Observable<Category[]> {
    return this.authService.afAuth.authState.pipe(
      switchMap((user: any) => {
        this.categoriesCollectionRef = this.db.collection(
          `users/${user.uid}/categories`,
          (ref) => ref.orderBy('name', 'asc')
        );
        return this.categoriesCollectionRef.valueChanges({
          idField: 'id', //Acrescenta ids aos objectos do array quando subscribe
        });
      })
    );
  }

  getUserMovements(): Observable<Movement[]> {
    return this.authService.afAuth.authState.pipe(
      switchMap((user: any) => {
        this.movementsCollectionRef = this.db.collection(
          `users/${user.uid}/movements`,
          (ref) => ref.orderBy('date', 'desc')
        );
        return this.movementsCollectionRef.valueChanges({
          idField: 'id',
        });
      })
    );
  }

  // async getDocc(docID: string) {
  //   const docRef = await this.movementsCollectionRef?.doc(docID);
  //   docRef?.get().subscribe((value) => console.log(value.data()));
  // }

  // updateDoc(collection: string, docID: string, doc: any) {
  //   if (collection === 'categories') {
  //     this.categoriesCollectionRef
  //       ?.doc(docID)
  //       .update(doc)
  //       .then(() => {
  //         console.log(`Category with id ${docID} is updated`);
  //         alert('Categoria atualizada com Sucesso!');
  //       })
  //       .catch((error: Error) => {
  //         console.log(error.message);
  //         alert('Algo correu mal, por favor tente novamente!');
  //       });
  //   }
  //   if (collection === 'movements') {
  //     this.movementsCollectionRef
  //       ?.doc(docID)
  //       .update(doc)
  //       .then(() => {
  //         console.log(`Movement with id ${docID} is updated`);
  //         alert('Movimento atualizado com Sucesso!');
  //       })
  //       .catch((error: Error) => {
  //         console.log(error.message);
  //         alert('Algo correu mal, por favor tente novamente!');
  //       });
  //   }
  // }

  // deleteDoc(collection: string, docID: string) {
  //   if (collection === 'categories') {
  //     this.categoriesCollectionRef
  //       ?.doc(docID)
  //       .delete()
  //       .then(() => {
  //         console.log(`Category with id ${docID} is deleted`);
  //         alert('Categoria apagada com Sucesso!');
  //       })
  //       .catch((error: Error) => {
  //         console.log(error.message);
  //         alert('Algo correu mal, por favor tente novamente!');
  //       });
  //   }
  //   if (collection === 'movements') {
  //     this.movementsCollectionRef
  //       ?.doc(docID)
  //       .delete()
  //       .then(() => {
  //         console.log(`Movement with id ${docID} is deleted`);
  //         alert('Movimento apagado com Sucesso!');
  //       })
  //       .catch((error: Error) => {
  //         console.log(error.message);
  //         alert('Algo correu mal, por favor tente novamente!');
  //       });
  //   }
  // }

  updateDoc(collection: string, docID: string, doc: any) {
    if (collection === 'categories') {
      this.groupCategoriesCollectionRef
        ?.doc(docID)
        .update(doc)
        .then(() => {
          console.log(`Category with id ${docID} is updated`);
          alert('Categoria atualizada com Sucesso!');
        })
        .catch((error: Error) => {
          console.log(error.message);
          alert('Algo correu mal, por favor tente novamente!');
        });
    }
    if (collection === 'movements') {
      this.groupMovementsCollectionRef
        ?.doc(docID)
        .update(doc)
        .then(() => {
          console.log(`Movement with id ${docID} is updated`);
          alert('Movimento atualizado com Sucesso!');
        })
        .catch((error: Error) => {
          console.log(error.message);
          alert('Algo correu mal, por favor tente novamente!');
        });
    }
  }

  deleteDoc(collection: string, docID: string) {
    if (collection === 'categories') {
      this.groupCategoriesCollectionRef
        ?.doc(docID)
        .delete()
        .then(() => {
          console.log(`Category with id ${docID} is deleted`);
          alert('Categoria apagada com Sucesso!');
        })
        .catch((error: Error) => {
          console.log(error.message);
          alert('Algo correu mal, por favor tente novamente!');
        });
    }
    if (collection === 'movements') {
      this.groupMovementsCollectionRef
        ?.doc(docID)
        .delete()
        .then(() => {
          console.log(`Movement with id ${docID} is deleted`);
          alert('Movimento apagado com Sucesso!');
        })
        .catch((error: Error) => {
          console.log(error.message);
          alert('Algo correu mal, por favor tente novamente!');
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
    try {
      const batch = this.db.firestore.batch();
      const querySnapshot = await this.groupCategoriesCollectionRef?.ref.get();
      if (querySnapshot) {
        querySnapshot?.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        alert('Categorias apagadas com sucesso!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async batchSetDefaultCategories() {
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

        const categoryRef = categoriesRef?.doc() as DocumentReference<Category>;
        batch.set(categoryRef, newCategory);
      });
      await batch.commit();
    });
  }

  //JUNTAR OS DOIS BATCHS??
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

  //GROUP TESTING

  getGroupIdData(): Observable<{ id: string; name: string; admin: string }> {
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

  getGroupMembers(): any {
    return this.db
      .collection(`groups/${this.groupEmail}/members`)
      .valueChanges({
        idField: 'id', //Acrescenta ids aos objectos do array quando subscribe
      });
  }

  handlerSubmitGroupEmail() {
    localStorage.setItem('groupEmail', this.groupEmail || 'null');

    this.submitedGroupEmail = this.groupEmail;
    this.groupIdData = this.getGroupIdData();
    this.groupMembers = this.getGroupMembers();
    this.groupCategoriesCollectionRef = this.db.collection(
      `groups/${this.groupEmail}/categories`,
      (ref) => ref.orderBy('name', 'asc')
    );

    this.groupMovementsCollectionRef = this.db.collection(
      `groups/${this.groupEmail}/movements`,
      (ref) => ref.orderBy('date', 'desc')
    );

    this.groupCategories = this.getCategories();
    this.groupMovements = this.getMovements();
  }

  addGroup(groupData: { name: string; admin: string }) {
    this.authService.afAuth.authState.subscribe((user) => {
      const groupRef = this.db.collection(`groups`).doc(user?.email || '');

      groupRef.get().subscribe((doc) => {
        if (doc.exists) {
          console.log(`O grupo já existe!`);
        } else {
          groupRef.set(groupData);
          console.log(`Novo grupo criado!`);
        }
      });
    });
  }

  addMember(
    groupEmail: string,
    userEmail: string,
    memberData: { name: string }
  ) {
    const memberRef = this.db
      .collection(`groups/${groupEmail}/members`)
      .doc(userEmail);
    memberRef.get().subscribe((doc) => {
      if (doc.exists) {
        alert(
          `O membro com o email ${userEmail} já existe nos membros do grupo!`
        );
      } else {
        memberRef.set(memberData);
        alert(
          `O membro com o email ${userEmail} foi adicionado aos membros do grupo!`
        );
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

  addGroupCategory() {
    const newCategory: Category = {
      id: '',
      name: 'categoryGroup',
      type: 'income',
      avatar: 'TT',
      subCategories: null,
      userId: 'USERUID',
    };

    this.groupCategoriesCollectionRef
      ?.add(newCategory)
      .then((documentRef) => {
        console.log(documentRef.id);
        alert('Categoria adicionada com Sucesso!');
      })
      .catch((error: Error) => {
        console.log(error.message);
        alert('Algo correu mal, por favor tente novamente!');
      });
  }

  // TEMPORÁRIO - CLONAR USER PARA GROUP CAT E MOV
  CAT: Category[] = [];
  MOV: Movement[] = [];

  setCategories() {
    this.getUserCategories().subscribe((categories) =>
      categories.forEach((defaultCategory) => this.CAT.push(defaultCategory))
    );
  }

  setMovements() {
    this.getUserMovements().subscribe((movements) =>
      movements.forEach((movement) => this.MOV.push(movement))
    );
  }

  TESTE() {
    console.log(this.CAT);
  }

  TESTE2() {
    console.log(this.MOV);
  }

  async batchCloneCategories() {
    this.authService.afAuth.authState.subscribe(async (doc) => {
      const batch = this.db.firestore.batch();
      const groupCategoriesRef = this.groupCategoriesCollectionRef?.ref;

      this.CAT.forEach((category) => {
        const categoryRef =
          groupCategoriesRef?.doc() as DocumentReference<Category>;
        batch.set(categoryRef, category);
      });

      await batch.commit();
    });
  }

  async batchCloneMovements() {
    this.authService.afAuth.authState.subscribe(async (doc) => {
      const batch = this.db.firestore.batch();
      const groupMovementsRef = this.groupMovementsCollectionRef?.ref;

      this.MOV.forEach((movement) => {
        const movementRef =
          groupMovementsRef?.doc() as DocumentReference<Movement>;
        batch.set(movementRef, movement);
      });

      await batch.commit();
    });
  }
}
