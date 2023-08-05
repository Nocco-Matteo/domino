import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeWhile } from 'rxjs';
import { Tessera } from '../models/models';
import { TessereComponent } from '../components/tessere/tessere.component';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

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
    const setteCarteCasuali: Tessera[] = [];
    const numeroTessere = 7;

    for (let i = 0; i < numeroTessere; i++) {
      const indiceCasuale = Math.floor(Math.random() * this.tessere.length);

      const cartaCasuale = this.tessere.splice(indiceCasuale, 1)[0];

      setteCarteCasuali.push(cartaCasuale);
    }

    return setteCarteCasuali;
  }

  controllaVittoria() : boolean{
    if(this.tessereUtente.length === 0){
      alert("Hai vinto!")
      return true;
    }

    if(this.tessereBot.length === 0){
      alert("Ha vinto il bot!")
      return true;
    }

    return false
  }

  generaImmagini(): any[] {
    const result = [];
    for (let i = 0; i < 7; i++) {
      result.push({
        immagine: `https://picsum.photos/200?random=${Math.random()}`,
      });
    }
    return result;
  }
  
  initTessere() {
    this.popolaTessere();
    this.tessereUtente = this.estraiSetteTessereCasuali();
    this.tessereBot = this.estraiSetteTessereCasuali();

    return {
      tessereUtente: this.tessereUtente,
      tessereBanco: this.tessereBanco,
      tessereBot: this.tessereBot,
      tessere: this.tessere,
    };
  }

  turnoBot() {
    this._turno++;

    for (let x = 0; x < this.tessereBot.length; x++) {
      const { isInEstremoSinistro, isInEstremoDestro } =
        this.cercaCorrispondenza(this.tessereBot[x], this.tessereBanco);
      //se è uguale sia a destra che sinistra, lo mette a destra
      
      if (isInEstremoDestro) {
        transferArrayItem(
          this.tessereBot, //tessere dell'utente
          this.tessereBanco, //tessere del banco
          x, //indice nelle tessere dell'utente
          this.tessere.length //indice in cui metterlo
        );
        return;
      }

      if (isInEstremoSinistro) {
        transferArrayItem(
          this.tessereBot, //tessere dell'utente
          this.tessereBanco, //tessere del banco
          x, //indice nelle tessere dell'utente
          0 //indice in cui metterlo
        );
        return;
      }
    }

    this.pescaUnaTessera(true);
    if (this.tessere.length > 0) {
      this.turnoBot();
    }

    //tessere finite-->passaggio turno
  }

  get turno() {
    return this._turno;
  }

  cercaCorrispondenza(cartaTrascinata: Tessera, tessere: Tessera[], isRilasciatoADestra? : boolean) {
    const estremoSinistro = tessere[0].parteSinistra;
    const estremoDestro = tessere[tessere.length - 1].parteDestra;

    let isInEstremoSinistro = false;
    let isInEstremoDestro = false;

    switch (estremoSinistro) {
      case cartaTrascinata.parteSinistra:
        isInEstremoSinistro = true;

        this.invertiTessera(cartaTrascinata);
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

        if(isRilasciatoADestra===false){
          break
        }
        this.invertiTessera(cartaTrascinata);
        break;
    }

    return { isInEstremoSinistro, isInEstremoDestro };
  }

  invertiTessera(tessera: Tessera): void {
    const tesseraTmp = { ...tessera };
    tessera.parteDestra = tesseraTmp.parteSinistra;
    tessera.parteSinistra = tesseraTmp.parteDestra;
    tessera.invertita = !tessera.invertita;
  }

  isRilasciatoADestra(event: CdkDragDrop<any>,elementRef : ElementRef) : boolean {
    const oggettoRilasciatoX = event.dropPoint.x -180;
    const centroContenitoreX = elementRef.nativeElement.clientWidth / 2;
    return oggettoRilasciatoX > centroContenitoreX;
  }

  pescaUnaTessera(isBot: boolean): void {
    if (isBot) {
      transferArrayItem(
        this.tessere, //tessere dell'utente
        this.tessereBot, //tessere del banco
        0, //indice nelle tessere dell'utente
        this.tessereBot.length //indice in cui metterlo
      );
      return;
    }

    transferArrayItem(
      this.tessere, //tessere dell'utente
      this.tessereUtente, //tessere del banco
      0, //indice nelle tessere dell'utente
      this.tessereUtente.length //indice in cui metterlo
    );
  }
}
