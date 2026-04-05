import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Home,
  Loader2,
  AlertTriangle,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import type { Order } from "../types";
import { fetchOrderById } from "../utils/api";
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from "../utils/format";

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOrderById(id!);
        if (!cancelled) setOrder(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Không thể tải đơn hàng"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
        <p className="text-surface-500 text-sm">Đang tải đơn hàng...</p>
      </div>
    );
  }

  // ── Error ──
  if (error || !order) {
    return (
      <>
        <Helmet>
          <title>Lỗi đơn hàng — Sơn ATA</title>
        </Helmet>
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <div className="w-16 h-16 bg-error-500/10 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-error-500" />
          </div>
          <h1 className="text-xl font-bold text-surface-800 mb-2">
            Không tìm thấy đơn hàng
          </h1>
          <p className="text-surface-500 text-sm mb-6">{error}</p>
          <div className="flex gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Về trang chủ
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-surface-100 text-surface-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-surface-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </button>
          </div>
        </div>
      </>
    );
  }

  const statusLabel = getStatusLabel(order.status);
  const statusColor = getStatusColor(order.status);

  return (
    <>
      <Helmet>
        <title>Đặt Hàng Thành Công — Sơn ATA</title>
        <meta
          name="description"
          content={`Đơn hàng ${order.id} đã được ghi nhận.`}
        />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* ── Success Banner ── */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-success-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-success-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-surface-500">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận.
          </p>
        </div>

        {/* ── Order Info Card ── */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-surface-50 px-5 py-4 border-b border-surface-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-surface-500" />
              <span className="text-sm text-surface-500">Mã đơn hàng:</span>
              <span className="text-sm font-mono font-semibold text-surface-800">
                {order.id.slice(0, 12)}…
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
              >
                {statusLabel}
              </span>
              <span className="text-xs text-surface-400">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="px-5 py-4 border-b border-surface-100">
            <h2 className="text-sm font-semibold text-surface-700 mb-3">
              Thông tin khách hàng
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-surface-600">
                <User className="w-4 h-4 text-surface-400 shrink-0" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-surface-600">
                <Phone className="w-4 h-4 text-surface-400 shrink-0" />
                <span>{order.customerPhone}</span>
              </div>
              {order.customerEmail && (
                <div className="flex items-center gap-2 text-surface-600">
                  <Mail className="w-4 h-4 text-surface-400 shrink-0" />
                  <span>{order.customerEmail}</span>
                </div>
              )}
              <div className="flex items-start gap-2 text-surface-600 sm:col-span-2">
                <MapPin className="w-4 h-4 text-surface-400 shrink-0 mt-0.5" />
                <span>{order.customerAddress}</span>
              </div>
              {order.note && (
                <div className="flex items-start gap-2 text-surface-600 sm:col-span-2">
                  <FileText className="w-4 h-4 text-surface-400 shrink-0 mt-0.5" />
                  <span className="italic">{order.note}</span>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold text-surface-700 mb-3">
              Chi tiết đơn hàng
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left py-2 text-surface-500 font-medium">
                      Sản phẩm
                    </th>
                    <th className="text-center py-2 text-surface-500 font-medium w-20">
                      SL
                    </th>
                    <th className="text-right py-2 text-surface-500 font-medium w-28">
                      Đơn giá
                    </th>
                    <th className="text-right py-2 text-surface-500 font-medium w-32">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-surface-100 last:border-0"
                    >
                      <td className="py-3">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-medium text-surface-800 hover:text-primary-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      </td>
                      <td className="py-3 text-center text-surface-600">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right text-surface-600">
                        {formatPrice(item.unitPrice)}
                      </td>
                      <td className="py-3 text-right font-medium text-surface-800">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="border-t border-surface-200 mt-2 pt-4 flex justify-between items-center">
              <span className="font-semibold text-surface-800">
                Tổng cộng
              </span>
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Home className="w-4 h-4" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </>
  );
}
