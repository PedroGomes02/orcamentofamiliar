import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  async getDoc(docID: any) {
    const docRef = await this.movementsCollectionRef?.doc(docID);
    docRef?.get().subscribe((value) => console.log(value.data()));
  }

  async updateDoc(docID: any) {
    await this.movementsCollectionRef
      ?.doc(docID)
      .update({ prop: 'updatedStrinGonDOC' });
    console.log(`Movement with id ${docID} is updated`);
  }

  async deleteDoc(docID: any) {
    await this.movementsCollectionRef?.doc(docID).delete();
    console.log(`Movement with id ${docID} is deleted`);
  }

  updateCategory(docID: string) {
    this.categoriesCollectionRef?.doc(docID).update({});
    console.log(`Category with id ${docID} is updated`);
  }
  deleteCategory(docID: string) {
    this.categoriesCollectionRef?.doc(docID).delete();
    console.log(`Category with id ${docID} is deleted`);
  }
}
