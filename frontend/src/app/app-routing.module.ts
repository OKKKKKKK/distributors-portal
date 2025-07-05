import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { CustomerDashboardComponent } from './features/customer/customer-dashboard/customer-dashboard.component';
import { DistributorDashboardComponent } from './features/distributor/distributor-dashboard/distributor-dashboard.component';
import { ManufacturerDashboardComponent } from './features/manifacturer/manufacturer-dashboard/manufacturer-dashboard.component';
import { OrderDashboardComponent } from './features/order/order-dashboard/order-dashboard.component';
import { AdminLayoutComponent } from './theme/admin-layout/admin-layout.component';
import { authGuard } from './core';
import { AuthLayoutComponent } from './theme/auth-layout/auth-layout.component';
import { LoginComponent } from './routes/sessions/login/login.component';
import { RegisterComponent } from './routes/sessions/register/register.component';

/* const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: '', component: AppComponent},
  {path: 'error', component: ErrorComponent},
  {path: 'customers', component: CustomerDashboardComponent},
  {path: 'distributors', component: DistributorDashboardComponent},
  {path: 'manufacturer', component: ManufacturerDashboardComponent},
  {path: 'order', component: OrderDashboardComponent}
]; */

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./shared/components/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/customer/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent),
      },
      {
        path: 'manufacturer',
        loadComponent: () => import('./features/manifacturer/manufacturer-dashboard/manufacturer-dashboard.component').then(m => m.ManufacturerDashboardComponent),
      },
      {
        path: 'order',
        loadComponent: () => import('./features/order/order-dashboard/order-dashboard.component').then(m => m.OrderDashboardComponent),
      },
      /* {
        path: 'distributor',
        loadComponent: () => import('./features/distributor/distributor-dashboard').then(m => m.DistributorDashboardComponent),
      }, */
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
