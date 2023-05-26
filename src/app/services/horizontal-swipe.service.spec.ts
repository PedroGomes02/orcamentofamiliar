import { TestBed } from '@angular/core/testing';

import { HorizontalSwipeService } from './horizontal-swipe.service';

describe('HorizontalSwipeService', () => {
  let service: HorizontalSwipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorizontalSwipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
