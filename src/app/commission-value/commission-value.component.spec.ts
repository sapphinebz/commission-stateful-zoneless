import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionValueComponent } from './commission-value.component';

describe('CommissionValueComponent', () => {
  let component: CommissionValueComponent;
  let fixture: ComponentFixture<CommissionValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
