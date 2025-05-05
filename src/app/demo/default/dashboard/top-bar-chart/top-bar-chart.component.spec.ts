import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarChartComponent } from './top-bar-chart.component';

describe('TopBarChartComponent', () => {
  let component: TopBarChartComponent;
  let fixture: ComponentFixture<TopBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopBarChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
