import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor() {}

  products = [
    {
      id: 1,
      manufacturerId: 101,
      name: 'chakli',
      rate: 30
    },
    {
      id: 1,
      manufacturerId: 101,
      name: 'karanji',
      rate: 40
    },
    {
      id: 1,
      manufacturerId: 101,
      name: 'ladu',
      rate: 50
    },
    {
      id: 1,
      manufacturerId: 101,
      name: 'chivda',
      rate: 60
    },
    {
      id: 1,
      manufacturerId: 101,
      name: 'aanarse',
      rate: 100
    }

  ]
  getProductsByManufacturer(manufacturerId: string): Observable<any[]> {
    return of(this.products); // this.http.get<any[]>(`/api/products?manufacturerId=${manufacturerId}`);
  }
}
