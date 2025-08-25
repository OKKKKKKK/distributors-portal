import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:3000';

  httpClient = inject(HttpClient);

  constructor() {}

  login(params: any) {
    return this.httpClient.post(`${this.url}/auth/login`, params);
  }
}
