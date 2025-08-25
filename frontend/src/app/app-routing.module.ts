import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { CustomerDashboardComponent } from './features/customer/customer-dashboard/customer-dashboard.component';
import { DistributorDashboardComponent } from './features/distributor/distributor-dashboard/distributor-dashboard.component';
import { ManufacturerDashboardComponent } from './features/manifacturer/manufacturer-dashboard/manufacturer-dashboard.component';
import { OrderDashboardComponent } from './features/order/order-dashboard/order-dashboard.component';
import { authGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './nonsecure/login/login.component';
import { RegisterComponent } from './nonsecure/register/register.component';
import { GuestLayoutComponent } from './nonsecure/guest-layout.component';
import { AuthLayoutComponent } from './features/auth-layout.component';

const routes: Routes = [
   { path: '', pathMatch: 'full', redirectTo: 'login' },
  // unauthorized routes
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  // authorized routes
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'customers',
        component: CustomerDashboardComponent,
      },
      {
        path: 'distributors',
        component: DistributorDashboardComponent,
      },
      {
        path: 'manufacturer',
        component: ManufacturerDashboardComponent,
      },
      {
        path: 'order',
        component: OrderDashboardComponent,
      },
    ],
  },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: '/error' },
];

/* const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [ClerkAuthGuardService]  },
  { path: '', component: AppComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'customers', component: CustomerDashboardComponent, canActivate: [ClerkAuthGuardService] },
  { path: 'distributors', component: DistributorDashboardComponent, canActivate: [ClerkAuthGuardService] },
  { path: 'manufacturer', component: ManufacturerDashboardComponent, canActivate: [ClerkAuthGuardService] },
  { path: 'order', component: OrderDashboardComponent, canActivate: [ClerkAuthGuardService] },
];
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
