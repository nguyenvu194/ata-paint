import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 — Không tìm thấy trang | Sơn ATA</title>
        <meta name="description" content="Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="text-8xl font-bold text-surface-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-surface-800 mb-2">
          Không tìm thấy trang
        </h1>
        <p className="text-surface-500 mb-8">
          Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-surface-100 text-surface-700 px-5 py-2.5 rounded-xl font-medium hover:bg-surface-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
        </div>
      </div>
    </>
  );
}
