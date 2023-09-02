import { Component, OnInit, ChangeDetectorRef, Renderer2, ViewChild, ElementRef  } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IsTurnoBot, Tessera } from 'src/app/models/models';
import { PartitaService } from 'src/app/services/partita.service';
import { VittoriaModalComponent } from '../../modals/vittoria-modal/vittoria-modal.component';
import { ErroreModalComponent } from '../../modals/errore-modal/errore-modal.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { InizioModalComponent } from '../../modals/inizio-modal/inizio-modal.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    
  ]
})
export class HomeComponent implements OnInit {
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

  passaIlTurno() : void {
    
    this.nuovoTurnoBot()
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
