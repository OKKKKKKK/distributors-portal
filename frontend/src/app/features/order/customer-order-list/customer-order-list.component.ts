import { Component, inject, signal } from '@angular/core';
import { CustomerOrder } from 'src/app/shared/models/constants';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
    selector: 'app-customer-order-list',
    templateUrl: './customer-order-list.component.html',
    styleUrl: './customer-order-list.component.scss',
    standalone: false
})
export class CustomerOrderListComponent {
    displayedColumns: string[] = ['name', 'clientRate', 'actualRate'];
    customerOrders$ = signal<CustomerOrder[]>([]);
    
      // injuctions
      private orderService = inject(OrderService);
      constructor() {}
    
      ngOnInit(): void {
        this.getOrders();
      }
      
      async getOrders() {
        try {
          await this.orderService.getOrders();
          this.customerOrders$ = this.orderService.orders$;
        }
        catch(err) {
          console.error(err);
        }
      }
}
