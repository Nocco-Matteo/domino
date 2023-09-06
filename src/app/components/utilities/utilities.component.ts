import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PESCA_PASSA_ANIMATION } from 'src/app/animations/animation';
import { Tessera } from 'src/app/models/models';
import { PartitaService } from 'src/app/services/partita.service';
import { ErroreModalComponent } from '../modals/errore-modal/errore-modal.component';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.scss'],
  animations: [PESCA_PASSA_ANIMATION]
})
export class UtilitiesComponent {
  primaPescata: boolean = true;
  testoBottone: string = 'Pesca'

  @Input() tessere!: Tessera[];
  @Input() isTurnoBot: boolean = false;
  @Output() pesca: EventEmitter<void> = new EventEmitter<void>();
  @Output() passa: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly partitaService: PartitaService,
    private readonly dialog: MatDialog,
    ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes:", changes);

    if(changes['isTurnoBot']?.currentValue){
        this.primaPescata = true
        this.testoBottone = 'Pesca'
    }

    if (!!changes['isTurnoBot']?.previousValue) {
      
      if (this.tessere.length === 0) {
        this.primaPescata = false
        this.testoBottone = 'Passa'
      }
    }
  }

  pescaUnaTessera(): void {
    this.pesca.emit()
    this.primaPescata = false;
    this.testoBottone = 'Passa'
  }

  passaIlTurno(): void {
    if(this.controlloCollegamentoUtente()){
     this.dialog.open(ErroreModalComponent, {data: {messaggio: "Puoi collegare una tessera!", header: "ATTENZIONE NON PASSARE!"}})
      return 
    }
    this.passa.emit();
    this.primaPescata = true
    this.testoBottone = 'Pesca'

  }

  tessereFinite(): boolean {
    return this.tessere.length === 0
  }

  controlloCollegamentoUtente(): boolean
  {

    let corrispondenzaTrovata = false;

    
    this.partitaService.tessereUtente.forEach((tessera)=>{
      if(this.partitaService.cercaCorrispondenzaForControllo(tessera, this.partitaService.tessereBanco)){
        corrispondenzaTrovata = true;
      }

    })
    return corrispondenzaTrovata;
    
  }
}
