import { TestBed, inject } from '@angular/core/testing';

import { CustomerFormService } from './customer-form.service';

describe('CustomerFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerFormService]
    });
  });

  it('should be created', inject([CustomerFormService], (service: CustomerFormService) => {
    expect(service).toBeTruthy();
  }));
});
