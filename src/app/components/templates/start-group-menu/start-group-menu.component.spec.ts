import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartGroupMenuComponent } from './start-group-menu.component';

describe('StartGroupMenuComponent', () => {
  let component: StartGroupMenuComponent;
  let fixture: ComponentFixture<StartGroupMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartGroupMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartGroupMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
