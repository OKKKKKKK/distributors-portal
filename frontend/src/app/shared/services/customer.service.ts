import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Customer, CustomerProducts } from '../models/constants';
import { toSignal } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  private url = 'http://localhost:3000';
  customers$ = signal<Customer[]>([]);
  customer$ = signal<Customer>({} as Customer);
  customerProducts$ = signal<CustomerProducts[]>([]);

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

  getCustomerProduct() {
    this.httpClient.get(`${this.url}/customer-products`).subscribe((res:any)=>{
      this.customerProducts$.set(res);
      return this.customerProducts$();
    })
  }

  createCustomerProduct(customerProduct: CustomerProducts) {
    return this.httpClient.post(`${this.url}/customer-products`, customerProduct);
  }
}
