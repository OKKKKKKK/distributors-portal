import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Customer, CustomerProducts } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  private url = 'http://localhost:3000';
  customers$ = signal<Customer[]>([]);
  customer$ = signal<Customer>({} as Customer);

  constructor(private httpClient: HttpClient) {}

  private refresh() {
    this.httpClient.get<Customer[]>(`${this.url}/customers`)
      .subscribe(customer => {
        this.customers$.set(customer);
      });
  }

  getcustomers() {
    this.refresh();
    return this.customers$();
  }

  createcustomer(customer: Customer) {
    console.log(customer);
    return this.httpClient.post(`${this.url}/customers`, customer);
  }

  createCustomerProduct(customerProduct: CustomerProducts) {
    return this.httpClient.post(`${this.url}/customers`, customerProduct);
  }
}
