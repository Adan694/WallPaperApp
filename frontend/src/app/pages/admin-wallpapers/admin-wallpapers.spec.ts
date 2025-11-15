import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWallpapers } from './admin-wallpapers';

describe('AdminWallpapers', () => {
  let component: AdminWallpapers;
  let fixture: ComponentFixture<AdminWallpapers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminWallpapers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminWallpapers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
