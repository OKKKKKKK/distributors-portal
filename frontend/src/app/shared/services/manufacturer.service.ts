import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Manufacturer } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  
  private url = 'http://localhost:3000';
  manufacturers$ = signal<Manufacturer[]>([]);
  manufacturer$ = signal<Manufacturer>({} as Manufacturer);

  constructor(private httpClient: HttpClient) {}

  private refresh() {
    this.httpClient.get<Manufacturer[]>(`${this.url}/manufacturers`)
      .subscribe(manufacturer => {
        this.manufacturers$.set(manufacturer);
      });
  }

  getManufacturers() {
    this.refresh();
    return this.manufacturers$();
  }

  createManufacturer(manufacturer: Manufacturer) {
    console.log(manufacturer);
    return this.httpClient.post(`${this.url}/manufacturers`, manufacturer, { responseType: 'text' });
  }
}
