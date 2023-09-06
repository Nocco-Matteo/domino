import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { ElementRef, Injectable, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VittoriaModalComponent } from '../components/modals/vittoria-modal/vittoria-modal.component';
import { BOT_NUMERO_TURNI, LIMITE_TESSERE_CENTRALI, LIMITE_TESSERE_VERTICALI, PARTI } from '../configs/config';
import { Immagine, IsTurnoBot, Tessera } from '../models/models';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartitaService {
  private primaPescata: boolean = true;

  private tessere: Tessera[] = [];

  private tessereBot: Tessera[] = [];
  private _tessereBanco: Tessera[] = [];
  private _tessereUtente: Tessera[] = [];

  private _turno: number = 1;

  private hintsSubject: Subject<boolean[]> = new Subject<boolean[]>();

  private _redirectInizio: boolean = false;

  hintsObservable$: Observable<boolean[]> = this.hintsSubject.asObservable();

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
    console.log("tessere: ", this.tessere);

  }


  private estraiSetteTessereCasuali(): Tessera[] {
    const setteCarteCasuali: Tessera[] = [];
    //const numeroTessere = this.tessere.length;
    const numeroTessere = 7;

    for (let i = 0; i < numeroTessere; i++) {
      const indiceCasuale = Math.floor(Math.random() * this.tessere.length);

      const cartaCasuale = this.tessere.splice(indiceCasuale, 1)[0];

      setteCarteCasuali.push(cartaCasuale);
    }

    return setteCarteCasuali;
  }

  private gestisciSecondoBlocco(parte: PARTI): number {
    const parteInvertita = parte === PARTI.sinistra ? PARTI.destra : PARTI.sinistra
    if (!this.controllaLimite(parteInvertita, this._tessereBanco)) {
      console.log("nessuna corrispondenza", parte, "--", this._tessereBanco);
      return 0;
    }
    let tesserePrima = 0;

    switch (parte) {
      case PARTI.sinistra:
        for (const tessera of this._tessereBanco) {
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
        for (const tessera of this._tessereBanco) {
          tesserePrima++;
          if (tessera.isLimitSinistro.secondo) {
            tesserePrima = 0;
          }
          if (tessera.isLimitSinistro.primo) {
            break;
          }
        }
        break;
      case PARTI.centraleInferiore:
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

  private gestisciTerzoBlocco(parte: PARTI): number {
    if (!this.controllaOrizzontale(parte, this._tessereBanco)) {
      console.log("nessuna corrispondenza Oriz", parte, "--", this._tessereBanco);
      return 0;
    }
    let tesserePrima = 0;

    switch (parte) {
      case PARTI.sinistra:
        for (const tessera of this._tessereBanco) {
          tesserePrima++;
          if (tessera.isLimitDestro.secondo) {
            break;
          }
        }
        break;
      case PARTI.destra:
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

  checkHints(carta: Tessera): void {
    const { isInEstremoSinistro, isInEstremoDestro } =
      this.cercaCorrispondenza(carta, this._tessereBanco)

    this.hintsSubject.next([isInEstremoSinistro, isInEstremoDestro]);
  }

  hideHints(): void {
    const isInEstremoDestro = false;
    const isInEstremoSinistro = false;
    this.hintsSubject.next([isInEstremoSinistro, isInEstremoDestro]);
  }

  nuovoTurnoBot(turnoBot: IsTurnoBot, checkUtentePassato?: boolean): void {
    turnoBot.isTurnoBot = true;
    if (this.controllaVittoria()) {
      this.finePartita("Hai vinto!");
      return;
    }
    setTimeout(() => {
      for (let index = 0; index < BOT_NUMERO_TURNI; index++) {
        this.turnoBot(checkUtentePassato)
      }

      if (this.controllaVittoria()) {
        this.finePartita("Hai perso!");
        return;
      }
      turnoBot.isTurnoBot = false;
    }, 1500);
  }

  controllaLimite(parte: PARTI, tessere: Tessera[]): boolean {
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
      case PARTI.centraleInferiore:
        res = !!(tessere.find((tessera) => tessera.isLimitDestro.secondo))
        break;
    }
    return res;
  }

  controllaOrizzontale(parte: PARTI, tessere: Tessera[]): boolean {
    return parte === "sinistra" ?
      !!(tessere.find((tessera) => tessera.isLimitSinistro.secondo)) :
      !!(tessere.find((tessera) => tessera.isLimitDestro.secondo));
  }

  gestisciLimite(parte: PARTI): void {
    const limiteCentrale = LIMITE_TESSERE_CENTRALI;
    const limiteVerticali = LIMITE_TESSERE_VERTICALI;

    // const tesserePrima = this.gestisciSecondoBlocco(parte);

    const tesserePrimaSinistra = this.prendiParteArray(PARTI.sinistra)
    tesserePrimaSinistra.push(...this.prendiParteArray(PARTI.centraleSuperiore))

    const tesserePrimaDestra = this.prendiParteArray(PARTI.destra);
    tesserePrimaDestra.push(...this.prendiParteArray(PARTI.centraleInferiore))

    switch (parte) {
      case PARTI.sinistra:
        if (tesserePrimaSinistra?.length === limiteVerticali) {
          
          tesserePrimaSinistra[0].isLimitSinistro.secondo = true;
          break;
        }
        if (this._tessereBanco.length === limiteCentrale) {
          
          this._tessereBanco[0].isLimitSinistro.primo = true
          this._tessereBanco[limiteCentrale - 1].isLimitDestro.primo = true
        }
        break;
      case PARTI.destra:
        if (tesserePrimaDestra?.length === limiteVerticali) {
          
          tesserePrimaDestra[limiteVerticali - 1].isLimitDestro.secondo = true;
          break;
        }
        if (this._tessereBanco.length === limiteCentrale) {
          
          this._tessereBanco[0].isLimitSinistro.primo = true
          this._tessereBanco[limiteCentrale - 1].isLimitDestro.primo = true
        }
        break;
    }
  }

  controllaVittoria(): boolean {
    return this.tessereBot.length === 0 || this._tessereUtente.length === 0
  }

  generaImmagini(): Immagine[] {
    const result = [];
    for (let i = 0; i < 6; i++) {
      result.push({
        immagine: `assets/imgs/tessere/tessera${i + 1}.jpeg`,
      });
    }
    return result;
  }

  initTessere() {
    this.popolaTessere();

    this._tessereUtente = this.estraiSetteTessereCasuali();
    this.tessereBot = this.estraiSetteTessereCasuali();
    //this.tessere = [];

    return {
      tessereUtente: this._tessereUtente,
      tessereBanco: this._tessereBanco,
      tessereBot: this.tessereBot,
      tessere: this.tessere,
    };
  }

  prendiParteArray(parte: PARTI): Tessera[] {
    if (!this.controllaLimite(parte, this._tessereBanco)
      && parte !== PARTI.centro) {
      return []
    }

    let parteArray = [];
    let limiteSinistroTrovato = false;
    let limiteDestroTrovato = false;

    switch (parte) {
      case PARTI.sinistra:

        for (const tessera of this._tessereBanco) {
          if (tessera.isLimitSinistro.secondo) {
            parteArray = []
          }
          if (tessera.isLimitSinistro.primo) {
            break;
          }

          parteArray.push(tessera);
        }

        break;
      case PARTI.destra:
        for (const tessera of this._tessereBanco) {
          if (limiteDestroTrovato) {
            parteArray.push(tessera);
          }
          if (tessera.isLimitDestro.secondo) {
            break;
          }
          if (tessera.isLimitDestro.primo) {
            limiteDestroTrovato = true;
          }
        }
        break;
      case PARTI.centro:
        if (this.controllaLimite(PARTI.sinistra, this._tessereBanco)
          && this.controllaLimite(PARTI.destra, this._tessereBanco)) {
          for (const tessera of this._tessereBanco) {
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
        else if (!this.controllaLimite(PARTI.sinistra, this._tessereBanco)
          && !this.controllaLimite(PARTI.destra, this._tessereBanco)) {
          for (const tessera of this._tessereBanco) {
            parteArray.push(tessera);
          }
        }
        break;
      case PARTI.centraleSuperiore:


        for (const tessera of this._tessereBanco) {
          if (tessera.isLimitSinistro.secondo) {
            break;
          }

          parteArray.push(tessera);
        }


        break;
      case PARTI.centraleInferiore:

        for (const tessera of this._tessereBanco) {
          if (limiteDestroTrovato) {
            parteArray.push(tessera);
          }
          if (tessera.isLimitDestro.secondo) {
            limiteDestroTrovato = true;
          }
        }
        break;
    }
    //console.log("parte: ", parte, "; tessere: ", parteArray);

    return parteArray;
  }

  turnoBot(checkUtentePassato?: boolean) {
    this._turno++;
    console.log("tessere bot: ",this.tessereBot);
    
    if(this._tessereBanco.length===0){
      transferArrayItem(
        this.tessereBot,
        this._tessereBanco,
        0,
        this._tessereBanco.length
      );
      return
    }
    for (let x = 0; x < this.tessereBot.length; x++) {
      const { isInEstremoSinistro, isInEstremoDestro } =
        this.cercaCorrispondenza(this.tessereBot[x], this._tessereBanco);
      //se è uguale sia a destra che sinistra, lo mette a destra

      if (isInEstremoDestro) {
        this.gestisciLimite(PARTI.destra);
        transferArrayItem(
          this.tessereBot,
          this._tessereBanco,
          x,
          this._tessereBanco.length
        );

        return;
      }

      if (isInEstremoSinistro) {
        this.gestisciLimite(PARTI.sinistra)
        transferArrayItem(
          this.tessereBot,
          this._tessereBanco,
          x,
          0
        );
        return;
      }
    }

    if(this.primaPescata){
      this.primaPescata = false
      this.pescaUnaTessera(true);
      this.turnoBot(checkUtentePassato);
    }else{
      this.primaPescata = true
      if(checkUtentePassato && this.tessere.length===0){
        const messaggio = this.tessereUtente.length > this.tessereBot.length ? 'HAI PERSO!' :
        this.tessereUtente.length === this.tessereBot.length ? 'PAREGGIO!' : 'HAI VINTO!';

        this.dialog.open(VittoriaModalComponent, {data: {messaggio: messaggio}})
      }
    }    
    //tessere finite-->passaggio turno
  }

  get tessereUtente() {
    return this._tessereUtente;
  }

  get tessereBanco() {
    return this._tessereBanco;
  }

  get turno() {
    return this._turno;
  }

  get redirectInizio() {
    return this._redirectInizio;
  }

  set redirectInizio(value: boolean) {
     this._redirectInizio = value;
  }

  cercaCorrispondenza(cartaTrascinata: Tessera, tessere: Tessera[], isRilasciatoADestra?: boolean) {
    let isInEstremoSinistro = false;
    let isInEstremoDestro = false;
    if (tessere.length === 0) {
      return { isInEstremoSinistro, isInEstremoDestro };
    }

    const estremoSinistro = tessere[0].parteSinistra;
    const estremoDestro = tessere[tessere.length - 1].parteDestra;

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

  cercaCorrispondenzaForControllo(cartaTrascinata: Tessera, tessere: Tessera[]) {
    let isInEstremoSinistro = false;
    let isInEstremoDestro = false;
    if (tessere.length === 0) {
      return  isInEstremoSinistro || isInEstremoDestro ;
    }

    const estremoSinistro = tessere[0].parteSinistra;
    const estremoDestro = tessere[tessere.length - 1].parteDestra;

    switch (estremoSinistro) {
      case cartaTrascinata.parteSinistra:
        isInEstremoSinistro = true;

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

        break;
    }

    return  isInEstremoSinistro || isInEstremoDestro ;
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
    if(this.tessere.length ===0){
      return
    }

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
      this._tessereUtente,
      0,
      this._tessereUtente.length
    );
  }
}
