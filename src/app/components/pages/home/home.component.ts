import { Component, OnInit, ChangeDetectorRef, Renderer2  } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Tessera } from 'src/app/models/models';
import { PartitaService } from 'src/app/services/partita.service';
import { VittoriaModalComponent } from '../../modals/vittoria-modal/vittoria-modal.component';
import { ErroreModalComponent } from '../../modals/errore-modal/errore-modal.component';
import { trigger, state, style, animate, transition } from '@angular/animations';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('zoom', [
      state('zoomOut', style({
        transform: 'scale(1)',
      })),
      state('zoomIn', style({
        transform: 'scale(1.3)',  // Aumentato da 1.1 a 1.3
      })),
      transition('zoomOut <=> zoomIn', [
        animate('1s ease-in-out')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  turnoBot: {isTurnoBot:boolean} = {isTurnoBot:false};

  tessere: Tessera[] = [];

  tessereBot: Tessera[] = [];
  tessereBanco: Tessera[] = [];
  tessereUtente: Tessera[] = [];

  modale?: MatDialogRef<any>;
  immaginiCaselle: any;

  showGame = false;
  zoomState = 'zoomOut';



  constructor(
    private readonly dialog: MatDialog,
    private readonly partitaService: PartitaService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  )
  {
    this.renderer.addClass(document.body, 'lock-scroll');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

  }

  ngOnInit(): void {

    setInterval(() => {
      this.zoomState = (this.zoomState === 'zoomOut' ? 'zoomIn' : 'zoomOut');
    }, 1000);

    this.immaginiCaselle = this.partitaService.generaImmagini();
    console.log(this.immaginiCaselle);
    this.initPartita();

  }

  casellaSbagliata(messaggio: string) {
    this.dialog.open(ErroreModalComponent, {
      data: { messaggio: messaggio },
    });
  }

  nuovoTurnoBot(): void {
    this.partitaService.nuovoTurnoBot(this.turnoBot)
  }

  pescaUnaTessera(): void {
    this.partitaService.pescaUnaTessera(false);
  }

  private initPartita(): void {
    const { tessereUtente, tessereBanco, tessereBot, tessere } =
      this.partitaService.initTessere();

    this.tessereUtente = tessereUtente;
    this.tessereBanco = tessereBanco;
    this.tessereBot = tessereBot;
    this.tessere = tessere;
  }

  goFullscreen() {
    const elem: any = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      this.showGame = true;
      this.cdr.detectChanges();
      window.dispatchEvent(new Event('resize'));
    } else if (elem['mozRequestFullScreen']) {  // Firefox
      elem['mozRequestFullScreen']();
      this.showGame = true;
      this.cdr.detectChanges();
      window.dispatchEvent(new Event('resize'));
    } else if (elem['webkitRequestFullscreen']) {  // Chrome, Safari and Opera
      elem['webkitRequestFullscreen']();
      this.showGame = true;
      this.cdr.detectChanges();
      window.dispatchEvent(new Event('resize'));
    } else if (elem['msRequestFullscreen']) {  // IE/Edge
      elem['msRequestFullscreen']();
      this.showGame = true;
      this.cdr.detectChanges();
      window.dispatchEvent(new Event('resize'));
    }
  }


}
