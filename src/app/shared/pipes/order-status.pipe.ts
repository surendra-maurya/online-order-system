import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus',
  standalone: true
})
export class OrderStatusPipe implements PipeTransform {
  transform(status: string): string {
    const labels: Record<string, string> = {
      pending: '⏳ Pending',
      confirmed: '✅ Confirmed',
      processing: '🔄 Processing',
      shipped: '🚚 Shipped',
      delivered: '📦 Delivered',
      cancelled: '❌ Cancelled'
    };
    return labels[status] || status;
  }
}