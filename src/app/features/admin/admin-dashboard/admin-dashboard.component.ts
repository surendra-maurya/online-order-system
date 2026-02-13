import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Order, Product, OrderStatus } from '../../../core/models';
import { OrderStatusPipe } from '../../../shared/pipes/order-status.pipe';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { AppCurrencyPipe } from '../../../shared/pipes/inr-currency-pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, AppCurrencyPipe, OrderStatusPipe, TimeAgoPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private notify = inject(NotificationService);

  orders = signal<Order[]>([]);
  products = signal<Product[]>([]);
  loading = signal(true);

  // Computed stats
  totalRevenue = computed(() =>
    this.orders().reduce((sum, o) => sum + o.totalAmount, 0)
  );

  totalOrders = computed(() => this.orders().length);

  pendingOrders = computed(() =>
    this.orders().filter(o => o.status === 'pending').length
  );

  totalProducts = computed(() => this.products().length);

  recentOrders = computed(() =>
    [...this.orders()]
      .sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
  );

  lowStockProducts = computed(() =>
    this.products().filter(p => p.stock <= 10)
  );

  ngOnInit(): void {
    this.orderService.loadOrders().subscribe(() => {
      this.orders.set(this.orderService.allOrders());
      this.loading.set(false);
    });

    this.productService.getProducts().subscribe(p => {
      this.products.set(p);
    });
  }

  updateStatus(orderId: string, newStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, newStatus);
    this.orders.set(this.orderService.allOrders());
    this.notify.success(`Order status updated to ${newStatus}`);
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'badge-warning',
      confirmed: 'badge-info',
      processing: 'badge-primary',
      shipped: 'badge-info',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    };
    return map[status] || 'badge-primary';
  }
}