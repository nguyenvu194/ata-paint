import { NavLink, Outlet, Link } from "react-router-dom";
import {
  ClipboardList,
  Package,
  Paintbrush,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

const adminNav = [
  { to: "/admin/orders", label: "Đơn hàng", icon: ClipboardList },
  { to: "/admin/products", label: "Sản phẩm", icon: Package },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-primary-600 text-white shadow-md"
        : "text-surface-600 hover:bg-surface-100 hover:text-surface-800"
    }`;

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* ── Mobile Backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-surface-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <Link to="/admin" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Paintbrush className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-surface-800">
                ATA <span className="text-primary-600">Admin</span>
              </span>
            </div>
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-surface-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Back to store */}
        <div className="px-3 py-4 border-t border-surface-100">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Về cửa hàng
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-surface-200 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Mở menu"
          >
            <Menu className="w-5 h-5 text-surface-600" />
          </button>
          <div className="text-sm text-surface-400 font-medium">
            Bảng điều khiển quản trị
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
