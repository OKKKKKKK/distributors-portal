import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // attempt refresh
        return authService.refreshTokens().pipe(
          switchMap((newAccessToken) => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` },
            });
            return next(retryReq);
          }),
          catchError(refreshError => {
          // Refresh failed → logout
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => refreshError);
        })
        );
      }
      return throwError(() => error);
    })
  );
};
