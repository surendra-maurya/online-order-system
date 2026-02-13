import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  console.log(`[HTTP] ${req.method} ${req.url}`);

  return next(req).pipe(
    tap({
      next: () => {
        const elapsed = Date.now() - startTime;
        console.log(`[HTTP] ✅ ${req.url} completed in ${elapsed}ms`);
      },
      error: (error) => {
        const elapsed = Date.now() - startTime;
        console.error(
          `[HTTP] ❌ ${req.url} failed in ${elapsed}ms`,
          error
        );
      }
    })
  );
};