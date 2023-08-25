import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AGGIUNTA_ANIMATION } from 'src/app/animations/animation';
import { PARTI } from 'src/app/configs/config';
import { Immagine, Tessera } from 'src/app/models/models';
import { PartitaService } from 'src/app/services/partita.service';

@Component({
  selector: 'app-banco',
  templateUrl: './banco.component.html',
  styleUrls: ['./banco.component.scss'],
  animations: [AGGIUNTA_ANIMATION]
})
export class BancoComponent {
  readonly parti = PARTI;

  @Input() tessere!: Tessera[];
  @Input() immaginiCaselle!: Immagine[];

  @Output() nuovoTurnoBot: EventEmitter<void> = new EventEmitter<void>();
  @Output() emettiGrowl: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('CardWrapper', { static: true }) cardWrapper!: ElementRef;

  constructor(private readonly partitaService: PartitaService) { }

  prendiParteArray(parte: PARTI): Tessera[] {
    return this.partitaService.prendiParteArray(parte)
  }

  isLastCardVertical(parte: PARTI): boolean {
    let found = false;
    switch (parte) {
      case PARTI.sinistra:
        found = !!(this.tessere.find((card) => card.isLimitSinistro.primo)?.uguali)
        break;
      case PARTI.destra:
        found = !!(this.tessere.find((card) => card.isLimitDestro.primo)?.uguali)
        break;
    }
    return found;
  }
  cartaRilasciata(event: CdkDragDrop<any>): void {
    const tessereUtente = event.previousContainer.data;

    const tesseraTrascinataIndex = event.previousIndex;
    const cartaTrascinata: Tessera = event.item.data;

    //primo turno
    if (this.tessere.length === 0) {
      transferArrayItem(
        tessereUtente,
        this.tessere,
        tesseraTrascinataIndex,
        0
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
        tessereUtente, //tessere da cui prendere la tessera
        this.tessere, //tessere in cui mettere la tessera
        tesseraTrascinataIndex, //indice della tessera
        0 //indice in cui mettere la tessera
      );

      this.partitaService.gestisciLimite("sinistra")

      this.nuovoTurnoBot.emit();
      return;
    }

    //se è uguale a destra
    if (isInEstremoDestro) {
      transferArrayItem(
        tessereUtente,
        this.tessere,
        tesseraTrascinataIndex,
        this.tessere.length
      );

      this.partitaService.gestisciLimite("destra")

      this.nuovoTurnoBot.emit();
      return;
    }

    //non uguale
    console.log("errore: ", this.tessere, "---", cartaTrascinata, "---", isInEstremoSinistro, "---", isInEstremoDestro);

    this.emettiGrowl.emit('La tessera non può essere collegata');
  }
}
