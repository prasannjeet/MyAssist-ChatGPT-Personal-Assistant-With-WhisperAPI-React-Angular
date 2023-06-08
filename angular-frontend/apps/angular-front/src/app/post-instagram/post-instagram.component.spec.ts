import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostInstagramComponent } from './post-instagram.component';

describe('PostInstagramComponent', () => {
  let component: PostInstagramComponent;
  let fixture: ComponentFixture<PostInstagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostInstagramComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostInstagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
