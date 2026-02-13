import { Injectable, signal, computed } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private nextId = 0;

  readonly activeNotifications = computed(() => this.notifications());

  show(
    message: string,
    type: Notification['type'] = 'info',
    duration: number = 3000
  ): void {
    const id = ++this.nextId;
    const notification: Notification = { id, message, type, duration };

    this.notifications.update(list => [...list, notification]);

    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 5000);
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  dismiss(id: number): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }
}