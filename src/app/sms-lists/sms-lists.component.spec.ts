import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsListsComponent } from './sms-lists.component';

describe('SmsListsComponent', () => {
  let component: SmsListsComponent;
  let fixture: ComponentFixture<SmsListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
