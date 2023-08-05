import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AGGIUNTA_ANIMATION,
  USCITA_ANIMATION,
} from 'src/app/animations/animation';
import { Tessera } from 'src/app/models/models';
import { PartitaService } from 'src/app/services/partita.service';

@Component({
  selector: 'app-tessere',
  templateUrl: './tessere.component.html',
  styleUrls: ['./tessere.component.scss'],
  animations: [AGGIUNTA_ANIMATION, USCITA_ANIMATION],
})
export class TessereComponent implements OnInit {
  @Input() immaginiCaselle!: any[];
  @Input() isDragDisabled: boolean = false;
  @Input() isBot: boolean = false;
  @Input() isUtilities: boolean = false;
  @Input() isBanco: boolean = false;
  @Input() tessere!: Tessera[];

  @Output() nuovoTurnoBot: EventEmitter<void> = new EventEmitter<void>();
  @Output() emettiGrowl: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('CardWrapper', { static: true }) cardWrapper!: ElementRef;

  constructor(private readonly partitaService: PartitaService) {
    
  }
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

    const isRilasciatoADestra = this.partitaService.isRilasciatoADestra(
      event,
      this.cardWrapper
    );
    
    let { isInEstremoSinistro, isInEstremoDestro } =
      this.partitaService.cercaCorrispondenza(
        cartaTrascinata,
        this.tessere,
        isRilasciatoADestra
      );

    //se è uguale sia a destra che sinistra
    if (isInEstremoDestro && isInEstremoSinistro) {
      isRilasciatoADestra ? (isInEstremoSinistro = false) : null;
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

    //non uguale
    this.emettiGrowl.emit('Casella non corrispondente');
  }

  private init(): void {}
}
