import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  Search,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import type { Order } from "../../types";
import { fetchOrders } from "../../utils/api";
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from "../../utils/format";

const STATUS_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "shipping", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "cancelled", label: "Đã hủy" },
] as const;

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          o.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, statusFilter, search]);

  return (
    <>
      <Helmet>
        <title>Quản Lý Đơn Hàng — Admin Sơn ATA</title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-surface-800">
              Quản lý đơn hàng
            </h1>
            <p className="text-sm text-surface-500 mt-1">
              {orders.length} đơn hàng
            </p>
          </div>
          <button
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white border border-surface-200 text-surface-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Tải lại
          </button>
        </div>

        {/* Status Tabs + Search */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-surface-100">
            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 flex-1">
              {STATUS_TABS.map((tab) => {
                const count =
                  tab.key === "all"
                    ? orders.length
                    : orders.filter((o) => o.status === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      statusFilter === tab.key
                        ? "bg-primary-600 text-white shadow-sm"
                        : "text-surface-500 hover:bg-surface-100 hover:text-surface-700"
                    }`}
                  >
                    {tab.label}
                    <span className="ml-1.5 opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, SĐT, mã đơn..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          </div>

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

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <ClipboardList className="w-10 h-10 text-surface-300 mb-3" />
              <p className="text-surface-500 text-sm">
                {search || statusFilter !== "all"
                  ? "Không tìm thấy đơn hàng phù hợp"
                  : "Chưa có đơn hàng nào"}
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50/50">
                    <th className="text-left px-4 py-3 text-surface-500 font-medium">
                      Mã đơn
                    </th>
                    <th className="text-left px-4 py-3 text-surface-500 font-medium">
                      Khách hàng
                    </th>
                    <th className="text-left px-4 py-3 text-surface-500 font-medium hidden sm:table-cell">
                      SĐT
                    </th>
                    <th className="text-right px-4 py-3 text-surface-500 font-medium">
                      Tổng tiền
                    </th>
                    <th className="text-center px-4 py-3 text-surface-500 font-medium">
                      Trạng thái
                    </th>
                    <th className="text-right px-4 py-3 text-surface-500 font-medium hidden md:table-cell">
                      Ngày đặt
                    </th>
                    <th className="w-10 px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-surface-100 last:border-0 hover:bg-surface-50/60 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="font-mono text-xs text-primary-600 hover:underline"
                        >
                          {order.id.slice(0, 10)}…
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium text-surface-800">
                        {order.customerName}
                      </td>
                      <td className="px-4 py-3 text-surface-500 hidden sm:table-cell">
                        {order.customerPhone}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-surface-800">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-surface-400 hidden md:table-cell">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors inline-flex"
                        >
                          <ChevronRight className="w-4 h-4 text-surface-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
