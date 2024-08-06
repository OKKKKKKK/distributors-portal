import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  constructor() {}

  manufacturers = [
    {
      id: 101,
      name: 'joshi sweets'
    },
    {
      id: 102,
      name: 'Sakas Food'
    },
    {
      id: 103,
      name: 'Chitale Bandhu'
    },
    {
      id: 104,
      name: 'Kaka halwayi'
    }
  ]
  getManufacturers(): Observable<any[]> {
    return of(this.manufacturers) // return this.http.get<any[]>('/api/manufacturers');
  }
}
