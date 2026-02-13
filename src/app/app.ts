import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { NotificationToastComponent } from './shared/components/notification-toast/notification-toast.component';
import { HeaderComponent } from "./layout/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterOutlet, FooterComponent, NotificationToastComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // protected readonly title = signal('online-order-system');
  title = 'OrderHub';
}
