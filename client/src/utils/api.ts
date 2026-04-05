import type { Product, Category, Order, CreateOrderInput } from "../types";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ---- Products ----

export function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/products");
}

export function fetchProductBySlug(slug: string): Promise<Product> {
  return apiFetch<Product>(`/products/${slug}`);
}

// ---- Categories ----

export function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

// ---- Orders ----

export function createOrder(input: CreateOrderInput): Promise<Order> {
  return apiFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/orders");
}

export function fetchOrderById(id: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`);
}

export function updateOrderStatus(
  id: string,
  status: string
): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ---- Product Admin ----

export function updateProductStock(
  id: string,
  inStock: boolean
): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ inStock }),
  });
}
