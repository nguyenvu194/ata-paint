import { Link } from "react-router-dom";
import {
  Paintbrush,
  ArrowRight,
  Shield,
  Truck,
  Star,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Timer,
  Droplets,
  Leaf,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const { products, loading, error } = useProducts();

  return (
    <>
      <Helmet>
        <title>Sơn ATA — Sơn Công Nghiệp & Trang Trí Chất Lượng Cao</title>
        <meta
          name="description"
          content="ATA Paint - Chuyên cung cấp sơn công nghiệp và trang trí chất lượng cao cho mọi công trình tại Việt Nam."
        />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative text-white overflow-hidden min-h-[auto] sm:min-h-[420px] lg:h-[450px]">
        {/* Background image */}
        <img
          src="/images/hero-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blue overlay */}
        <div className="absolute inset-0 bg-primary-950/85 sm:bg-primary-950/80" />

        {/* Content: 60/40 layout */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-10 items-center w-full">
            {/* ── Left: Text (60%) ── */}
            <div className="lg:col-span-3 py-8 sm:py-10 lg:py-0">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5 text-accent-400" />
                <span className="text-accent-400 font-semibold text-[10px] sm:text-xs uppercase tracking-wider">
                  ATA Paint
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-2 sm:mb-3">
                Sơn Công Nghiệp
                <br />
                <span className="text-accent-400">Chất Lượng Cao</span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-primary-200 mb-4 sm:mb-5 leading-relaxed max-w-md">
                Giải pháp sơn toàn diện cho công trình công nghiệp và dân dụng
                — bảo vệ bề mặt, nâng tầm thẩm mỹ cho mọi không gian sống.
              </p>

              {/* Value propositions */}
              <div className="flex flex-col gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Timer className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-400" />
                  </div>
                  <span className="text-xs sm:text-sm text-primary-100">
                    Bền màu trên 10 năm
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Droplets className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-400" />
                  </div>
                  <span className="text-xs sm:text-sm text-primary-100">
                    Chống thấm, chống rêu mốc tối ưu
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-400" />
                  </div>
                  <span className="text-xs sm:text-sm text-primary-100">
                    An toàn cho sức khỏe, thân thiện môi trường
                  </span>
                </div>
              </div>

              <Link
                to="#products"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 bg-accent-400 text-primary-900 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm hover:bg-accent-300 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Xem sản phẩm
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* ── Right: Image (40%) ── */}
            <div className="hidden lg:block lg:col-span-2 h-full">
              <div className="relative h-[450px] w-full">
                <img
                  src="/images/hero-interior.png"
                  alt="Không gian nội thất được sơn bởi Sơn ATA"
                  className="absolute bottom-0 right-0 w-full h-full object-cover rounded-tl-3xl shadow-2xl"
                />
                {/* Subtle gradient blend into the overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-950/60 via-transparent to-transparent rounded-tl-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Bảo Vệ Tối Đa",
              desc: "Chống rỉ sét, chống ăn mòn, chịu nhiệt — bảo vệ bề mặt trong mọi điều kiện khắc nghiệt.",
            },
            {
              icon: Star,
              title: "Chất Lượng Cao",
              desc: "Đạt tiêu chuẩn SSPC, công nghệ tiên tiến từ Nhật Bản và Châu Âu.",
            },
            {
              icon: Truck,
              title: "Giao Hàng Nhanh",
              desc: "Giao hàng toàn quốc, miễn phí vận chuyển đơn hàng trên 5 triệu đồng.",
            },
          ].map((f) => (
            <article
              key={f.title}
              className="bg-white rounded-2xl p-7 shadow-sm border border-surface-200 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold text-surface-800 mb-2">
                {f.title}
              </h2>
              <p className="text-sm text-surface-500 leading-relaxed">
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section
        id="products"
        className="bg-surface-100 border-t border-surface-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-800 mb-3">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-surface-500 max-w-lg mx-auto">
              Khám phá các dòng sơn công nghiệp và trang trí chất lượng cao từ
              ATA Paint
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
