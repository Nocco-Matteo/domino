import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-errore-modal',
  templateUrl: './errore-modal.component.html',
  styleUrls: ['./errore-modal.component.scss']
})
export class ErroreModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}

  closeModal(): void{
    
  }
}
