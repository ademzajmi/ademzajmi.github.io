import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissedAppointmentsComponent } from './missed-appointments.component';

describe('MissedAppointmentsComponent', () => {
  let component: MissedAppointmentsComponent;
  let fixture: ComponentFixture<MissedAppointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissedAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissedAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
