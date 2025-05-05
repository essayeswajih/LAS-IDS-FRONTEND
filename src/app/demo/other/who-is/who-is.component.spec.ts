import { ComponentFixture, TestBed } from '@angular/core/testing';

import  WhoIsComponent  from './who-is.component';

describe('WhoIsComponent', () => {
  let component: WhoIsComponent;
  let fixture: ComponentFixture<WhoIsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhoIsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoIsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
