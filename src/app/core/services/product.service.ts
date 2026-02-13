import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  // Cache the products observable so JSON is loaded only once
  private products$: Observable<Product[]> = this.http
    .get<Product[]>('assets/data/products.json')
    .pipe(shareReplay(1));

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.slug === slug))
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.categoryId === categoryId))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.isFeatured))
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    const lowerQuery = query.toLowerCase();
    return this.products$.pipe(
      map(products =>
        products.filter(
          p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.tags.some(t => t.toLowerCase().includes(lowerQuery))
        )
      )
    );
  }
}