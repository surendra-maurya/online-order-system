import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product, Category } from '../../../core/models';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { StarRatingPipe } from '../../../shared/pipes/star-rating.pipe';
import { AppCurrencyPipe } from '../../../shared/pipes/inr-currency-pipe';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    RouterLink,
    AppCurrencyPipe,
    TruncatePipe,
    StarRatingPipe
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private notify = inject(NotificationService);

  featuredProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe(products => {
      this.featuredProducts.set(products);
      this.loading.set(false);
    });

    this.categoryService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.notify.success(`${product.name} added to cart!`);
  }
}