import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAppointmentsGridComponent } from './customer-appointments-grid.component';

describe('CustomerAppointmentsGridComponent', () => {
  let component: CustomerAppointmentsGridComponent;
  let fixture: ComponentFixture<CustomerAppointmentsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAppointmentsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAppointmentsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
