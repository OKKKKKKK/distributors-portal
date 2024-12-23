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

  displayedColumns: string[] = ['name', 'clientRate', 'actualRate'];
  customerProducts$ = signal<CustomerProducts[]>([]);
  test = signal<CustomerProducts[]>([]);

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.getCustomerProducts();
  }
  
  async getCustomerProducts() {
    try {
      this.customerProducts$ = this.customerService.customerProducts$;
      const customerProducts = await this.customerService.getCustomerProduct();
    }
    catch(err) {
      console.error(err);
    }
  }
}
