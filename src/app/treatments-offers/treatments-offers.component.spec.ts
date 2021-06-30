import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentsOffersComponent } from './treatments-offers.component';

describe('TreatmentsOffersComponent', () => {
  let component: TreatmentsOffersComponent;
  let fixture: ComponentFixture<TreatmentsOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatmentsOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentsOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
