import { Component, OnInit, ChangeDetectorRef, Renderer2, ViewChild, ElementRef  } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErroreModale, IsTurnoBot, Tessera } from 'src/app/models/domino.model';
import { PartitaService } from 'src/app/services/partita.service';
import { VittoriaModalComponent } from '../../modals/vittoria-modal/vittoria-modal.component';
import { ErroreModalComponent } from '../../modals/errore-modal/errore-modal.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { InizioModalComponent } from '../../modals/inizio-modal/inizio-modal.component';



@Component({
  selector: 'app-domino',
  templateUrl: './domino.component.html',
  styleUrls: ['./domino.component.scss'],
  animations: [
    
  ]
})
export class DominoComponent implements OnInit {
  turnoBot: IsTurnoBot = { isTurnoBot: false };

  tessere: Tessera[] = [];

  tessereBot: Tessera[] = [];
  tessereBanco: Tessera[] = [];
  tessereUtente: Tessera[] = [];

  modale?: MatDialogRef<any>;
  immaginiCaselle: any;

  @ViewChild('board', {static:true})
  board:ElementRef;

  constructor(
    private readonly dialog: MatDialog,
    private readonly partitaService: PartitaService,
    private readonly renderer: Renderer2
  )
  {
    this.renderer.addClass(document.body, 'lock-scroll');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
   
  }

  ngOnInit(): void {
    this.immaginiCaselle = this.partitaService.generaImmagini();
    console.log(this.immaginiCaselle);
    
    this.initPartita();
    this.board.nativeElement.click();
  }

  casellaSbagliata(response: ErroreModale) {
    this.dialog.open(ErroreModalComponent, {
      data: { messaggio: response.messaggio, header: response.header },
    });
  }

  nuovoTurnoBot(checkUtentePassato?: boolean): void {
    this.partitaService.nuovoTurnoBot(this.turnoBot, checkUtentePassato)
  }

  pescaUnaTessera(): void {
    
    this.partitaService.pescaUnaTessera(false);
  }

  passaIlTurno() : void {
    
    this.nuovoTurnoBot(true)
  }

  private initPartita(): void {
    const { tessereUtente, tessereBanco, tessereBot, tessere } =
      this.partitaService.initTessere();
    
    this.tessereUtente = tessereUtente;
    this.tessereBanco = tessereBanco;
    this.tessereBot = tessereBot;
    this.tessere = tessere;
  }

  


}
