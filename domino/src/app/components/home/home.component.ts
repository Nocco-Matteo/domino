import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Tessera } from 'src/app/models/models';
import { PartitaService } from 'src/app/services/partita.service';
import { GrowlComponent } from '../growl/growl.component';
import { TessereComponent } from '../tessere/tessere.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private conta: number = 0;

  tessere: Tessera[] = [];

  tessereBot: Tessera[] = [];
  tessereBanco: Tessera[] = [];
  tessereUtente: Tessera[] = [];

  modale?: MatDialogRef<any>;

  @ViewChild('bancoComponent', { static: true })
  bancoComponent!: TessereComponent;

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
    setTimeout(() => {
      this.partitaService.turnoBot();
    }, 1000);
  }

  private initPartita() {
    const { tessereUtente, tessereBanco, tessereBot } =
      this.partitaService.initTessere();

    this.tessereUtente = tessereUtente;
    this.tessereBanco = tessereBanco;
    this.tessereBot = tessereBot;

    const condizioneFinePartita =
      this.tessereUtente.length == 0 || this.tessereBot.length == 0;
  }
}
