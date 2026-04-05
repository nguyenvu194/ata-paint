import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Package,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import type { Order } from "../../types";
import { fetchOrderById } from "../../utils/api";
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from "../../utils/format";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Status transitions — which next statuses are valid from each current status
const STATUS_TRANSITIONS: Record<string, { status: string; label: string; icon: typeof CheckCircle; color: string }[]> = {
  pending: [
    { status: "confirmed", label: "Xác nhận", icon: CheckCircle, color: "bg-blue-600 hover:bg-blue-700 text-white" },
    { status: "cancelled", label: "Hủy đơn", icon: XCircle, color: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" },
  ],
  confirmed: [
    { status: "shipping", label: "Giao hàng", icon: Truck, color: "bg-purple-600 hover:bg-purple-700 text-white" },
    { status: "cancelled", label: "Hủy đơn", icon: XCircle, color: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" },
  ],
  shipping: [
    { status: "delivered", label: "Đã giao", icon: Package, color: "bg-green-600 hover:bg-green-700 text-white" },
  ],
  delivered: [],
  cancelled: [],
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

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
        if (!cancelled) setError(err instanceof Error ? err.message : "Lỗi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!order || !id) return;
    const label = getStatusLabel(newStatus);
    if (!window.confirm(`Bạn có chắc muốn chuyển trạng thái thành "${label}"?`)) return;

    setUpdating(true);
    const prev = order.status;
    // Optimistic update
    setOrder({ ...order, status: newStatus as Order["status"] });

    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const updated = await res.json();
      setOrder(updated);
    } catch (err) {
      // Rollback
      setOrder((prev_order) => prev_order ? { ...prev_order, status: prev as Order["status"] } : null);
      alert(err instanceof Error ? err.message : "Không thể cập nhật trạng thái");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
        <p className="text-surface-500 text-sm">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <>
        <Helmet><title>Lỗi — Admin Sơn ATA</title></Helmet>
        <div className="flex flex-col items-center justify-center py-24">
          <AlertTriangle className="w-8 h-8 text-error-500 mb-3" />
          <p className="text-surface-700 font-medium mb-1">Không tìm thấy đơn hàng</p>
          <p className="text-surface-500 text-sm mb-4">{error}</p>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Danh sách đơn hàng
          </Link>
        </div>
      </>
    );
  }

  const transitions = STATUS_TRANSITIONS[order.status] || [];

  return (
    <>
      <Helmet>
        <title>Đơn hàng {order.id.slice(0, 10)} — Admin Sơn ATA</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Danh sách đơn hàng
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-surface-800">
              Đơn hàng #{order.id.slice(0, 10)}…
            </h1>
            <p className="text-sm text-surface-400 mt-0.5">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold self-start ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — customer + items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-surface-700 mb-4">Thông tin khách hàng</h2>
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

            {/* Items */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-surface-700 mb-4">Chi tiết đơn hàng</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-200">
                      <th className="text-left py-2 text-surface-500 font-medium">Sản phẩm</th>
                      <th className="text-center py-2 text-surface-500 font-medium w-16">SL</th>
                      <th className="text-right py-2 text-surface-500 font-medium w-28">Đơn giá</th>
                      <th className="text-right py-2 text-surface-500 font-medium w-32">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-b border-surface-100 last:border-0">
                        <td className="py-3 font-medium text-surface-800">{item.product.name}</td>
                        <td className="py-3 text-center text-surface-600">{item.quantity}</td>
                        <td className="py-3 text-right text-surface-600">{formatPrice(item.unitPrice)}</td>
                        <td className="py-3 text-right font-medium text-surface-800">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-surface-200 mt-2 pt-4 flex justify-between items-center">
                <span className="font-semibold text-surface-800">Tổng cộng</span>
                <span className="text-xl font-bold text-primary-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Right column — status actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5 sticky top-20">
              <h2 className="text-sm font-semibold text-surface-700 mb-4">Cập nhật trạng thái</h2>

              {/* Status timeline */}
              <div className="space-y-3 mb-6">
                {["pending", "confirmed", "shipping", "delivered"].map((s, idx) => {
                  const statuses = ["pending", "confirmed", "shipping", "delivered"];
                  const currentIdx = statuses.indexOf(order.status);
                  const isActive = idx <= currentIdx && order.status !== "cancelled";
                  const isCurrent = s === order.status;
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        isCurrent ? "bg-primary-600 border-primary-600 ring-4 ring-primary-100" :
                        isActive ? "bg-primary-600 border-primary-600" :
                        "bg-white border-surface-300"
                      }`} />
                      <span className={`text-sm ${isCurrent ? "font-semibold text-surface-800" : isActive ? "text-surface-600" : "text-surface-400"}`}>
                        {getStatusLabel(s)}
                      </span>
                    </div>
                  );
                })}
                {order.status === "cancelled" && (
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-red-500 ring-4 ring-red-100" />
                    <span className="text-sm font-semibold text-red-600">Đã hủy</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {transitions.length > 0 ? (
                <div className="space-y-2">
                  {transitions.map((t) => (
                    <button
                      key={t.status}
                      onClick={() => handleStatusChange(t.status)}
                      disabled={updating}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${t.color}`}
                    >
                      {updating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <t.icon className="w-4 h-4" />
                      )}
                      {t.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-surface-400 text-center py-2">
                  Đơn hàng đã ở trạng thái cuối cùng.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
