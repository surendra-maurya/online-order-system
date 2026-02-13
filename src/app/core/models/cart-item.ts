import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}