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
    },
    {
      id: 1,
      manufacturerId: 101,
      name: 'karanji',
    },
    {
      id: 1,
      manufacturerId: 101,
      name: 'ladu',
    },
    {
      id: 1,
      manufacturerId: 101,
      name: 'chivda',
    },
    {
      id: 1,
      manufacturerId: 101,
      name: 'aanarse',
    }

  ]
  getProductsByManufacturer(manufacturerId: string): Observable<any[]> {
    return of(this.products); // this.http.get<any[]>(`/api/products?manufacturerId=${manufacturerId}`);
  }
}
