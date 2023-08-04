import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tessera } from 'src/app/models/models';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.scss']
})
export class UtilitiesComponent {

  @Input() tessere!: Tessera[];
  @Input() isTurnoBot : boolean = false;
  @Output() pesca : EventEmitter<void> = new EventEmitter<void>();

  constructor(){}

  pescaUnaTessera():void{
    this.pesca.emit()
  }
}
