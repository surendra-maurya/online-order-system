import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models';
import { OrderStatusPipe } from '../../../shared/pipes/order-status.pipe';
import { DatePipe } from '@angular/common';
import { AppCurrencyPipe } from '../../../shared/pipes/inr-currency-pipe';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterLink, AppCurrencyPipe, OrderStatusPipe, DatePipe],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  order = signal<Order | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const orderId = this.route.snapshot.params['id'];
    this.orderService.loadOrders().subscribe(() => {
      const found = this.orderService.getOrderById(orderId);
      if (found) {
        this.order.set(found);
      } else {
        this.router.navigate(['/orders']);
      }
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

  getProgressPercentage(status: string): number {
    const steps: Record<string, number> = {
      pending: 16, confirmed: 33, processing: 50,
      shipped: 75, delivered: 100, cancelled: 0
    };
    return steps[status] || 0;
  }
}