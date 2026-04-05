// ============================================================
// ATA Paint — Shared TypeScript interfaces
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  detailDescription: string;
  image: string;
  images: string[];
  weight: string;
  coverage: string;
  dryTime: string;
  finish: string;
  inStock: boolean;
  tags: string[];
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  orderId: string;
  productId: string;
  product: {
    name: string;
    slug: string;
    image?: string;
  };
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerAddress: string;
  note: string | null;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  note?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}
