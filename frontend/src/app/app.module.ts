
import { isDevMode, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CustomerOrderComponent } from './features/order/customer-order/customer-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomerOrderListComponent } from './features/order/customer-order-list/customer-order-list.component';
import { CustomerDashboardComponent } from './features/customer/customer-dashboard/customer-dashboard.component';
import { DistributorDashboardComponent } from './features/distributor/distributor-dashboard/distributor-dashboard.component';
import { ManufacturerDashboardComponent } from './features/manifacturer/manufacturer-dashboard/manufacturer-dashboard.component';
import { CreateManufacturerComponent } from './features/manifacturer/create-manufacturer/create-manufacturer.component';
import { ManufacturerListComponent } from './features/manifacturer/manufacturer-list/manufacturer-list.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CreateCustomerComponent } from './features/customer/create-customer/create-customer.component';
import { CustomerProductsComponent } from './features/customer/customer-products/customer-products.component';
import { CustomerProductListComponent } from './features/customer/customer-product-list/customer-product-list.component';
import { OrderDashboardComponent } from './features/order/order-dashboard/order-dashboard.component';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { GuestLayoutComponent } from './nonsecure/guest-layout.component';
import { AuthLayoutComponent } from './features/auth-layout.component';
import { LoginComponent } from './nonsecure/login/login.component';
import { RegisterComponent } from './nonsecure/register/register.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CustomerOrderListComponent,
    CustomerDashboardComponent,
    DistributorDashboardComponent,
    ManufacturerDashboardComponent,
    CreateManufacturerComponent,
    ManufacturerListComponent,
    CreateCustomerComponent,
    CustomerProductsComponent,
    CustomerProductListComponent,
    OrderDashboardComponent,
    CustomerOrderComponent,
    GuestLayoutComponent,
    AuthLayoutComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
    }),
    FooterComponent
],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  exports: [
    NavbarComponent,
    MaterialModule,
    MatTableModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
