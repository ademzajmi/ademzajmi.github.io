import { TestBed, inject } from '@angular/core/testing';

import { AnamnezaService } from './anamneza.service';

describe('AnamnezaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnamnezaService]
    });
  });

  it('should be created', inject([AnamnezaService], (service: AnamnezaService) => {
    expect(service).toBeTruthy();
  }));
});
