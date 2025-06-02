import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { Login } from './pages/login/login';
import { AdminForm } from './pages/login/admin-form/admin-form';
import { UserForm } from './pages/login/user-form/user-form';
import { authGuard } from './auth-gaurd';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'admin', component: AdminForm, canActivate: [authGuard]},
  { path: 'user', component: UserForm, canActivate: [authGuard]},
];

export const appRoutingProviders = [
  provideRouter(routes)
];