import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErroreModalComponent } from './errore-modal.component';

describe('ErroreModalComponent', () => {
  let component: ErroreModalComponent;
  let fixture: ComponentFixture<ErroreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErroreModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErroreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
