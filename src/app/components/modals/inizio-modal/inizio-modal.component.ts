import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZOOM_ANIMATION } from 'src/app/animations/animation';

@Component({
  selector: 'app-inizio-modal',
  templateUrl: './inizio-modal.component.html',
  styleUrls: ['./inizio-modal.component.scss'],
  animations: [ZOOM_ANIMATION]
})
export class InizioModalComponent implements OnInit {
  showGame = false;
  zoomState = 'zoomOut';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly cdr: ChangeDetectorRef,
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
  }
}
