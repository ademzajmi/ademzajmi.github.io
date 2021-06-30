import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationReportsComponent } from './operation-reports.component';

describe('OperationReportsComponent', () => {
  let component: OperationReportsComponent;
  let fixture: ComponentFixture<OperationReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
