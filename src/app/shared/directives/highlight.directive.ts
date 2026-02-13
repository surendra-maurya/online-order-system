import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  private el = inject(ElementRef);

  appHighlight = input<string>('#fff3cd');

  @HostListener('mouseenter')
  onMouseEnter() {
    this.setBackground(this.appHighlight() || '#fff3cd');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.setBackground('');
  }

  private setBackground(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
    this.el.nativeElement.style.transition = 'background-color 0.3s ease';
  }
}