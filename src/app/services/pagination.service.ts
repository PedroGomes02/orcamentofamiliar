import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  numberDocsByPage: number = 6;
  currentPage: number = 1;
  numberOfPages: number = 1;
  totalDocs: number = 0;

  constructor() {}
  calculateNumberOfPages(arrayLength: number) {
    this.totalDocs = arrayLength;
    this.numberOfPages = Math.ceil(arrayLength / this.numberDocsByPage);
  }

  nextPage() {
    this.currentPage =
      this.currentPage === this.numberOfPages
        ? this.currentPage
        : this.currentPage + 1;
  }

  previousPage() {
    this.currentPage =
      this.currentPage === 1 ? this.currentPage : this.currentPage - 1;
  }
}
