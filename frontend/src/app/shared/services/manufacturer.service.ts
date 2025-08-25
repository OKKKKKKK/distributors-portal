import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Manufacturer } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  private url = 'http://localhost:3000';

  // Signals for state
  readonly manufacturers$ = signal<Manufacturer[]>([]);
  readonly manufacturer$ = signal<Manufacturer | null>(null);
  readonly loading$ = signal(false);
  readonly error$ = signal<string | null>(null);

  constructor(private httpClient: HttpClient) {}

  getManufacturers() {
    this.loading$.set(true);
    this.httpClient.get<Manufacturer[]>(`${this.url}/manufacturers`)
      .subscribe({
        next: (data) => {
          this.manufacturers$.set(data);
          this.loading$.set(false);
        },
        error: (err) => {
          this.error$.set(err.message || 'Error fetching manufacturers');
          this.loading$.set(false);
        }
      });
  }

  createManufacturer(manufacturer: Manufacturer) {
    return this.httpClient.post(`${this.url}/manufacturers`, manufacturer);
  }
}