import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Home,
  ChevronRight,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import type { Product } from "../types";
import { fetchProductBySlug } from "../utils/api";
import { formatPrice } from "../utils/format";
import { useCart } from "../context/CartContext";
import QuantitySelector from "../components/QuantitySelector";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductBySlug(slug!);
        if (!cancelled) {
          setProduct(data);
          setMainImage(data.image);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Không thể tải sản phẩm"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  function handleAddToCart() {
    if (!product || !product.inStock) return;
    addItem(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
        <p className="text-surface-500 text-sm">Đang tải sản phẩm...</p>
      </div>
    );
  }

  // ── Error / 404 ──
  if (error || !product) {
    const is404 = error?.includes("not found");
    return (
      <>
        <Helmet>
          <title>
            {is404 ? "Sản phẩm không tồn tại" : "Lỗi"} — Sơn ATA
          </title>
        </Helmet>
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <div className="w-16 h-16 bg-error-500/10 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-error-500" />
          </div>
          <h1 className="text-xl font-bold text-surface-800 mb-2">
            {is404
              ? "Sản phẩm không tồn tại"
              : "Không thể tải sản phẩm"}
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
            {!is404 && (
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-surface-100 text-surface-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-surface-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Thử lại
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  const allImages = product.images?.length
    ? product.images
    : [product.image];

  // ── Specs ──
  const specs = [
    { label: "Trọng lượng", value: product.weight },
    { label: "Độ phủ", value: product.coverage },
    { label: "Thời gian khô", value: product.dryTime },
    { label: "Bề mặt", value: product.finish },
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} — Sơn ATA</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Breadcrumb ── */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-surface-400 mb-8"
        >
          <Link
            to="/"
            className="hover:text-primary-600 transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            to="/"
            className="hover:text-primary-600 transition-colors"
          >
            Sản phẩm
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-surface-700 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* ── Main Content: Image + Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── Image Gallery ── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-80 sm:h-96 lg:h-[28rem] object-cover"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-surface-900/50 flex items-center justify-center">
                  <span className="bg-error-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                    Hết hàng
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      mainImage === img
                        ? "border-primary-500 shadow-md ring-2 ring-primary-500/20"
                        : "border-surface-200 hover:border-surface-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ảnh ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col">
            {/* Category */}
            <span className="text-xs text-surface-400 font-medium uppercase tracking-wider mb-2">
              {product.category?.name}
            </span>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-4">
              {product.name}
            </h1>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-4">
              {product.inStock ? (
                <>
                  <CheckCircle className="w-5 h-5 text-success-500" />
                  <span className="text-sm font-medium text-success-600">
                    Còn hàng
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-error-500" />
                  <span className="text-sm font-medium text-error-600">
                    Hết hàng
                  </span>
                </>
              )}
            </div>

            {/* Price */}
            <p className="text-3xl font-bold text-primary-600 mb-6">
              {formatPrice(product.price)}
            </p>

            {/* Description */}
            <p className="text-surface-600 leading-relaxed mb-6">
              {product.detailDescription || product.description}
            </p>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Specs table */}
            <div className="bg-surface-50 rounded-xl border border-surface-200 overflow-hidden mb-6">
              <h2 className="text-sm font-semibold text-surface-700 px-4 py-3 bg-surface-100 border-b border-surface-200">
                Thông số kỹ thuật
              </h2>
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((s, i) => (
                    <tr
                      key={s.label}
                      className={
                        i < specs.length - 1
                          ? "border-b border-surface-100"
                          : ""
                      }
                    >
                      <td className="px-4 py-3 text-surface-500 w-1/3">
                        {s.label}
                      </td>
                      <td className="px-4 py-3 text-surface-800 font-medium">
                        {s.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 mt-auto pt-4">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={99}
              />
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  !product.inStock
                    ? "bg-surface-200 text-surface-400 cursor-not-allowed"
                    : addedFeedback
                      ? "bg-success-500 text-white"
                      : "bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] shadow-md hover:shadow-lg"
                }`}
              >
                {addedFeedback ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Đã thêm vào giỏ!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ hàng
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
