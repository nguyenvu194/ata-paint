import { Paintbrush, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-accent-400 rounded-lg flex items-center justify-center">
                <Paintbrush className="w-4 h-4 text-primary-900" />
              </div>
              <span className="text-lg font-bold text-white">
                Sơn <span className="text-accent-400">ATA</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Chuyên cung cấp các dòng sơn công nghiệp và trang trí chất lượng
              cao cho mọi công trình.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Liên kết
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-white transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-sm hover:text-white transition-colors"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm hover:text-white transition-colors"
                >
                  Giỏ hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Liên hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-accent-400 shrink-0" />
                <span>1900 xxxx xx</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-accent-400 shrink-0" />
                <span>info@atapaint.vn</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
                <span>KCN Biên Hòa, Đồng Nai, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-700 mt-8 pt-6 text-center">
          <p className="text-xs text-surface-500">
            © {new Date().getFullYear()} ATA Paint. All rights reserved. —{" "}
            <span className="text-surface-600">E-Commerce Prototype</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
