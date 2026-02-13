import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError(error => {
      let message = 'An unexpected error occurred';

      if (error.status === 0) {
        message = 'Unable to connect to server';
      } else if (error.status === 404) {
        message = 'Resource not found';
      } else if (error.status === 500) {
        message = 'Internal server error';
      }

      notify.error(message);
      return throwError(() => error);
    })
  );
};