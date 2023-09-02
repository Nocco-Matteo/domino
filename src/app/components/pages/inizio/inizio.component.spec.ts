import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InizioComponent } from './inizio.component';

describe('InizioComponent', () => {
  let component: InizioComponent;
  let fixture: ComponentFixture<InizioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InizioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
