import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Tessera } from 'src/app/models/models';
import { PartitaService } from 'src/app/services/partita.service';
import { GrowlComponent } from '../growl/growl.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private conta: number = 0;

  isTurnoBot: boolean = false;

  tessere: Tessera[] = [];

  tessereBot: Tessera[] = [];
  tessereBanco: Tessera[] = [];
  tessereUtente: Tessera[] = [];

  modale?: MatDialogRef<any>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly partitaService: PartitaService
  ) {}

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

  private initPartita() {
    const { tessereUtente, tessereBanco, tessereBot , tessere} =
      this.partitaService.initTessere();

    this.tessereUtente = tessereUtente;
    this.tessereBanco = tessereBanco;
    this.tessereBot = tessereBot;
    this.tessere = tessere

    const condizioneFinePartita =
      this.tessereUtente.length == 0 || this.tessereBot.length == 0;
  }
}
