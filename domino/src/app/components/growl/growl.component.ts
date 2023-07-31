import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GROWL_ANIMATION } from 'src/app/animations/animation';

@Component({
  selector: 'app-growl',
  templateUrl: './growl.component.html',
  styleUrls: ['./growl.component.scss'],
  animations: [GROWL_ANIMATION],
})
export class GrowlComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
