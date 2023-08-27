import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { PESCA_PASSA_ANIMATION } from 'src/app/animations/animation';
import { Tessera } from 'src/app/models/models';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.scss'],
  animations: [PESCA_PASSA_ANIMATION]
})
export class UtilitiesComponent {
  primaPescata: boolean = true;
  testoBottone: string = 'Pesca'

  @Input() tessere!: Tessera[];
  @Input() isTurnoBot: boolean = false;
  @Output() pesca: EventEmitter<void> = new EventEmitter<void>();
  @Output() passa: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes['isTurnoBot']?.previousValue) {
      debugger
      if (this.tessere.length === 0) {
        debugger
        this.primaPescata = false
        this.testoBottone = 'Passa'
      }
    }
  }

  pescaUnaTessera(): void {
    this.pesca.emit()
    this.primaPescata = false;
    this.testoBottone = 'Passa'
  }

  passaIlTurno(): void {
    this.passa.emit();
    this.primaPescata = true
    this.testoBottone = 'Pesca'
  }

  tessereFinite(): boolean {
    return this.tessere.length === 0
  }
}
