import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url = 'http://localhost:3000';

  orders$ = signal<Order[]>([]);
  order$ = signal<Order>({} as Order);

  constructor(private httpClient: HttpClient) {}

  private refresh() {
    this.httpClient.get<Order[]>(`${this.url}/orders`)
      .subscribe(order => {
        this.orders$.set(order);
      });
  }

  getOrders() {
    this.refresh();
    return this.orders$();
  }

  createOrder(orderDetail: Order) {
    console.log(orderDetail);
    return this.httpClient.post(`${this.url}/orders`, orderDetail);
  }
}
