import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlertDetailsComponent } from './components/alert-details/alert-details.component'
import { CanActivateGuard } from './guards/can-activate.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [CanActivateGuard] },
  { path: 'alert', component: AlertComponent, canActivate: [CanActivateGuard] },
  { path: 'alert-details/:pipelineId/:alertId', component: AlertDetailsComponent, canActivate: [CanActivateGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
