import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventsComponent} from './events'

const routes: Routes = [
  {path: 'events', component: EventsComponent },
  {path: '', component: EventsComponent },
  {path: '**', component: EventsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
