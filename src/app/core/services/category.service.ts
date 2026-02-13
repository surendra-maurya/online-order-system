import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Category } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  private categories$: Observable<Category[]> = this.http
    .get<Category[]>('assets/data/categories.json')
    .pipe(shareReplay(1));

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }
}