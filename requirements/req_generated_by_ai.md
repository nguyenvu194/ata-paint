# Technical Requirement Specification

## E-Commerce Prototype — ATA Paint

| Field            | Value                                          |
| ---------------- | ---------------------------------------------- |
| Document Version | 1.0                                            |
| Status           | Draft                                          |
| Created          | 2026-04-01                                     |
| Author           | AI-Generated from internal meeting notes        |
| Source           | `requirements/req_origin.md`                   |

---

## 1. Project Overview

### 1.1 Objective

Build a **client-side only** e-commerce prototype to demonstrate the end-to-end purchasing flow for ATA Paint products. The prototype serves as a visual and functional proof-of-concept to validate the user experience before full-stack development begins.

### 1.2 Scope

| In Scope                                              | Out of Scope                                         |
| ----------------------------------------------------- | ---------------------------------------------------- |
| Product listing (Home page)                           | Backend server / API                                 |
| Product detail page                                   | Database (SQL, NoSQL, etc.)                          |
| Cart Drawer (add / remove / update quantity)          | Payment gateway integration                          |
| Order placement simulation                            | User authentication / registration                   |
| SEO-compliant markup                                  | Inventory management / MES integration               |
| Responsive layout (mobile-first)                      | CRM module                                           |
| Mock data driven UI                                   | Order management admin panel (Phase 2)               |

### 1.3 Strict Constraints

| ID   | Constraint                  | Description                                                                                                        |
| ---- | --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| SC-1 | **No Backend / API / DB**   | Zero server-side components. All logic executes on the client. No HTTP requests to external services.              |
| SC-2 | **Mock Data Only**          | Product and cart data are hardcoded JSON objects embedded in source code. No `fetch()` or `axios` calls.           |
| SC-3 | **SEO Standard**            | Semantic HTML5, friendly URL structure, meta tags (`<title>`, `<meta name="description">`), `alt` on all `<img>`. |
| SC-4 | **Prototype Classification**| This is a demonstration artifact — not production software. No uptime or data-persistence guarantees.              |

---

## 2. Tech Stack

| Layer       | Technology                          | Version / Notes                        |
| ----------- | ----------------------------------- | -------------------------------------- |
| Build Tool  | **Vite**                            | Latest stable                          |
| Framework   | **React**                           | v18+                                   |
| Language    | **TypeScript** (recommended) / JavaScript | `.tsx` / `.jsx`                   |
| Styling     | **Tailwind CSS**                    | v3+                                    |
| Icons       | **Lucide React**                    | `lucide-react` package                 |
| Routing     | **React Router DOM**                | v6+ — enables defined URL structure    |
| State Mgmt  | React Context API or `useState`     | No external state library required     |

---

## 3. Functional Requirements (FR)

### FR-1 — Home Page (Product Listing)

| ID      | Requirement                                                                                              | Priority |
| ------- | -------------------------------------------------------------------------------------------------------- | -------- |
| FR-1.1  | Display a grid/list of all products from mock data.                                                      | Must     |
| FR-1.2  | Each product card SHALL render: thumbnail image, product name, price, and a "View Detail" CTA.           | Must     |
| FR-1.3  | Each product card SHALL include an "Add to Cart" button that adds 1 unit to the cart.                    | Must     |
| FR-1.4  | The page SHALL include a hero/banner section introducing the brand or a featured promotion.              | Should   |
| FR-1.5  | Product cards SHALL support hover/tap interaction states with visual feedback.                            | Should   |
| FR-1.6  | The page URL SHALL be `/` (root).                                                                        | Must     |

### FR-2 — Product Detail Page

| ID      | Requirement                                                                                              | Priority |
| ------- | -------------------------------------------------------------------------------------------------------- | -------- |
| FR-2.1  | Navigating to `/product/:slug` SHALL render the detail view for the matching product.                    | Must     |
| FR-2.2  | The detail view SHALL display: product image(s), name, price, full description, and specifications.      | Must     |
| FR-2.3  | A quantity selector (min: 1) and "Add to Cart" button SHALL be present.                                  | Must     |
| FR-2.4  | If the slug does not match any product, a 404-style message SHALL be shown.                              | Should   |
| FR-2.5  | Breadcrumb navigation SHALL be rendered (Home → Product Name).                                           | Should   |

