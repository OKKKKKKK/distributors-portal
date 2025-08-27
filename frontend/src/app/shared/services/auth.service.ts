import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { ApiResponse, CreateUser, User } from '../models/constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:3000';

  httpClient = inject(HttpClient);
  router = inject(Router);

  user$ = signal<ApiResponse<User> | null>(null);
  error$ = signal<string | null>('');

  constructor() {}

  login(params: any) {
    return this.httpClient.post(`${this.url}/auth/login`, params);
  }

  getRefreshToken() {
    return localStorage.getItem('token');
  }

  refreshTokens() {
    return this.httpClient
      .post<{ accessToken: string }>(
        `${this.url}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.accessToken);
        }),
        map((res) => res.accessToken)
      );
  }

  register(payload: CreateUser) {
    return this.httpClient
      .post<ApiResponse<User>>(`${this.url}/auth/register`, payload)
      .subscribe({
        next: (data) => {
          this.user$.set(data);
        },
        error: (err) => {
          this.error$.set(err.message || 'Something went wrong');
        },
      });
  }

  logout() {
    localStorage.removeItem('token');  
    this.router.navigate(['/login']);
  }
}
