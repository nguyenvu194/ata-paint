import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

// Storefront Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin Pages
import OrderListPage from "./pages/admin/OrderListPage";
import OrderDetailPage from "./pages/admin/OrderDetailPage";
import ProductListPage from "./pages/admin/ProductListPage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <HelmetProvider>
        <CartProvider>
          <Routes>
            {/* ── Storefront ── */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route
                path="/order-success/:id"
                element={<OrderSuccessPage />}
              />
            </Route>

            {/* ── Admin ── */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/orders" replace />} />
              <Route path="orders" element={<OrderListPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
              <Route path="products" element={<ProductListPage />} />
            </Route>

            {/* ── 404 ── */}
            <Route element={<Layout />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

