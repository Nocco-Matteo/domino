import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vittoria-modal',
  templateUrl: './vittoria-modal.component.html',
  styleUrls: ['./vittoria-modal.component.scss']
})
export class VittoriaModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
