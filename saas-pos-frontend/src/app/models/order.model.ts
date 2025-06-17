import { CartItem } from './cart.model';

export interface OrderRequest {
  userId?: number;
  items: Array<{ productId: number, quantity: number, priceAtPurchase: number }>;
  totalAmount: number;
}

export interface OrderResponseItem {
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  name: string; // Product name for convenience in response
}

export interface OrderResponse {
  orderId: number;
  status: string;
  items: OrderResponseItem[];
  totalAmount: number;
  orderDate: string;
}
