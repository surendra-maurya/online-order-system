import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models';
import { OrderStatusPipe } from '../../../shared/pipes/order-status.pipe';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { AppCurrencyPipe } from '../../../shared/pipes/inr-currency-pipe';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink, AppCurrencyPipe, OrderStatusPipe, TimeAgoPipe],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.orderService.loadOrders().subscribe(orders => {
      this.orders.set(this.orderService.allOrders());
      this.loading.set(false);
    });
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