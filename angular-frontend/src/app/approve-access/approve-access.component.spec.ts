import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveAccessComponent } from './approve-access.component';

describe('ApproveAccessComponent', () => {
  let component: ApproveAccessComponent;
  let fixture: ComponentFixture<ApproveAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
