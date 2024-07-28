import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { CustomerOrderComponent } from './features/customer/customer-order/customer-order.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: '', component: AppComponent},
  {path: 'error', component: ErrorComponent},
  {path: 'orders', component: CustomerOrderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
