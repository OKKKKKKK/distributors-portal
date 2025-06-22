import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of } from 'rxjs';
import { Order } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url = 'http://localhost:3000';

  orders$ = signal<any[]>([]);
  order$ = signal<Order>({} as Order);

  constructor(private httpClient: HttpClient) {}

  private refresh() {
    this.httpClient.get<any[]>(`${this.url}/orders/all`)
      .subscribe(order => {
        this.orders$.set(order);
      });
  }

  getOrders() {
    this.refresh();
    return this.orders$();
  }

  /* createOrder(orderDetail: CustomerOrder) {
    console.log(orderDetail);
    return this.httpClient.post(`${this.url}/orders`, orderDetail);
  } */

  createOrder(orderDetail: Partial<Order>): Promise<any> {
    console.log(orderDetail);
      const customerOrder$ =
        this.httpClient.post<Order>(`${this.url}/orders`, orderDetail);
      return firstValueFrom(customerOrder$);
    }
}
