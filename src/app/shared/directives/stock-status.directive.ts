import {
  Directive,
  ElementRef,
  inject,
  input,
  effect
} from '@angular/core';

@Directive({
  selector: '[appStockStatus]',
  standalone: true
})
export class StockStatusDirective {
  private el = inject(ElementRef);

  appStockStatus = input.required<number>();

  constructor() {
    effect(() => {
      const stock = this.appStockStatus();
      const element = this.el.nativeElement;

      if (stock === 0) {
        element.style.color = '#b91c1c';
        element.textContent = 'Out of Stock';
      } else if (stock <= 10) {
        element.style.color = '#b45309';
        element.textContent = `Only ${stock} left!`;
      } else if (stock <= 50) {
        element.style.color = '#0e7490';
        element.textContent = `${stock} in stock`;
      } else {
        element.style.color = '#15803d';
        element.textContent = 'In Stock';
      }

      element.style.fontWeight = '600';
      element.style.fontSize = '0.85rem';
    });
  }
}