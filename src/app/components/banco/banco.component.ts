import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { takeWhile, tap } from 'rxjs';
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
export class BancoComponent implements OnInit, OnDestroy {
  readonly parti = PARTI;
  private unsubscribe: boolean = true;

  isShownLeftHint: boolean = false;
  isShownRightHint: boolean = false;

  @Input() tessere!: Tessera[];
  @Input() immaginiCaselle!: Immagine[];

  @Output() nuovoTurnoBot: EventEmitter<void> = new EventEmitter<void>();
  @Output() emettiGrowl: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('CardWrapper', { static: true }) cardWrapper!: ElementRef;

  constructor(private readonly partitaService: PartitaService) { }
  ngOnDestroy(): void {
    this.unsubscribe = false;
  }

  ngOnInit(): void {
    this.init()
  }

  private init(): void {
    this.partitaService.hintsObservable$.pipe(
      takeWhile(() => this.unsubscribe),
      tap((res: boolean[]) => {
        this.isShownLeftHint = res[0]
        this.isShownRightHint = res[1]
      }))
      .subscribe()
  }
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
      case PARTI.centraleSuperiore:
        found = !!(this.tessere.find((card) => card.isLimitSinistro.secondo)?.uguali)
        break;
    }
    return found;
  }
  isFirstCardVertical(parte: PARTI): boolean {
    let res = false
    switch (parte) {
      case PARTI.centraleSuperiore:
        res = !!this.prendiParteArray(parte).reverse()[0]?.uguali

        break;
      case PARTI.centraleInferiore:
        res = !!this.prendiParteArray(parte).reverse()[this.prendiParteArray(parte).length - 1]?.uguali
        break;
      default:
        break;
    }
    return res;
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
      this.partitaService.gestisciLimite(PARTI.sinistra)

      transferArrayItem(
        tessereUtente, //tessere da cui prendere la tessera
        this.tessere, //tessere in cui mettere la tessera
        tesseraTrascinataIndex, //indice della tessera
        0 //indice in cui mettere la tessera
      );

      this.nuovoTurnoBot.emit();
      return;
    }

    //se è uguale a destra
    if (isInEstremoDestro) {
      this.partitaService.gestisciLimite(PARTI.destra)

      transferArrayItem(
        tessereUtente,
        this.tessere,
        tesseraTrascinataIndex,
        this.tessere.length
      );

      this.nuovoTurnoBot.emit();
      return;
    }

    //non uguale
    console.log("errore: ", this.tessere, "---", cartaTrascinata, "---", isInEstremoSinistro, "---", isInEstremoDestro);

    this.emettiGrowl.emit('La tessera non può essere collegata');
  }
}
