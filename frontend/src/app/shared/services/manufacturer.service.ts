import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiResponse, CreateManufacturer, Manufacturer } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  private url = 'http://localhost:3000';

  // Signals for state
  readonly manufacturers$ = signal<Manufacturer[]>([]);
  readonly manufacturer$ = signal<ApiResponse<Manufacturer> | null>(null);
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

  createManufacturer(manufacturer: CreateManufacturer) {
    return this.httpClient.post<ApiResponse<Manufacturer>>(`${this.url}/manufacturers`, manufacturer).subscribe(res=> {
      this.manufacturer$.set(res);
    }, (error)=> {
      this.error$.set(error.message || 'Something went wrong');
    })
  }
}