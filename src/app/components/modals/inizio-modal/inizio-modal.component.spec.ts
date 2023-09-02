import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InizioModalComponent } from './inizio-modal.component';

describe('InizioModalComponent', () => {
  let component: InizioModalComponent;
  let fixture: ComponentFixture<InizioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InizioModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InizioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
