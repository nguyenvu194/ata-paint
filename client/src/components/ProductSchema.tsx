// ============================================================
// AIO / GEO — Dynamic Product Schema (JSON-LD)
// Generates structured data for Google, Bing, and AI/LLM engines
// ============================================================

import { Helmet } from "react-helmet-async";
import type { Product } from "../types";

interface ProductSchemaProps {
  product: Product;
  /** Base URL of the website */
  baseUrl?: string;
}

/**
 * Renders a <script type="application/ld+json"> with full Product schema
 * including brand, sku, offers, aggregateRating, and AI-friendly fields.
 *
 * References:
 *  - https://schema.org/Product
 *  - https://developers.google.com/search/docs/appearance/structured-data/product
 */
export default function ProductSchema({
  product,
  baseUrl = "https://atapaint.com",
}: ProductSchemaProps) {
  const productUrl = `${baseUrl}/product/${product.slug}`;
  const imageUrls = product.images?.length
    ? product.images.map((img) =>
        img.startsWith("http") ? img : `${baseUrl}${img}`
      )
    : [
        product.image.startsWith("http")
          ? product.image
          : `${baseUrl}${product.image}`,
      ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.detailDescription || product.description,
    image: imageUrls,
    url: productUrl,

    // ── Brand ──
    brand: {
      "@type": "Brand",
      name: "ATA Paint",
      url: baseUrl,
    },

    // ── SKU & Identifiers ──
    sku: product.id,
    mpn: product.slug,
    productID: product.id,

    // ── Category ──
    category: product.category?.name || "Sơn công nghiệp",

    // ── Material & Specs (AIO: giúp LLM hiểu sản phẩm) ──
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Trọng lượng",
        value: product.weight,
      },
      {
        "@type": "PropertyValue",
        name: "Độ phủ",
        value: product.coverage,
      },
      {
        "@type": "PropertyValue",
        name: "Thời gian khô",
        value: product.dryTime,
      },
      {
        "@type": "PropertyValue",
        name: "Bề mặt hoàn thiện",
        value: product.finish,
      },
    ],

    // ── Aggregate Rating (placeholder — thay bằng dữ liệu thực khi có) ──
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },

    // ── Offers ──
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "VND",
      price: product.price,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Sơn ATA",
        url: baseUrl,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "VN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 5,
            unitCode: "d",
          },
        },
      },
    },

    // ── Breadcrumb (giúp LLM hiểu vị trí sản phẩm trong site) ──
    isPartOf: {
      "@type": "WebSite",
      name: "Sơn ATA",
      url: baseUrl,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData, null, 0)}
      </script>
    </Helmet>
  );
}
