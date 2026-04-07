// ============================================================
// AIO / GEO — FAQ Schema Component
// Renders FAQ as both visible content AND JSON-LD structured data
// Optimized for AI/LLM extraction and voice search
// ============================================================

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  /** List of FAQ items to render */
  items: FAQItem[];
  /** Section title */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * Renders an accessible FAQ accordion with JSON-LD FAQPage schema.
 * 
 * AIO Benefits:
 * - JSON-LD makes FAQs directly extractable by LLMs
 * - Visible accordion provides context for crawlers
 * - Long-tail questions optimized for voice search & AI chatbot
 */
export default function FAQSchema({
  items,
  title = "Câu hỏi thường gặp",
  className = "",
}: FAQSchemaProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // ── JSON-LD Schema ──
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData, null, 0)}
        </script>
      </Helmet>

      <section className={`py-12 ${className}`} aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="text-2xl font-bold text-surface-900 mb-8 text-center"
        >
          {title}
        </h2>

        <div className="max-w-3xl mx-auto space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-surface-200 overflow-hidden transition-shadow hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-sm sm:text-base font-semibold text-surface-800 pr-2">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-surface-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-5 pb-4 text-sm text-surface-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

// ============================================================
// Pre-built FAQ data for ATA Paint
// Long-tail questions optimized for AI/voice search
// ============================================================

export const ATA_PAINT_FAQS: FAQItem[] = [
  {
    question:
      "Sơn chống rỉ ATA có thể sử dụng cho bề mặt kim loại đã bị oxy hóa không?",
    answer:
      "Có. Sơn chống rỉ ATA được thiết kế để bám dính tốt trên bề mặt kim loại đã bị oxy hóa nhẹ. Tuy nhiên, để đạt hiệu quả tối ưu, bạn nên xử lý bề mặt bằng cách đánh rỉ cơ học hoặc dùng dung dịch chuyển rỉ trước khi sơn. Lớp sơn chống rỉ ATA có khả năng bảo vệ lên đến 8-10 năm trong điều kiện thời tiết Việt Nam.",
  },
  {
    question:
      "Sơn epoxy hai thành phần của ATA Paint khác gì so với sơn phủ thông thường?",
    answer:
      "Sơn epoxy hai thành phần (2K) của ATA Paint gồm phần nhựa (resin) và phần đóng rắn (hardener), khi trộn sẽ tạo phản ứng hóa học cho lớp phủ cứng, chống mài mòn, chống hóa chất vượt trội. So với sơn thông thường, sơn epoxy ATA có độ bám dính gấp 3 lần, chịu được axit/kiềm loãng, và phù hợp cho sàn nhà xưởng, bể chứa nước, và kết cấu thép công nghiệp.",
  },
  {
    question:
      "Nhiệt độ tối đa mà sơn chịu nhiệt ATA có thể chịu được là bao nhiêu?",
    answer:
      "Dòng sơn chịu nhiệt ATA có nhiều cấp độ chịu nhiệt: 200°C (sơn chịu nhiệt tiêu chuẩn), 400°C (sơn chịu nhiệt trung bình), và 600°C (sơn chịu nhiệt cao cấp). Dòng 600°C phù hợp cho ống khói, lò hơi, và thiết bị công nghiệp. Tất cả đều giữ màu tốt và không bong tróc trong điều kiện nhiệt độ cao liên tục.",
  },
  {
    question:
      "Làm thế nào để tính toán lượng sơn ATA cần dùng cho diện tích sàn nhà xưởng?",
    answer:
      "Công thức: Lượng sơn (lít) = Diện tích (m²) ÷ Độ phủ (m²/lít/lớp) × Số lớp. Ví dụ: sàn nhà xưởng 1.000m², sơn epoxy ATA có độ phủ 8-10 m²/lít/lớp, cần 2 lớp → cần khoảng 200-250 lít. Lưu ý: bề mặt gồ ghề cần thêm 10-15%. Liên hệ đội ngũ kỹ thuật ATA qua hotline 1900-xxxx để được tư vấn chính xác theo công trình cụ thể.",
  },
  {
    question:
      "Sơn ATA có đạt tiêu chuẩn an toàn sức khỏe và thân thiện môi trường không?",
    answer:
      "Có. Toàn bộ dòng sản phẩm ATA Paint đạt tiêu chuẩn TCVN về hàm lượng VOC (Volatile Organic Compounds) thấp, đảm bảo an toàn cho người thi công và sử dụng. Các dòng sơn nước nội thất ATA có hàm lượng VOC dưới 50 g/l — thấp hơn mức quy định quốc gia. Sơn ATA không chứa chì, thủy ngân, và các kim loại nặng độc hại.",
  },
];
