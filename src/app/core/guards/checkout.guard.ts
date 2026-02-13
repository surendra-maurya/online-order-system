import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { NotificationService } from '../services/notification.service';

export const checkoutGuard: CanActivateFn = () => {
  const cartService = inject(CartService);
  const router = inject(Router);
  const notify = inject(NotificationService);

  if (cartService.isEmpty()) {
    notify.warning('Your cart is empty. Add items before checkout.');
    router.navigate(['/products']);
    return false;
  }

  return true;
};