export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  updatedAt: string;
}

export type TransactionType = 'PRODUCT_CREATED' | 'STOCK_ADDED' | 'STOCK_REMOVED';

export interface Transaction {
  id: string;
  type: TransactionType;
  sku: string;
  productName: string;
  delta: number;
  quantityAfter: number;
  performedByLabel: string;
  createdAt: string;
}
