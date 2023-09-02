import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ErroreModalComponent } from './components/modals/errore-modal/errore-modal.component';
import { LandscapeModalComponent } from './components/modals/landscape-modal/landscape-modal.component';
import { VittoriaModalComponent } from './components/modals/vittoria-modal/vittoria-modal.component';
import { TessereComponent } from './components/tessere/tessere.component';
import { UtilitiesComponent } from './components/utilities/utilities.component';
import { BancoComponent } from './components/banco/banco.component';
import { InizioModalComponent } from './components/modals/inizio-modal/inizio-modal.component';
import { InizioComponent } from './components/pages/inizio/inizio.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TessereComponent,
    UtilitiesComponent,
    VittoriaModalComponent,
    ErroreModalComponent,
    LandscapeModalComponent,
    BancoComponent,
    InizioModalComponent,
    InizioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    NgOptimizedImage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
