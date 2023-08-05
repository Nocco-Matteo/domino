import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Tessera } from 'src/app/models/models';
import { PartitaService } from 'src/app/services/partita.service';
import { GrowlComponent } from '../modals/growl/growl.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isTurnoBot: boolean = false;

  tessere: Tessera[] = [];

  tessereBot: Tessera[] = [];
  tessereBanco: Tessera[] = [];
  tessereUtente: Tessera[] = [];

  modale?: MatDialogRef<any>;
  immaginiCaselle: any;

  constructor(
    private readonly dialog: MatDialog,
    private readonly partitaService: PartitaService
  ) {this.immaginiCaselle = this.partitaService.generaImmagini();}

  ngOnInit(): void {
    this.initPartita();
  }

  mostraGrowl(messaggio: string) {
    this.dialog.open(GrowlComponent, {
      data: { messaggio: messaggio }, // Passa il testo alla dialog utilizzando l'opzione 'data'
    });
  }

  nuovoTurnoBot(): void {
    this.isTurnoBot = true;
    setTimeout(() => {
      this.partitaService.turnoBot();
      this.isTurnoBot = false;
    }, 1500);
  }

  pescaUnaTessera(): void {
    this.partitaService.pescaUnaTessera(false);
  }

  private initPartita() {
    const { tessereUtente, tessereBanco, tessereBot, tessere } =
      this.partitaService.initTessere();

    this.tessereUtente = tessereUtente;
    this.tessereBanco = tessereBanco;
    this.tessereBot = tessereBot;
    this.tessere = tessere;
  }
}
