import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AppCurrencyPipe } from '../../../shared/pipes/inr-currency-pipe';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AppCurrencyPipe],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private notify = inject(NotificationService);

  submitting = signal(false);
  currentStep = signal(1);

  checkoutForm: FormGroup = this.fb.group({
    // Customer Info
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    customerEmail: ['', [Validators.required, Validators.email]],
    customerPhone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{10,}$/)]],

    // Shipping Address
    fullName: ['', [Validators.required]],
    addressLine1: ['', [Validators.required]],
    addressLine2: [''],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
    country: ['United States', [Validators.required]],

    // Payment
    paymentMethod: ['credit-card', [Validators.required]],
    notes: ['']
  });

  // Helper for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'This field is required';
    if (field.errors['email']) return 'Please enter a valid email';
    if (field.errors['minlength'])
      return `Minimum ${field.errors['minlength'].requiredLength} characters`;
    if (field.errors['pattern']) return 'Invalid format';

    return 'Invalid input';
  }

  nextStep(): void {
    // Validate current step fields
    if (this.currentStep() === 1) {
      const fields = ['customerName', 'customerEmail', 'customerPhone'];
      fields.forEach(f => this.checkoutForm.get(f)?.markAsTouched());
      if (fields.some(f => this.checkoutForm.get(f)?.invalid)) return;
    }

    if (this.currentStep() === 2) {
      const fields = ['fullName', 'addressLine1', 'city', 'state', 'zipCode'];
      fields.forEach(f => this.checkoutForm.get(f)?.markAsTouched());
      if (fields.some(f => this.checkoutForm.get(f)?.invalid)) return;
    }

    this.currentStep.update(s => s + 1);
  }

  prevStep(): void {
    this.currentStep.update(s => s - 1);
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid || this.cartService.isEmpty()) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formVal = this.checkoutForm.value;

    // Simulate API delay
    setTimeout(() => {
      const order = this.orderService.placeOrder(
        this.cartService.items(),
        {
          fullName: formVal.fullName,
          addressLine1: formVal.addressLine1,
          addressLine2: formVal.addressLine2 || '',
          city: formVal.city,
          state: formVal.state,
          zipCode: formVal.zipCode,
          country: formVal.country
        },
        {
          name: formVal.customerName,
          email: formVal.customerEmail,
          phone: formVal.customerPhone,
          notes: formVal.notes || '',
          paymentMethod: formVal.paymentMethod
        }
      );

      this.cartService.clearCart();
      this.notify.success('Order placed successfully!');
      this.submitting.set(false);
      this.router.navigate(['/orders', order.id]);
    }, 1500);
  }
}