import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  effect
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product, Category } from '../../../core/models';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { StarRatingPipe } from '../../../shared/pipes/star-rating.pipe';
import { StockStatusDirective } from '../../../shared/directives/stock-status.directive';
import { AppCurrencyPipe } from '../../../shared/pipes/inr-currency-pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    AppCurrencyPipe,
    TruncatePipe,
    StarRatingPipe,
    StockStatusDirective
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private notify = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  allProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  // Filter signals
  searchQuery = signal('');
  selectedCategory = signal<number | null>(null);
  sortBy = signal<string>('name-asc');
  viewMode = signal<'grid' | 'list'>('grid');

  // Computed filtered & sorted products
  filteredProducts = computed(() => {
    let products = this.allProducts();

    // Category filter
    const catId = this.selectedCategory();
    if (catId) {
      products = products.filter(p => p.categoryId === catId);
    }

    // Search filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.categoryName.toLowerCase().includes(query) ||
          p.tags.some(t => t.includes(query))
      );
    }

    // Sort
    const sort = this.sortBy();
    products = [...products];
    switch (sort) {
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
    }

    return products;
  });

  resultCount = computed(() => this.filteredProducts().length);

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.allProducts.set(products);
      this.loading.set(false);
    });

    this.categoryService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });

    // Read category from query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(Number(params['category']));
      }
      if (params['search']) {
        this.searchQuery.set(params['search']);
      }
    });
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategory.set(categoryId);
    // Update URL query params
    this.router.navigate([], {
      queryParams: { category: categoryId },
      queryParamsHandling: 'merge'
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onSortChange(sort: string): void {
    this.sortBy.set(sort);
  }

  toggleView(): void {
    this.viewMode.update(v => (v === 'grid' ? 'list' : 'grid'));
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(product);
    this.notify.success(`${product.name} added to cart!`);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(null);
    this.sortBy.set('name-asc');
    this.router.navigate([], { queryParams: {} });
  }
}