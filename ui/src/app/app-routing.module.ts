import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsComponent, ViewEventComponent } from './events'
import { LoginComponent } from './login/login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

const routes: Routes = [
  { path: 'events', component: EventsComponent },
  { path: 'dashboard', component: ViewEventComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminLoginComponent },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
