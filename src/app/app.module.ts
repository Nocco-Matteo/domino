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
import { BancoComponent } from './components/banco/banco.component';
import { ErroreModalComponent } from './components/modals/errore-modal/errore-modal.component';
import { InizioModalComponent } from './components/modals/inizio-modal/inizio-modal.component';
import { LandscapeModalComponent } from './components/modals/landscape-modal/landscape-modal.component';
import { VittoriaModalComponent } from './components/modals/vittoria-modal/vittoria-modal.component';
import { ChatComponent } from './components/pages/chat/chat.component';
import { DominoComponent } from './components/pages/domino/domino.component';
import { InizioComponent } from './components/pages/inizio/inizio.component';
import { TessereComponent } from './components/tessere/tessere.component';
import { UtilitiesComponent } from './components/utilities/utilities.component';
import { HomeComponent } from './components/pages/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    DominoComponent,
    TessereComponent,
    UtilitiesComponent,
    VittoriaModalComponent,
    ErroreModalComponent,
    LandscapeModalComponent,
    BancoComponent,
    InizioModalComponent,
    InizioComponent,
    ChatComponent,
    HomeComponent,
    
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
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
