import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  templateUrl: './notification-toast.component.html',
  styleUrl: './notification-toast.component.scss'
})
export class NotificationToastComponent {
  notificationService = inject(NotificationService);

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }
}