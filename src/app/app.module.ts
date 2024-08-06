
import { isDevMode, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CustomerOrderComponent } from './features/customer/customer-order/customer-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomerOrderListComponent } from './features/customer/customer-order-list/customer-order-list.component';
import { CustomerDashboardComponent } from './features/customer/customer-dashboard/customer-dashboard.component';
import { DistributorDashboardComponent } from './features/distributor/distributor-dashboard/distributor-dashboard.component';
import { ManufacturerDashboardComponent } from './features/manifacturer/manufacturer-dashboard/manufacturer-dashboard.component';
import { CreateManufacturerComponent } from './features/manifacturer/create-manufacturer/create-manufacturer.component';
import { ManufacturerListComponent } from './features/manifacturer/manufacturer-list/manufacturer-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CustomerOrderComponent,
    CustomerOrderListComponent,
    CustomerDashboardComponent,
    DistributorDashboardComponent,
    ManufacturerDashboardComponent,
    CreateManufacturerComponent,
    ManufacturerListComponent
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
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
