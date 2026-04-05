import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Paintbrush, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Header() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-accent-400"
        : "text-primary-200 hover:text-white"
    }`;

  return (
    <header className="bg-primary-900 text-white sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          id="logo-link"
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 bg-accent-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <Paintbrush className="w-5 h-5 text-primary-900" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Sơn <span className="text-accent-400">ATA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>
            Trang chủ
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Sản phẩm
          </NavLink>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            id="cart-icon"
            onClick={() => navigate("/cart")}
            className="relative p-2 rounded-lg hover:bg-primary-800 transition-colors duration-200"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-accent-400 text-primary-900 text-xs font-bold rounded-full px-1 animate-bounce-subtle">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-primary-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-primary-800 animate-fade-in">
          <div className="px-4 py-3 flex flex-col gap-2">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/products"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Sản phẩm
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
