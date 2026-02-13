import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AppCurrencyPipe } from '../../../shared/pipes/inr-currency-pipe';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [RouterLink, AppCurrencyPipe],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {
  cartService = inject(CartService);
  private notify = inject(NotificationService);

  increment(productId: number): void {
    this.cartService.incrementQuantity(productId);
  }

  decrement(productId: number): void {
    this.cartService.decrementQuantity(productId);
  }

  remove(productId: number, productName: string): void {
    this.cartService.removeFromCart(productId);
    this.notify.info(`${productName} removed from cart`);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
      this.notify.warning('Cart cleared');
    }
  }
}