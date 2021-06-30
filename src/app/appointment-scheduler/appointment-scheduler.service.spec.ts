import { TestBed, inject } from '@angular/core/testing';

import { AppointmentSchedulerService } from './appointment-scheduler.service';

describe('AppointmentSchedulerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppointmentSchedulerService]
    });
  });

  it('should be created', inject([AppointmentSchedulerService], (service: AppointmentSchedulerService) => {
    expect(service).toBeTruthy();
  }));
});
