import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models';
import { StarRatingPipe } from '../../../shared/pipes/star-rating.pipe';
import { StockStatusDirective } from '../../../shared/directives/stock-status.directive';
import { AppCurrencyPipe } from '../../../shared/pipes/inr-currency-pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RouterLink,
    AppCurrencyPipe,
    StarRatingPipe,
    StockStatusDirective
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private notify = inject(NotificationService);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  selectedImage = signal('');
  quantity = signal(1);
  loading = signal(true);
  activeTab = signal<'description' | 'details' | 'reviews'>('description');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.loadProduct(slug);
    });
  }

  private loadProduct(slug: string): void {
    this.loading.set(true);
    this.productService.getProductBySlug(slug).subscribe(product => {
      if (product) {
        this.product.set(product);
        this.selectedImage.set(product.image);
        this.quantity.set(1);
        this.loadRelated(product.categoryId, product.id);
      } else {
        this.router.navigate(['/products']);
      }
      this.loading.set(false);
    });
  }

  private loadRelated(categoryId: number, excludeId: number): void {
    this.productService.getProductsByCategory(categoryId).subscribe(products => {
      this.relatedProducts.set(
        products.filter(p => p.id !== excludeId).slice(0, 4)
      );
    });
  }

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  incrementQty(): void {
    const p = this.product();
    if (p && this.quantity() < p.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQty(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(): void {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
      this.notify.success(
        `${this.quantity()}x ${p.name} added to cart!`
      );
    }
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  setTab(tab: 'description' | 'details' | 'reviews'): void {
    this.activeTab.set(tab);
  }

  isInCart(): boolean {
    const p = this.product();
    return p ? this.cartService.isInCart(p.id) : false;
  }
}