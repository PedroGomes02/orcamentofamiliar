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
  movementsCollectionRef: AngularFirestoreCollection<any> | undefined;
  userId: string = '';

  constructor(
    private db: AngularFirestore,
    private authService: AuthenticationService
  ) {}

  getCategories(): Observable<Category[]> {
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

  getMovements(): Observable<Movement[]> {
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

  async getDocc(docID: string) {
    const docRef = await this.movementsCollectionRef?.doc(docID);
    docRef?.get().subscribe((value) => console.log(value.data()));
  }

  updateDoc(collection: string, docID: string, doc: any) {
    if (collection === 'categories') {
      this.categoriesCollectionRef
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
      this.movementsCollectionRef
        ?.doc(docID)
        .update(doc)
        .then(() => {
          console.log(docID, 'moovement updated');
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
      this.categoriesCollectionRef?.doc(docID).delete();
      console.log(`Category with id ${docID} is deleted`);
    }
    if (collection === 'movements') {
      this.movementsCollectionRef?.doc(docID).delete();
      console.log(`Movement with id ${docID} is deleted`);
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
    const batch = this.db.firestore.batch();
    const querySnapshot = await this.categoriesCollectionRef?.ref.get();
    querySnapshot?.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }

  async batchSetDefaultCategories() {
    const batch = this.db.firestore.batch();

    const categoriesRef = this.categoriesCollectionRef?.ref;

    defaultCategories.forEach((defaultCategory) => {
      const newCategory: Category = {
        id: '',
        name: defaultCategory.name,
        type: defaultCategory.type,
        avatar: defaultCategory.avatar,
        subCategories: null,
        userId: this.userId,
      };
      const categoryRef = categoriesRef?.doc() as DocumentReference<Category>;
      batch.set(categoryRef, newCategory);
    });

    await batch.commit();
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
}
