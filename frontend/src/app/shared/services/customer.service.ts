import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom, Observable, of } from 'rxjs';
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

  createcustomer(customer: Partial<Customer>): Promise<any> {
    const customer$ =
      this.httpClient.post<Customer>(`${this.url}/customers`, customer);
    return firstValueFrom(customer$);
  }

  async getCustomerProduct(): Promise<CustomerProducts[]> {
    const customerProduct = this.httpClient.get<CustomerProducts[]>(`${this.url}/customer-products`);
    const response = await lastValueFrom(customerProduct);
    this.customerProducts$.set(response);
    return response;
   }

  createCustomerProduct(customerProduct: CustomerProducts) {
    return this.httpClient.post(`${this.url}/customer-products`, customerProduct);
  }
}
