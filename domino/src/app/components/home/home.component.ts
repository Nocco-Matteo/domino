import {
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Tessera } from 'src/app/models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private conta: number = 0;

  tessere: Tessera[] = [];

  tessereUtente: Tessera[] = [];
  banco: Tessera[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.init();
  }

  cartaSpostata(event: any, carta: any) {
    const spostataElement = event.source.element.nativeElement;
    const spostataRect = spostataElement.getBoundingClientRect();
    const posizioneSpostata = {
      x: spostataRect.left,
      y: spostataRect.top,
    };
  }
  private init(): void {
    this.popolaTessere();
    this.tessereUtente = this.estraiSetteCarteCasuali();
  }

  private popolaTessere(): void {
    for (let valore1 = 0; valore1 <= 6; valore1++) {
      for (let valore2 = valore1; valore2 <= 6; valore2++) {
        const carta: Tessera = {
          parteSinistra: valore1,
          parteDestra: valore2,
          invertita: !!(Math.floor(Math.random() * 100) % 2 == 0),
          uguali: !!(valore1 === valore2),
        };
        this.tessere.push(carta);
      }
    }
    debugger;
  }

  private estraiSetteCarteCasuali(): Tessera[] {
    const mazzoTemporaneo = [...this.tessere];

    const setteCarteCasuali: Tessera[] = [];

    for (let i = 0; i < 8; i++) {
      const indiceCasuale = Math.floor(Math.random() * mazzoTemporaneo.length);

      const cartaCasuale = mazzoTemporaneo.splice(indiceCasuale, 1)[0];
      if (i == 7) {
        //prendi una tessera iniziale
        this.banco.push(cartaCasuale);
      } else {
        setteCarteCasuali.push(cartaCasuale);
      }
    }

    return setteCarteCasuali;
  }
}
