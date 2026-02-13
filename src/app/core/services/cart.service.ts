import { Injectable, computed, effect, signal } from '@angular/core';
import { Product, CartItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // ---------- SIGNAL STATE ----------
  private cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  // ---------- COMPUTED VALUES ----------
  readonly items = computed(() => this.cartItems());

  readonly itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  readonly tax = computed(() => this.subtotal() * 0.08); // 8% tax

  readonly shippingCost = computed(() =>
    this.subtotal() > 100 ? 0 : 5.99
  );

  readonly totalAmount = computed(() =>
    this.subtotal() + this.tax() + this.shippingCost()
  );

  readonly isEmpty = computed(() => this.cartItems().length === 0);

  constructor() {
    // Save to localStorage whenever cart changes
    effect(() => {
      const items = this.cartItems();
      localStorage.setItem('cart', JSON.stringify(items));
    });
  }

  // ---------- ACTIONS ----------
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingIndex = currentItems.findIndex(
      item => item.product.id === product.id
    );

    if (existingIndex > -1) {
      const updated = [...currentItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity
      };
      this.cartItems.set(updated);
    } else {
      this.cartItems.set([
        ...currentItems,
        { product, quantity, addedAt: new Date().toISOString() }
      ]);
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems.update(items =>
      items.filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  incrementQuantity(productId: number): void {
    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  decrementQuantity(productId: number): void {
    const item = this.cartItems().find(i => i.product.id === productId);
    if (item && item.quantity <= 1) {
      this.removeFromCart(productId);
    } else {
      this.cartItems.update(items =>
        items.map(i =>
          i.product.id === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
      );
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  isInCart(productId: number): boolean {
    return this.cartItems().some(item => item.product.id === productId);
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}