### FR-3 — Cart Drawer (Side Panel)

| ID      | Requirement                                                                                              | Priority |
| ------- | -------------------------------------------------------------------------------------------------------- | -------- |
| FR-3.1  | A persistent cart icon in the header SHALL display the current item count (badge).                        | Must     |
| FR-3.2  | Clicking the cart icon SHALL open a slide-in drawer from the right side of the viewport.                 | Must     |
| FR-3.3  | The drawer SHALL list all cart items with: thumbnail, name, unit price, quantity control (±), line total. | Must     |
| FR-3.4  | Each item SHALL have a "Remove" action to delete it from the cart.                                       | Must     |
| FR-3.5  | The drawer footer SHALL display the cart subtotal.                                                        | Must     |
| FR-3.6  | A "Place Order" button SHALL trigger a simulated order confirmation (e.g., toast/modal message).         | Must     |
| FR-3.7  | Clicking the overlay or a close button SHALL dismiss the drawer.                                         | Must     |
| FR-3.8  | Cart state SHALL persist across page navigation within the session (React Context / state lifting).      | Must     |

### FR-4 — Shared Layout & Navigation

| ID      | Requirement                                                                                              | Priority |
| ------- | -------------------------------------------------------------------------------------------------------- | -------- |
| FR-4.1  | A global `<header>` with logo, navigation links (Home), and cart icon SHALL be present on all pages.     | Must     |
| FR-4.2  | A global `<footer>` with brand info and placeholder links SHALL be present on all pages.                 | Should   |
| FR-4.3  | Navigation between pages SHALL use client-side routing (no full page reload).                             | Must     |
| FR-4.4  | The layout SHALL be responsive: mobile (≤ 640px), tablet (641–1024px), desktop (≥ 1025px).               | Must     |

---

## 4. SEO & Accessibility Specifications

### 4.1 Semantic HTML

| Rule | Description                                                                                     |
| ---- | ----------------------------------------------------------------------------------------------- |
| S-1  | Use `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>` per HTML5 spec.         |
| S-2  | Each page SHALL have exactly one `<h1>`. Sub-headings follow `<h2>` → `<h3>` hierarchy.         |
| S-3  | Interactive elements SHALL use native HTML (`<button>`, `<a>`) — never `<div onClick>`.         |

### 4.2 Meta Tags

| Tag                        | Home Page Value (example)                              | Detail Page Value (example)                         |
| -------------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| `<title>`                  | `Sơn ATA — Sơn Công Nghiệp Chất Lượng Cao`           | `{product.name} — Sơn ATA`                         |
| `<meta name="description">`| `Khám phá các sản phẩm sơn công nghiệp ATA...`       | `{product.description} — Đặt hàng ngay tại ATA.`   |

> Each route change SHALL dynamically update `<title>` and `<meta name="description">` via `react-helmet-async` or equivalent.

### 4.3 Image Accessibility

| Rule | Description                                                                 |
| ---- | --------------------------------------------------------------------------- |
| A-1  | Every `<img>` element SHALL have a descriptive `alt` attribute.             |
| A-2  | Decorative images SHALL use `alt=""` and `aria-hidden="true"`.              |

### 4.4 URL Structure

| Page           | URL Pattern           | Example                    |
| -------------- | --------------------- | -------------------------- |
| Home           | `/`                   | `/`                        |
| Product Detail | `/product/:slug`      | `/product/son-chong-ri-01` |

> Slugs SHALL be URL-safe, lowercase, hyphen-separated strings derived from the product name.

---

## 5. Data Schema (Mock Data)

### 5.1 `Product` Object

```typescript
interface Product {
  id: string;                  // Unique identifier (e.g., "prod-001")
  name: string;                // Display name (e.g., "Sơn Chống Rỉ ATA-CR01")
  slug: string;                // URL-friendly identifier (e.g., "son-chong-ri-ata-cr01")
  price: number;               // Unit price in VND (e.g., 450000)
  currency: string;            // ISO 4217 code — always "VND"
  description: string;         // Short description for listing cards
  detailDescription: string;   // Full description for product detail page
  image: string;               // Primary image path or URL
  images: string[];            // Gallery images for detail page
  category: string;            // Product category (e.g., "Sơn Công Nghiệp")
  specifications: {
    weight: string;            // e.g., "5kg"
    coverage: string;          // e.g., "10-12 m²/lít"
    dryTime: string;           // e.g., "2-4 giờ"
    finish: string;            // e.g., "Bóng mờ"
    [key: string]: string;     // Additional spec fields
  };
  inStock: boolean;            // Availability flag
  tags: string[];              // Search/filter tags
}
```

