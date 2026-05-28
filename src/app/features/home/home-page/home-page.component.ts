import { Component, OnInit, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
  private document = inject(DOCUMENT);

  featuredProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  darkTheme = signal(false);

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('orderhub-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

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

  toggleTheme(): void {
    this.setTheme(!this.darkTheme());
  }

  private setTheme(isDark: boolean): void {
    this.darkTheme.set(isDark);
    this.document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('orderhub-theme', isDark ? 'dark' : 'light');
  }
}
