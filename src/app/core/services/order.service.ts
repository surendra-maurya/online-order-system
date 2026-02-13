import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, shareReplay } from 'rxjs';
import { Order, OrderItem, ShippingAddress, CartItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  private orders = signal<Order[]>([]);
  private loaded = signal(false);

  readonly allOrders = computed(() => this.orders());
  readonly orderCount = computed(() => this.orders().length);

  loadOrders(): Observable<Order[]> {
    if (this.loaded()) {
      return new Observable(subscriber => {
        subscriber.next(this.orders());
        subscriber.complete();
      });
    }

    return this.http.get<Order[]>('assets/data/orders.json').pipe(
      tap(orders => {
        // Merge stored local orders with JSON orders
        const localOrders = this.getLocalOrders();
        const merged = [...orders, ...localOrders];
        this.orders.set(merged);
        this.loaded.set(true);
      }),
      shareReplay(1)
    );
  }

  getOrderById(orderId: string): Order | undefined {
    return this.orders().find(o => o.id === orderId);
  }

  placeOrder(
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
    customerInfo: {
      name: string;
      email: string;
      phone: string;
      notes: string;
      paymentMethod: string;
    }
  ): Order {
    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
      total: item.product.price * item.quantity
    }));

    const subtotal = orderItems.reduce((sum, i) => sum + i.total, 0);
    const tax = subtotal * 0.08;
    const shippingCost = subtotal > 100 ? 0 : 5.99;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-2025-${String(this.orders().length + 1).padStart(4, '0')}`,
      items: orderItems,
      subtotal,
      tax,
      shippingCost,
      totalAmount: subtotal + tax + shippingCost,
      status: 'pending',
      shippingAddress,
      paymentMethod: customerInfo.paymentMethod,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      notes: customerInfo.notes,
      createdAt: now,
      updatedAt: now
    };

    this.orders.update(existing => [newOrder, ...existing]);
    this.saveLocalOrder(newOrder);

    return newOrder;
  }

  updateOrderStatus(
    orderId: string,
    status: Order['status']
  ): void {
    this.orders.update(orders =>
      orders.map(o =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    );
  }

  private saveLocalOrder(order: Order): void {
    const existing = this.getLocalOrders();
    existing.push(order);
    localStorage.setItem('orders', JSON.stringify(existing));
  }

  private getLocalOrders(): Order[] {
    try {
      const stored = localStorage.getItem('orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}