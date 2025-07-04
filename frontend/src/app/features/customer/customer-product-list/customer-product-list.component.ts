import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { CustomerProducts } from 'src/app/shared/models/constants';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
    selector: 'app-customer-product-list',
    templateUrl: './customer-product-list.component.html',
    styleUrl: './customer-product-list.component.scss',
    standalone: false
})
export class CustomerProductListComponent {

  displayedColumns: string[] = ['name', 'clientRate', 'MRP', 'distributorRate'];
  customerProducts$ = signal<CustomerProducts[]>([]);
  test = signal<CustomerProducts[]>([]);

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.getCustomerProducts();
  }
  
  async getCustomerProducts() {
    try {
      await this.customerService.getCustomerProduct();
      this.customerProducts$ = this.customerService.customerProducts$;
      console.log(this.customerProducts$());
    }
    catch(err) {
      console.error(err);
    }
  }
}
