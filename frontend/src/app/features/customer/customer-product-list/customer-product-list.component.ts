import {
  Component,
  EventEmitter,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CustomerProducts } from 'src/app/shared/models/constants';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  selector: 'app-customer-product-list',
  templateUrl: './customer-product-list.component.html',
  styleUrl: './customer-product-list.component.scss',
  standalone: false,
})
export class CustomerProductListComponent {
  columnsToDisplay: string[] = ['name', 'outstanding', 'marginPercentage'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  productColumns: string[] = ['name', 'rate', 'distributorRate', 'customerRate'];

  expandedElement: any | null = null;
  displayedColumns: string[] = ['name', 'clientRate', 'MRP', 'distributorRate', 'customerRate'];
  customerProducts$ = this.customerService.customers$;
  loading$ = this.customerService.loading$;
  error$ = this.customerService.error$;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.getCustomerProducts();
  }

  getCustomerProducts() {
    this.customerService.getCustomers();
  }

  deleteCustomerEntry() {}

  toggle(el: any) {
    this.expandedElement = this.expandedElement === el ? null : el;
  }

  isExpanded = (row: any, index?: number) => this.expandedElement === row;
}
