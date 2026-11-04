import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from './auth';

/**
 * Se ejecuta en TODAS las llamadas al backend:
 * - agrega el token JWT en la cabecera Authorization,
 * - si el backend responde 401 (token vencido o faltante), cierra la sesión y vuelve al login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const isApi = req.url.startsWith(environment.apiUrl);
  const isAuthCall = req.url.includes('/auth/');
  const token = auth.token();

  const request =
    isApi && !isAuthCall && token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && isApi && !isAuthCall) auth.logout();
      return throwError(() => err);
    }),
  );
};
