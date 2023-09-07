import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ZOOM_ANIMATION } from 'src/app/animations/animation';
import { PartitaService } from 'src/app/services/partita.service';

@Component({
  selector: 'app-inizio',
  templateUrl: './inizio.component.html',
  styleUrls: ['./inizio.component.scss'],
  animations: [ZOOM_ANIMATION]
})
export class InizioComponent implements OnInit {
  showGame = false;
  zoomState = 'zoomOut';

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly partitaService: PartitaService

  ) { }
  ngOnInit(): void {
    setInterval(() => {
      this.zoomState = (this.zoomState === 'zoomOut' ? 'zoomIn' : 'zoomOut');
    }, 1000);
  }

  goFullscreen() {
    const elem: any = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      this.cdr.detectChanges();
      window.dispatchEvent(new Event('resize'));
    } else if (elem['mozRequestFullScreen']) {  // Firefox
      elem['mozRequestFullScreen']();
      this.cdr.detectChanges();
      window.dispatchEvent(new Event('resize'));
    } else if (elem['webkitRequestFullscreen']) {  // Chrome, Safari and Opera
      elem['webkitRequestFullscreen']();
      this.cdr.detectChanges();
      window.dispatchEvent(new Event('resize'));
    } else if (elem['msRequestFullscreen']) {  // IE/Edge
      elem['msRequestFullscreen']();
      this.cdr.detectChanges();
      window.dispatchEvent(new Event('resize'));
    }

    this.partitaService.redirectInizio = true;
    this.router.navigate(['/domino']);
  }
}
