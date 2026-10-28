import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Clone request to attach Authorization Bearer token if present
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Do not intercept or force-redirect for login/registration attempts
      const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');
      const isPublicView = typeof window !== 'undefined' && (
        window.location.pathname === '/login' ||
        window.location.pathname === '/register' ||
        window.location.pathname === '/'
      );

      // Handle genuine 401 session expiration on protected calls
      if (error.status === 401 && !isAuthEndpoint && !isPublicView) {
        authService.logout();
        router.navigate(['/login'], { queryParams: { sessionExpired: 'true' } });
      }
      return throwError(() => error);
    })
  );
};
