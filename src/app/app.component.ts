import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LandscapeModalComponent } from './components/modals/landscape-modal/landscape-modal.component';
import { PartitaService } from './services/partita.service';
import { InizioModalComponent } from './components/modals/inizio-modal/inizio-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'domino';
  private dialogRef: MatDialogRef<LandscapeModalComponent> | null = null;
  private breakpointSubscription: Subscription | null = null;
  //isModalOpen: boolean = false;

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly dialog: MatDialog,
    private readonly partitaService : PartitaService
  ) 
  {

    // this.dialog.open(InizioModalComponent, {
    //   height: '100vh',
    //   width: '100vw',
    //   maxWidth: 'none',
    // });

    // this.isModalOpen = false;

  }

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.closeDialog();
    this.unsubscribeBreakpoint();
  }

  init(): void {
    
    this.breakpointSubscription = this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .subscribe((state) => {
        if (state.matches) {
          if (!this.dialogRef) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'custom-dialog-class';
            this.dialogRef = this.dialog.open(LandscapeModalComponent, {
              disableClose: true,
            });
            this.dialogRef.afterClosed().subscribe(() => {
              this.dialogRef = null;
            });
          }
        } else {
          this.closeDialog();
        }
      });
  }

  private closeDialog(): void {
    if (this.dialogRef) {
      
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }

  private unsubscribeBreakpoint(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
      this.breakpointSubscription = null;
    }
  }
}
