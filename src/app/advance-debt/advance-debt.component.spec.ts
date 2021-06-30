import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceDebtComponent } from './advance-debt.component';

describe('AdvanceDebtComponent', () => {
  let component: AdvanceDebtComponent;
  let fixture: ComponentFixture<AdvanceDebtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceDebtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
