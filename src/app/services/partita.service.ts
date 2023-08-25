import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { ElementRef, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VittoriaModalComponent } from '../components/modals/vittoria-modal/vittoria-modal.component';
import { PARTI } from '../configs/config';
import { Immagine, Tessera } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class PartitaService {
  private tessere: Tessera[] = [];

  private tessereBot: Tessera[] = [];
  private tessereBanco: Tessera[] = [];
  private tessereUtente: Tessera[] = [];

  private _turno: number = 1;

  constructor(
    private readonly dialog: MatDialog,
  ) { }

  private popolaTessere(): void {
    let num = 0    
    for (let valore1 = 0; valore1 < 6; valore1++) {
      for (let valore2 = valore1; valore2 < 6; valore2++) {
        num++
        const carta: Tessera = {
          parteSinistra: valore1,
          parteDestra: valore2,
          invertita: !!(Math.floor(Math.random() * 100) % 2 == 0),
          uguali: !!(valore1 === valore2),
          isLimitSinistro: {
            primo: false,
            secondo: false
          },
          isLimitDestro: {
            primo: false,
            secondo: false
          },
        };
        this.tessere.push(carta);
      }
    }
    console.log(num);
    
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

  private gestisciSecondoBlocco(parte: string): number {
    const parteInvertita = parte === "sinistra" ? "destra" : "sinistra"
    if (!this.controllaVerticale(parteInvertita, this.tessereBanco)) {
      console.log("nessuna corrispondenza", parte, "--", this.tessereBanco);
      return 0;
    }
    let tesserePrima = 0;

    switch (parte) {
      case PARTI.sinistra:
        for (const tessera of this.tessereBanco) {
          tesserePrima++;
          if (tessera.isLimitSinistro.secondo) {
            tesserePrima = 0;
          }
          if (tessera.isLimitSinistro.primo) {
            break;
          }
        }
        break;
      case PARTI.destra:
        for (const tessera of this.tessere) {
          tesserePrima++;

          if (tessera.isLimitDestro.primo) {
            tesserePrima = 0
          }
          if (tessera.isLimitSinistro.secondo) {
            break;
          }
        }
        break;
      case PARTI.centraleSuperiore:
        for (const tessera of this.tessereBanco) {
          tesserePrima++;
          if (tessera.isLimitSinistro.secondo) {
            tesserePrima = 0;
          }
          if (tessera.isLimitSinistro.primo) {
            break;
          }
        }
        break;
      case PARTI.centraleinferiore:
        for (const tessera of this.tessere) {
          tesserePrima++;
          if (tessera.isLimitSinistro.secondo) {
            tesserePrima = 0;
          }
        }
        break;
    }
    return tesserePrima;
  }

  private gestisciTerzoBlocco(parte: string): number {
    if (!this.controllaOrizzontale(parte, this.tessereBanco)) {
      console.log("nessuna corrispondenza Oriz", parte, "--", this.tessereBanco);
      return 0;
    }
    let tesserePrima = 0;

    switch (parte) {
      case "sinistra":
        for (const tessera of this.tessereBanco) {
          tesserePrima++;
          if (tessera.isLimitDestro.secondo) {
            break;
          }
        }
        break;
      case "destra":
        let limiteTrovato = false;

        for (const tessera of this.tessere) {
          if (tessera.isLimitDestro.secondo) {
            limiteTrovato = true;
          }
          if (limiteTrovato) {
            tesserePrima++;
          }
        }
        break;
    }
    return tesserePrima;
  }

  private finePartita(messaggio: string): void {
    this.dialog.open(VittoriaModalComponent, { data: { messaggio: messaggio } });
  }

  nuovoTurnoBot(turnoBot: { isTurnoBot: boolean }): void {
    turnoBot.isTurnoBot = true;
    if (this.controllaVittoria()) {
      this.finePartita("Hai vinto!");
      return;
    }
    setTimeout(() => {
      this.turnoBot();
      if (this.controllaVittoria()) {
        this.finePartita("Hai perso!");
        return;
      }
      turnoBot.isTurnoBot = false;
    }, 1500);
  }

  controllaVerticale(parte: string, tessere: Tessera[]): boolean {
    let res = false;
    switch (parte) {
      case PARTI.sinistra:
        res = !!(tessere.find((tessera) => tessera.isLimitSinistro.primo))
        break;
      case PARTI.destra:
        res = !!(tessere.find((tessera) => tessera.isLimitDestro.primo))
        break;
      case PARTI.centraleSuperiore:
        res = !!(tessere.find((tessera) => tessera.isLimitSinistro.secondo))
        break;
      case PARTI.centraleinferiore:
        res = !!(tessere.find((tessera) => tessera.isLimitDestro.secondo))
        break;
    }
    return res;
  }

  controllaOrizzontale(parte: string, tessere: Tessera[]): boolean {
    return parte === "sinistra" ?
      !!(tessere.find((tessera) => tessera.isLimitSinistro.secondo)) :
      !!(tessere.find((tessera) => tessera.isLimitDestro.secondo));
  }

  gestisciLimite(parte: string): void {
    const limiteCentrale = 9;
    const limiteVerticali = 3;

    const tesserePrima = this.gestisciSecondoBlocco(parte);
    const tesserePrimaSinistra = this.prendiParteArray(PARTI.sinistra).length;
    const tesserePrimaDestra = this.prendiParteArray(PARTI.destra).length;

    switch (parte) {
      case "sinistra":
        if (this.tessereBanco.length - tesserePrima === limiteCentrale) {
          this.tessereBanco[1].isLimitSinistro.primo = true
          this.tessereBanco[limiteCentrale - 1].isLimitDestro.primo = true
        }
        break;
      case "destra":
        if (this.tessereBanco.length - tesserePrima === limiteCentrale) {
          this.tessereBanco[0].isLimitSinistro.primo = true
          this.tessereBanco[limiteCentrale - 2].isLimitDestro.primo = true
        }
        break;
    }
  }
  controllaVittoria(): boolean {
    return this.tessereBot.length === 0 || this.tessereUtente.length === 0
  }

  generaImmagini(): Immagine[] {
    const result = [];
    for (let i = 0; i < 8; i++) {
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

  prendiParteArray(parte: PARTI): Tessera[] {
    if (!this.controllaVerticale(parte, this.tessereBanco)
      && parte !== PARTI.centro) {
      return []
    }

    const parteArray = [];
    switch (parte) {
      case PARTI.sinistra:
        for (const tessera of this.tessereBanco) {

          if (tessera.isLimitSinistro.primo) {
            break;
          }
          parteArray.push(tessera);

        }

        console.log("parte di sinistra: ", parteArray);

        break;
      case PARTI.destra:
        let limiteTrovato = false;

        for (const tessera of this.tessereBanco) {
          if (limiteTrovato) {
            parteArray.push(tessera);
          }
          if (tessera.isLimitDestro.primo) {
            limiteTrovato = true;
          }
        }
        break;

      case PARTI.centro:
        let limiteSinistroTrovato = false;
        let limiteDestroTrovato = false;
        if (this.controllaVerticale(PARTI.sinistra, this.tessereBanco)
          && this.controllaVerticale(PARTI.destra, this.tessereBanco)) {
          for (const tessera of this.tessereBanco) {
            if (tessera.isLimitSinistro.primo) {
              limiteSinistroTrovato = true;
            }
            if (tessera.isLimitDestro.primo) {
              parteArray.push(tessera);
              limiteDestroTrovato = true;
            }
            if (limiteSinistroTrovato && !limiteDestroTrovato) {
              parteArray.push(tessera);
            }
          }
        }
        else if (!this.controllaVerticale(PARTI.sinistra, this.tessereBanco)
          && !this.controllaVerticale(PARTI.destra, this.tessereBanco)) {
          for (const tessera of this.tessereBanco) {
            parteArray.push(tessera);
          }
        }
        break;
      case PARTI.centraleSuperiore:
        for (const tessera of this.tessereBanco) {
          if (tessera.isLimitSinistro.secondo) {
            break;
          }
          parteArray.push(tessera);
        }
        break;
      case PARTI.centraleinferiore:
        limiteTrovato = false;

        for (const tessera of this.tessereBanco) {
          if (limiteTrovato) {
            parteArray.push(tessera);
          }
          if (tessera.isLimitDestro.primo) {
            limiteTrovato = true;
          }
        }
        break;
    }
    console.log("parte: ", parte, "; tessere: ", parteArray);
    
    return parteArray;
  }

  turnoBot() {
    this._turno++;

    for (let x = 0; x < this.tessereBot.length; x++) {
      const { isInEstremoSinistro, isInEstremoDestro } =
        this.cercaCorrispondenza(this.tessereBot[x], this.tessereBanco);
      //se è uguale sia a destra che sinistra, lo mette a destra

      if (isInEstremoDestro) {
        transferArrayItem(
          this.tessereBot,
          this.tessereBanco,
          x,
          this.tessereBanco.length
        );

        this.gestisciLimite("destra");
        return;
      }

      if (isInEstremoSinistro) {
        transferArrayItem(
          this.tessereBot,
          this.tessereBanco,
          x,
          0
        );
        this.gestisciLimite("sinistra")
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

  cercaCorrispondenza(cartaTrascinata: Tessera, tessere: Tessera[], isRilasciatoADestra?: boolean) {
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

        if (isRilasciatoADestra === false) {
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

  isRilasciatoADestra(event: CdkDragDrop<any>, elementRef: ElementRef): boolean {
    const oggettoRilasciatoX = event.dropPoint.x - 180;
    const centroContenitoreX = elementRef.nativeElement.clientWidth / 2;
    return oggettoRilasciatoX > centroContenitoreX;
  }

  pescaUnaTessera(isBot: boolean): void {
    if (isBot) {
      transferArrayItem(
        this.tessere,
        this.tessereBot,
        0,
        this.tessereBot.length
      );
      return;
    }

    transferArrayItem(
      this.tessere,
      this.tessereUtente,
      0,
      this.tessereUtente.length
    );
  }
}
