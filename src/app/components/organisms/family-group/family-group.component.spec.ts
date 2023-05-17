import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyGroupComponent } from './family-group.component';

describe('FamilyGroupComponent', () => {
  let component: FamilyGroupComponent;
  let fixture: ComponentFixture<FamilyGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
