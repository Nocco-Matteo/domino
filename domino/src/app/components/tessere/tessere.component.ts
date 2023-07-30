import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { trigger, transition, style, animate } from '@angular/animations';
import { Tessera } from 'src/app/models/models';

@Component({
  selector: 'app-tessere',
  templateUrl: './tessere.component.html',
  styleUrls: ['./tessere.component.scss'],
  animations: [],
})
export class TessereComponent implements OnInit {
  @Input() tessere!: Tessera[];
  @Input() isBanco: boolean = false;

  ngOnInit(): void {
    this.init();
  }

  cartaRilasciata(event: CdkDragDrop<any>) {
    const tessereUtente = event.previousContainer.data;

    const cartaTrascinataIndex = event.previousIndex;
    const cartaTrascinata: Tessera = event.item.data;
    
    const estremoSinistro = this.tessere[0].parteSinistra;
    const estremoDestro = this.tessere[this.tessere.length - 1].parteDestra;

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

    //se è uguale sia a destra che sinistra
    if (isInEstremoDestro && isInEstremoSinistro) {
      //TODO: scelta se a destra o sinistra
      return;
    }
    //se è uguale a destra
    if (isInEstremoDestro) {
      transferArrayItem(
        tessereUtente, //tessere dell'utente
        this.tessere, //tessere del banco
        cartaTrascinataIndex, //indice nelle tessere dell'utente
        this.tessere.length //indice in cui metterlo
      );
      return;
    }
    //se è uguale a sinistra
    if (isInEstremoSinistro) {
      transferArrayItem(
        tessereUtente, //tessere dell'utente
        this.tessere, //tessere del banco
        cartaTrascinataIndex, //indice nelle tessere dell'utente
        0 //indice in cui metterlo
      );
      return;
    }
    
    //TODO: non uguale
    console.log('nada');
  }

  private init(): void {}
}
