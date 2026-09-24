import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authStateService = inject(AuthStateService);
  const token = authStateService.accessToken();
  const router = inject(Router);

  if (token === null || !request.url.startsWith('/tasks')) {
    return next(request);
  }

  const authorizedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authStateService.clearAccessToken();
        void router.navigate(['/login'], {
          queryParams: { reason: 'session-expired' },
          replaceUrl: true,
        });
      }

      return throwError(() => error);
    }),
  );
};
