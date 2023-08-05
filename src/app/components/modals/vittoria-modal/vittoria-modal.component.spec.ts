import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VittoriaModalComponent } from './vittoria-modal.component';

describe('VittoriaModalComponent', () => {
  let component: VittoriaModalComponent;
  let fixture: ComponentFixture<VittoriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VittoriaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VittoriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
