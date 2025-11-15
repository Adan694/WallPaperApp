import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStatsCard } from './admin-stats-card';

describe('AdminStatsCard', () => {
  let component: AdminStatsCard;
  let fixture: ComponentFixture<AdminStatsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStatsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStatsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
