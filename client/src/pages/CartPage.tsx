import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { createOrder } from "../utils/api";
import QuantitySelector from "../components/QuantitySelector";

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  note: string;
}

interface FormErrors {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
}

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Validation ──
  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.customerName.trim()) errs.customerName = "Vui lòng nhập họ tên";
    if (!form.customerPhone.trim())
      errs.customerPhone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{9,11}$/.test(form.customerPhone.replace(/\s/g, "")))
      errs.customerPhone = "Số điện thoại không hợp lệ";
    if (!form.customerAddress.trim())
      errs.customerAddress = "Vui lòng nhập địa chỉ giao hàng";
    return errs;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  // ── Submit order ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const order = await createOrder({
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        customerEmail: form.customerEmail.trim() || undefined,
        customerAddress: form.customerAddress.trim(),
        note: form.note.trim() || undefined,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });

      clearCart();
      navigate(`/order-success/${order.id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Không thể đặt hàng. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Giỏ Hàng — Sơn ATA</title>
          <meta name="description" content="Xem giỏ hàng và đặt hàng sơn công nghiệp, trang trí ATA Paint." />
        </Helmet>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="w-20 h-20 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-surface-400" />
          </div>
          <h1 className="text-2xl font-bold text-surface-800 mb-2">
            Giỏ hàng trống
          </h1>
          <p className="text-surface-500 mb-8">
            Bạn chưa thêm sản phẩm nào vào giỏ hàng.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Giỏ Hàng — Sơn ATA</title>
        <meta name="description" content="Xem giỏ hàng và đặt hàng sơn công nghiệp, trang trí ATA Paint." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-800 mb-8">
          Giỏ hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <article
                key={item.product.id}
                className="bg-white rounded-2xl border border-surface-200 p-4 sm:p-5 flex gap-4 shadow-sm"
              >
                {/* Thumbnail */}
                <Link
                  to={`/product/${item.product.slug}`}
                  className="shrink-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="text-sm sm:text-base font-semibold text-surface-800 hover:text-primary-600 transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-surface-400 mt-0.5">
                        {formatPrice(item.product.price)} / sản phẩm
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="shrink-0 p-2 text-surface-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                      aria-label={`Xóa ${item.product.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(qty) =>
                        updateQuantity(item.product.id, qty)
                      }
                      min={1}
                      max={99}
                    />
                    <span className="text-base font-bold text-primary-600">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {/* Back to shop link */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-primary-600 transition-colors mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* ── Order Summary + Checkout Form ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm sticky top-20">
              {/* Summary */}
              <div className="p-5 border-b border-surface-100">
                <h2 className="text-lg font-semibold text-surface-800 mb-4">
                  Tóm tắt đơn hàng
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-surface-500">
                    <span>
                      Số lượng ({items.reduce((s, i) => s + i.quantity, 0)} sản
                      phẩm)
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-surface-500">
                    <span>Phí vận chuyển</span>
                    <span className="text-success-600 font-medium">
                      Miễn phí
                    </span>
                  </div>
                </div>
                <div className="border-t border-surface-100 mt-3 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-surface-800">
                    Tổng cộng
                  </span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <h2 className="text-lg font-semibold text-surface-800">
                  Thông tin đặt hàng
                </h2>

                {/* Customer Name */}
                <div>
                  <label
                    htmlFor="customerName"
                    className="flex items-center gap-1.5 text-sm font-medium text-surface-700 mb-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    Họ tên <span className="text-error-500">*</span>
                  </label>
                  <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                      errors.customerName
                        ? "border-error-400 bg-error-50"
                        : "border-surface-300 bg-white"
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-xs text-error-500 mt-1">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="customerPhone"
                    className="flex items-center gap-1.5 text-sm font-medium text-surface-700 mb-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Số điện thoại <span className="text-error-500">*</span>
                  </label>
                  <input
                    id="customerPhone"
                    name="customerPhone"
                    type="tel"
                    value={form.customerPhone}
                    onChange={handleChange}
                    placeholder="0901234567"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                      errors.customerPhone
                        ? "border-error-400 bg-error-50"
                        : "border-surface-300 bg-white"
                    }`}
                  />
                  {errors.customerPhone && (
                    <p className="text-xs text-error-500 mt-1">
                      {errors.customerPhone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="customerEmail"
                    className="flex items-center gap-1.5 text-sm font-medium text-surface-700 mb-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </label>
                  <input
                    id="customerEmail"
                    name="customerEmail"
                    type="email"
                    value={form.customerEmail}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="customerAddress"
                    className="flex items-center gap-1.5 text-sm font-medium text-surface-700 mb-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Địa chỉ giao hàng{" "}
                    <span className="text-error-500">*</span>
                  </label>
                  <input
                    id="customerAddress"
                    name="customerAddress"
                    type="text"
                    value={form.customerAddress}
                    onChange={handleChange}
                    placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${
                      errors.customerAddress
                        ? "border-error-400 bg-error-50"
                        : "border-surface-300 bg-white"
                    }`}
                  />
                  {errors.customerAddress && (
                    <p className="text-xs text-error-500 mt-1">
                      {errors.customerAddress}
                    </p>
                  )}
                </div>

                {/* Note */}
                <div>
                  <label
                    htmlFor="note"
                    className="flex items-center gap-1.5 text-sm font-medium text-surface-700 mb-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Ghi chú
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
                  />
                </div>

                {/* Server error */}
                {submitError && (
                  <div className="flex items-start gap-2 bg-error-50 text-error-700 text-sm px-4 py-3 rounded-xl border border-error-200">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{submitError}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-primary-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Đặt Hàng
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
