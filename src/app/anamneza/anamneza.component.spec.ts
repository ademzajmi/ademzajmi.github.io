import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnamnezaComponent } from './anamneza.component';

describe('AnamnezaComponent', () => {
  let component: AnamnezaComponent;
  let fixture: ComponentFixture<AnamnezaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnamnezaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnamnezaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
