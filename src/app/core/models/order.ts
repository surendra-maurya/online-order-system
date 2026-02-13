import { CartItem } from './cart-item';

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';