import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LANDSCAPE_ANIMATION } from 'src/app/animations/animation';

@Component({
  selector: 'app-landscape-modal',
  templateUrl: './landscape-modal.component.html',
  styleUrls: ['./landscape-modal.component.scss'],
  animations: [LANDSCAPE_ANIMATION]
})
export class LandscapeModalComponent implements OnInit {
  giraDispositivo: string = "fermo";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

  }
  ngOnInit(): void {
    this.init(900)
  }


  init(time: number): void {
    setTimeout(() => {
      this.giraDispositivo = "gira"
      // this.giraDispositivo = "fermo"
    }, time);
    setTimeout(() => {
      this.giraDispositivo = "fermo"
    }, time + 1500);
    setTimeout(() => {
      this.giraDispositivo = "gira"
      // this.giraDispositivo = "fermo"
    }, time + 2500);
  }
}
