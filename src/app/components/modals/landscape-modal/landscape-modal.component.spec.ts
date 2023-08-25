import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandscapeModalComponent } from './landscape-modal.component';

describe('LandscapeModalComponent', () => {
  let component: LandscapeModalComponent;
  let fixture: ComponentFixture<LandscapeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandscapeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandscapeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