### 5.2 `CartItem` Object

```typescript
interface CartItem {
  productId: string;           // References Product.id
  name: string;                // Denormalized product name
  image: string;               // Denormalized product image
  price: number;               // Unit price at time of addition
  quantity: number;            // Number of units (min: 1)
}
```

### 5.3 Mock Data Requirements

| ID    | Requirement                                                                                   |
| ----- | --------------------------------------------------------------------------------------------- |
| MD-1  | A minimum of **6 products** SHALL be defined in the mock data set.                            |
| MD-2  | Products SHALL span at least **2 distinct categories**.                                       |
| MD-3  | All image references SHALL resolve to valid assets (local or placeholder service).            |
| MD-4  | Price values SHALL be realistic for the Vietnamese paint market.                              |

---

## 6. Non-Functional Requirements

| ID    | Requirement                                                                                   | Target           |
| ----- | --------------------------------------------------------------------------------------------- | ---------------- |
| NF-1  | First Contentful Paint (FCP)                                                                  | < 1.5s (dev)     |
| NF-2  | All interactive elements SHALL have unique `id` attributes for testability.                   | 100% coverage    |
| NF-3  | The application SHALL render correctly on Chrome, Safari, Firefox (latest 2 versions).        | Cross-browser    |
| NF-4  | Zero runtime errors in browser console during standard user flows.                            | Zero errors      |
| NF-5  | Code SHALL be modular — one component per file, shared utilities in `/utils` or `/lib`.       | Convention       |

---

## 7. User Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [1] User lands on Home Page (/)                                │
│       ↓                                                         │
│  [2] Browses product grid                                       │
│       ├── Clicks "Add to Cart" → item added, badge updates      │
│       └── Clicks product card → navigates to Detail Page        │
│                ↓                                                │
│  [3] Product Detail Page (/product/:slug)                       │
│       ├── Selects quantity                                       │
│       └── Clicks "Add to Cart" → item added                    │
│                ↓                                                │
│  [4] Clicks Cart Icon → Cart Drawer opens                       │
│       ├── Adjusts quantities (±)                                │
│       ├── Removes items                                         │
│       └── Clicks "Place Order"                                  │
│                ↓                                                │
│  [5] Order Confirmation (toast/modal)                           │
│       └── Cart resets, user returns to browsing                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. File Structure (Recommended)

```
src/
├── assets/                # Static images, fonts
├── components/            # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── CartDrawer.tsx
│   └── QuantitySelector.tsx
├── context/
│   └── CartContext.tsx     # Cart state provider
├── data/
│   └── products.ts        # Mock product data (hardcoded JSON)
├── pages/
│   ├── HomePage.tsx
│   └── ProductDetailPage.tsx
├── types/
│   └── index.ts           # Product, CartItem interfaces
├── App.tsx                # Root component with Router
├── main.tsx               # Entry point
└── index.css              # Tailwind directives + custom styles
```

---

## 9. Acceptance Criteria

The prototype SHALL be considered complete when **all** of the following are verified:

- [ ] Home page renders product grid from mock data
- [ ] Clicking a product navigates to `/product/:slug` with correct data
- [ ] "Add to Cart" from both Home and Detail pages updates cart state
- [ ] Cart Drawer opens/closes correctly and displays accurate totals
- [ ] Quantity adjustments (increment, decrement, remove) work as expected
- [ ] "Place Order" triggers confirmation feedback and resets the cart
- [ ] Page `<title>` and `<meta description>` update on each route change
- [ ] All `<img>` tags have descriptive `alt` attributes
- [ ] Semantic HTML structure passes validation (no `<div>` abuse)
- [ ] Layout is responsive across mobile, tablet, and desktop breakpoints
- [ ] Zero console errors during standard user flow
- [ ] No backend calls (`fetch`, `axios`, `XMLHttpRequest`) exist in the codebase

---

*End of Technical Requirement Specification*
