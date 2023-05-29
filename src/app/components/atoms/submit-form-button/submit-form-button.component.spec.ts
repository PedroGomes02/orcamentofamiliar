import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitFormButtonComponent } from './submit-form-button.component';

describe('SubmitFormButtonComponent', () => {
  let component: SubmitFormButtonComponent;
  let fixture: ComponentFixture<SubmitFormButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitFormButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitFormButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
