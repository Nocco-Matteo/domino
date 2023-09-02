import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InizioComponent } from './components/pages/inizio/inizio.component';
import { HomeComponent } from './components/pages/home/home.component';
import { authguard } from './guards/guard';

const routes: Routes = [
  {path: '', redirectTo: '/inizio', pathMatch: 'full' },
  {path: 'inizio', component: InizioComponent},
  {path: 'home', component: HomeComponent, canActivate: [authguard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
