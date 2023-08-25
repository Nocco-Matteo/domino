import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Tessera } from 'src/app/models/models';
import { PartitaService } from 'src/app/services/partita.service';
import { VittoriaModalComponent } from '../../modals/vittoria-modal/vittoria-modal.component';
import { ErroreModalComponent } from '../../modals/errore-modal/errore-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  turnoBot: {isTurnoBot:boolean} = {isTurnoBot:false};

  tessere: Tessera[] = [];

  tessereBot: Tessera[] = [];
  tessereBanco: Tessera[] = [];
  tessereUtente: Tessera[] = [];

  modale?: MatDialogRef<any>;
  immaginiCaselle: any;

  constructor(
    private readonly dialog: MatDialog,
    private readonly partitaService: PartitaService
  ) {
    this.immaginiCaselle = this.partitaService.generaImmagini();
  }

  ngOnInit(): void {
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
}
