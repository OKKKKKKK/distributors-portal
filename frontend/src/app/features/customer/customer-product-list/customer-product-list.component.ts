import { Component, WritableSignal } from '@angular/core';
import { CustomerProducts } from 'src/app/shared/models/constants';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  selector: 'app-customer-product-list',
  templateUrl: './customer-product-list.component.html',
  styleUrl: './customer-product-list.component.scss'
})
export class CustomerProductListComponent {

  displayedColumns: string[] = ['name', 'clientRate', 'actualRate'];
  customerProducts$ = {} as WritableSignal<CustomerProducts[]>;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.fetchManufacturers();
  }
  fetchManufacturers() {
    this.customerService.getCustomerProduct();
    this.customerProducts$ = this.customerService.customerProducts$;
    console.log(this.customerProducts$());
  }
}
