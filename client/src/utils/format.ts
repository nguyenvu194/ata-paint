/**
 * Format a price in VND
 * @example formatPrice(450000) → "450.000₫"
 */
export function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "₫";
}

/**
 * Format a date string to Vietnamese locale
 * @example formatDate("2026-04-01T10:00:00Z") → "01/04/2026 17:00"
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get status label in Vietnamese
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao hàng",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  };
  return labels[status] || status;
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipping: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}
