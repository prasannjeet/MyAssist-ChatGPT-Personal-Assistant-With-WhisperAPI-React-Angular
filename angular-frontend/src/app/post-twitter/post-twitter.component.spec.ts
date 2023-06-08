import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTwitterComponent } from './post-twitter.component';

describe('PostTwitterComponent', () => {
  let component: PostTwitterComponent;
  let fixture: ComponentFixture<PostTwitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostTwitterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTwitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
