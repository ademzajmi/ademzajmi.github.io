import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentOffersListComponent } from './treatment-offers-list.component';

describe('TreatmentOffersListComponent', () => {
  let component: TreatmentOffersListComponent;
  let fixture: ComponentFixture<TreatmentOffersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatmentOffersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentOffersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
