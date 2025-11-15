import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallpaperUploadForm } from './wallpaper-upload-form';

describe('WallpaperUploadForm', () => {
  let component: WallpaperUploadForm;
  let fixture: ComponentFixture<WallpaperUploadForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WallpaperUploadForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WallpaperUploadForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
