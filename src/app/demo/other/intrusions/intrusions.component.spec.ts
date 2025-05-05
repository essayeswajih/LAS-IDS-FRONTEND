import { ComponentFixture, TestBed } from '@angular/core/testing';

import  IntrusionsComponent  from './intrusions.component';

describe('IntrusionsComponent', () => {
  let component: IntrusionsComponent;
  let fixture: ComponentFixture<IntrusionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntrusionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntrusionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
