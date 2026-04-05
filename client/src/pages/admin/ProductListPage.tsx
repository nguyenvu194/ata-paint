import { useState, useEffect } from "react";
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  Package,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import type { Product } from "../../types";
import { fetchProducts } from "../../utils/api";
import { formatPrice, formatDate } from "../../utils/format";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleToggleStock(product: Product) {
    const newStock = !product.inStock;
    setTogglingId(product.id);

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, inStock: newStock } : p))
    );

    try {
      const res = await fetch(`${API_BASE_URL}/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: newStock }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
    } catch (err) {
      // Rollback
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, inStock: !newStock } : p
        )
      );
      alert(err instanceof Error ? err.message : "Lỗi cập nhật");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <>
      <Helmet>
        <title>Quản Lý Sản Phẩm — Admin Sơn ATA</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-surface-800">
              Quản lý sản phẩm
            </h1>
            <p className="text-sm text-surface-500 mt-1">
              {products.length} sản phẩm
            </p>
          </div>
          <button
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white border border-surface-200 text-surface-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Tải lại
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
              <p className="text-surface-500 text-sm">Đang tải...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertTriangle className="w-8 h-8 text-error-500 mb-3" />
              <p className="text-surface-700 font-medium mb-1">Lỗi</p>
              <p className="text-surface-500 text-sm">{error}</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50/50">
                    <th className="text-left px-4 py-3 text-surface-500 font-medium">Sản phẩm</th>
                    <th className="text-left px-4 py-3 text-surface-500 font-medium hidden sm:table-cell">Danh mục</th>
                    <th className="text-right px-4 py-3 text-surface-500 font-medium">Giá</th>
                    <th className="text-center px-4 py-3 text-surface-500 font-medium">Tồn kho</th>
                    <th className="text-right px-4 py-3 text-surface-500 font-medium hidden md:table-cell">Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-surface-100 last:border-0 hover:bg-surface-50/60 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-surface-800 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-surface-400 truncate">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-surface-500 hidden sm:table-cell">
                        {product.category?.name}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-surface-800">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleToggleStock(product)}
                            disabled={togglingId === product.id}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                              product.inStock
                                ? "bg-green-500"
                                : "bg-surface-300"
                            } ${togglingId === product.id ? "opacity-50" : ""}`}
                            aria-label={`${product.inStock ? "Tắt" : "Bật"} tồn kho cho ${product.name}`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                                product.inStock ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-surface-400 hidden md:table-cell">
                        {formatDate(product.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Package className="w-10 h-10 text-surface-300 mb-3" />
              <p className="text-surface-500 text-sm">Chưa có sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
