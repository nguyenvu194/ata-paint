import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const isOutOfStock = !product.inStock;

  return (
    <article
      className={`group bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isOutOfStock ? "opacity-75" : ""
      }`}
    >
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-surface-900/60 flex items-center justify-center">
            <span className="bg-error-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Hết hàng
            </span>
          </div>
        )}
        {!isOutOfStock && product.tags.length > 0 && (
          <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {product.tags[0]}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category */}
        <span className="text-xs text-surface-400 font-medium uppercase tracking-wider mb-1">
          {product.category?.name}
        </span>

        {/* Name */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-base font-semibold text-surface-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-surface-500 mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Price + Actions */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/product/${product.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-surface-100 text-surface-700 py-2.5 rounded-xl text-sm font-medium hover:bg-surface-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Xem chi tiết
            </Link>
            <button
              onClick={() => addItem(product)}
              disabled={isOutOfStock}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isOutOfStock
                  ? "bg-surface-200 text-surface-400 cursor-not-allowed"
                  : "bg-primary-600 text-white hover:bg-primary-700 active:scale-95 shadow-sm hover:shadow-md"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
