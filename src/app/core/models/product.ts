export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discount: number;
  categoryId: number;
  categoryName: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}