import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InizioComponent } from './components/pages/inizio/inizio.component';
import { DominoComponent } from './components/pages/domino/domino.component';
import { authguard } from './guards/guard';
import { ChatComponent } from './components/pages/chat/chat.component';

const routes: Routes = [
  {path: '', redirectTo: '/chat', pathMatch: 'full' },
  {path: 'inizio', component: InizioComponent},
  {path: 'domino', component: DominoComponent, canActivate: [authguard] },
  {path: 'chat', component: ChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
