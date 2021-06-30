import { TestBed, inject } from '@angular/core/testing';

import { TreatmentsService } from './treatments.service';

describe('TreatmentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreatmentsService]
    });
  });

  it('should be created', inject([TreatmentsService], (service: TreatmentsService) => {
    expect(service).toBeTruthy();
  }));
});
