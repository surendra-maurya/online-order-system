import {
  ApplicationConfig,
  provideZonelessChangeDetection   // ← Changed from provideZoneChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { routes } from './app.routes';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),   // ← No Zone.js needed
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([loggingInterceptor, errorInterceptor])
    )
  ]
};