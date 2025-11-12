import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallpaperDetail } from './wallpaper-detail';

describe('WallpaperDetail', () => {
  let component: WallpaperDetail;
  let fixture: ComponentFixture<WallpaperDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WallpaperDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WallpaperDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
