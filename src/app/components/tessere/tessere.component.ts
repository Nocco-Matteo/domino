import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  AGGIUNTA_ANIMATION,
  USCITA_ANIMATION,
} from 'src/app/animations/animation';
import { PARTI } from 'src/app/configs/config';
import { Tessera } from 'src/app/models/models';

@Component({
  selector: 'app-tessere',
  templateUrl: './tessere.component.html',
  styleUrls: ['./tessere.component.scss'],
  animations: [AGGIUNTA_ANIMATION, USCITA_ANIMATION],
})
export class TessereComponent implements OnInit {
  readonly parti = PARTI;

  @Input() immaginiCaselle!: any[];
  @Input() isDragDisabled: boolean = false;
  @Input() isBot: boolean = false;
  @Input() isUtilities: boolean = false;
  @Input() tessere!: Tessera[];

  constructor() {}

  ngOnInit(): void {}
}
