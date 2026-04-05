import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const { products, loading, error } = useProducts();

  return (
    <>
      <Helmet>
        <title>Sản Phẩm — Sơn ATA</title>
        <meta
          name="description"
          content="Danh sách đầy đủ các dòng sơn công nghiệp và trang trí chất lượng cao từ ATA Paint."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-800 mb-2">
            Tất cả sản phẩm
          </h1>
          <p className="text-surface-500">
            Khám phá đầy đủ các dòng sơn công nghiệp và trang trí từ ATA Paint
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
            <p className="text-surface-500 text-sm">
              Đang tải sản phẩm...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-error-500/10 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-error-500" />
            </div>
            <p className="text-surface-700 font-medium mb-2">
              Không thể tải sản phẩm
            </p>
            <p className="text-surface-500 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <>
            <p className="text-sm text-surface-400 mb-6">
              {products.length} sản phẩm
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
