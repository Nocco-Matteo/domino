import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeWhile } from 'rxjs';
import { Tessera } from '../models/models';
import { TessereComponent } from '../components/tessere/tessere.component';
import { transferArrayItem } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export class PartitaService {
  private tessere: Tessera[] = [];

  private tessereBot: Tessera[] = [];
  private tessereBanco: Tessera[] = [];
  private tessereUtente: Tessera[] = [];

  private _turno: number = 1;

  constructor() {}

  private popolaTessere(): void {
    for (let valore1 = 0; valore1 <= 6; valore1++) {
      for (let valore2 = valore1; valore2 <= 6; valore2++) {
        const carta: Tessera = {
          parteSinistra: valore1,
          parteDestra: valore2,
          invertita: !!(Math.floor(Math.random() * 100) % 2 == 0),
          uguali: !!(valore1 === valore2),
        };
        this.tessere.push(carta);
      }
    }
  }

  private estraiSetteTessereCasuali(): Tessera[] {
    const mazzoTemporaneo = [...this.tessere];

    const setteCarteCasuali: Tessera[] = [];
    const tessere = 7;

    for (let i = 0; i < tessere; i++) {
      const indiceCasuale = Math.floor(Math.random() * mazzoTemporaneo.length);

      const cartaCasuale = mazzoTemporaneo.splice(indiceCasuale, 1)[0];

      setteCarteCasuali.push(cartaCasuale);
    }

    return setteCarteCasuali;
  }

  initTessere() {
    this.popolaTessere();
    this.tessereUtente = this.estraiSetteTessereCasuali();
    this.tessereBot = this.estraiSetteTessereCasuali();

    return {
      tessereUtente: this.tessereUtente,
      tessereBanco: this.tessereBanco,
      tessereBot: this.tessereBot,
    };
  }

  turnoBot() {
    this._turno++;
    for (let x = 0; x < this.tessereBot.length; x++) {
      const { isInEstremoSinistro, isInEstremoDestro } =
        this.cercaCorrispondenza(this.tessereBot[x], this.tessereBanco);

      //se è uguale sia a destra che sinistra
      if (isInEstremoDestro && isInEstremoSinistro) {
        //TODO: scelta se a destra o sinistra
        return;
      }

      if (isInEstremoDestro) {
        transferArrayItem(
          this.tessereBot, //tessere dell'utente
          this.tessereBanco, //tessere del banco
          x, //indice nelle tessere dell'utente
          this.tessere.length //indice in cui metterlo
        );
        ;

        return;
      }

      if (isInEstremoSinistro) {
        transferArrayItem(
          this.tessereBot, //tessere dell'utente
          this.tessereBanco, //tessere del banco
          x, //indice nelle tessere dell'utente
          0 //indice in cui metterlo
        );
        ;

        return;
      }
    }

    ;
  }

  get turno() {
    return this._turno;
  }

  cercaCorrispondenza(cartaTrascinata: Tessera, tessere: Tessera[]) {
    const estremoSinistro = tessere[0].parteSinistra;
    const estremoDestro = tessere[tessere.length - 1].parteDestra;

    let isInEstremoSinistro = false;
    let isInEstremoDestro = false;

    switch (estremoSinistro) {
      case cartaTrascinata.parteSinistra:
        isInEstremoSinistro = true;

        //inversione tessera
        cartaTrascinata.parteSinistra = cartaTrascinata.parteDestra;
        cartaTrascinata.parteDestra = estremoSinistro;
        cartaTrascinata.invertita = !cartaTrascinata.invertita;
        break;
      case cartaTrascinata.parteDestra:
        isInEstremoSinistro = true;
        break;
    }
    switch (estremoDestro) {
      case cartaTrascinata.parteSinistra:
        isInEstremoDestro = true;
        break;

      case cartaTrascinata.parteDestra:
        isInEstremoDestro = true;

        //inversione tessera
        cartaTrascinata.parteDestra = cartaTrascinata.parteSinistra;
        cartaTrascinata.parteSinistra = estremoDestro;
        cartaTrascinata.invertita = !cartaTrascinata.invertita;
        break;
    }

    return { isInEstremoSinistro, isInEstremoDestro };
  }
}
