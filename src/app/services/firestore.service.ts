import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/services/authentication.service';

import { Category, Movement } from '../types';

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

  updateDoc(collection: string, docID: string) {
    if (collection === 'categories') {
      this.categoriesCollectionRef?.doc(docID).update({});
      console.log(`Category with id ${docID} is updated`);
    }
    if (collection === 'movements') {
      this.movementsCollectionRef?.doc(docID).update({});
      console.log(`Movement with id ${docID} is updated`);
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
}
