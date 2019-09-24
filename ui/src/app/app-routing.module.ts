import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
<<<<<<< HEAD
import { EventsComponent } from './events'

const routes: Routes = [
  { path: 'events', component: EventsComponent },
  { path: '', component: EventsComponent },
  { path: '**', component: EventsComponent },
=======
import {EventsComponent} from './events'

const routes: Routes = [
  {path: 'events', component: EventsComponent },
  {path: '', component: EventsComponent },
  {path: '**', component: EventsComponent },
>>>>>>> e3d2b03285d5024e3e98a267e12d0f3809f8bcf5
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
