import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TessereComponent } from './tessere.component';

describe('TessereComponent', () => {
  let component: TessereComponent;
  let fixture: ComponentFixture<TessereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TessereComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TessereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
