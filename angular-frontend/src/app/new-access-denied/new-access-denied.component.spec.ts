import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAccessDeniedComponent } from './new-access-denied.component';

describe('NewAccessDeniedComponent', () => {
  let component: NewAccessDeniedComponent;
  let fixture: ComponentFixture<NewAccessDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAccessDeniedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAccessDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
