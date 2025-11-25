import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Likebutton } from './likebutton';

describe('Likebutton', () => {
  let component: Likebutton;
  let fixture: ComponentFixture<Likebutton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Likebutton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Likebutton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
