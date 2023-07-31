import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { trigger, transition, style, animate } from '@angular/animations';
import { Tessera } from 'src/app/models/models';
import { AGGIUNTA_ANIMATION } from 'src/app/animations/animation';
import { PartitaService } from 'src/app/services/partita.service';

@Component({
  selector: 'app-tessere',
  templateUrl: './tessere.component.html',
  styleUrls: ['./tessere.component.scss'],
  animations: [AGGIUNTA_ANIMATION],
})
export class TessereComponent implements OnInit {
  @Input() isDragDisabled : boolean = false;
  @Input() isBot: boolean = false;
  @Input() isBanco: boolean = false;
  @Input() tessere!: Tessera[];

  @Output() nuovoTurnoBot: EventEmitter<void> = new EventEmitter<void>();
  @Output() emettiGrowl: EventEmitter<string> = new EventEmitter<string>();

  constructor(private readonly partitaService: PartitaService) {}
  ngOnInit(): void {
    this.init();
  }

  cartaRilasciata(event: CdkDragDrop<any>): void {
    const tessereUtente = event.previousContainer.data;

    const cartaTrascinataIndex = event.previousIndex;
    const cartaTrascinata: Tessera = event.item.data;

    //primo turno
    if (this.tessere.length === 0) {
      transferArrayItem(
        tessereUtente, //tessere dell'utente
        this.tessere, //tessere del banco
        cartaTrascinataIndex, //indice nelle tessere dell'utente
        0 //indice in cui metterlo
      );
      this.nuovoTurnoBot.emit();
      return;
    }

    const { isInEstremoSinistro, isInEstremoDestro } = this.partitaService.cercaCorrispondenza(
      cartaTrascinata,
      this.tessere
    );

    debugger
    //se è uguale sia a destra che sinistra
    if (isInEstremoDestro && isInEstremoSinistro) {
      //TODO: scelta se a destra o sinistra
      return;
    }
    //se è uguale a destra
    if (isInEstremoDestro) {
      transferArrayItem(
        tessereUtente, //tessere dell'utente
        this.tessere, //tessere del banco
        cartaTrascinataIndex, //indice nelle tessere dell'utente
        this.tessere.length //indice in cui metterlo
      );
      this.nuovoTurnoBot.emit();
      return;
    }
    //se è uguale a sinistra
    if (isInEstremoSinistro) {
      transferArrayItem(
        tessereUtente, //tessere dell'utente
        this.tessere, //tessere del banco
        cartaTrascinataIndex, //indice nelle tessere dell'utente
        0 //indice in cui metterlo
      );
      this.nuovoTurnoBot.emit();
      return;
    }

    //non uguale
    this.emettiGrowl.emit('Casella non corrispondente');
  }

  private init(): void {}
}
