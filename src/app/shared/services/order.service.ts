import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor() {}
  placeOrder(orderDetails: any): Observable<any> {
    const success = {
      code: 400,
      message: 'Success'
    };
    return of(success); // return this.http.post('/api/orders', orderDetails);
  }
}
