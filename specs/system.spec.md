# System Specification

## ATA Paint — E-Commerce Full-Stack Prototype

| Field            | Value                                                   |
| ---------------- | ------------------------------------------------------- |
| Spec Version     | 2.0                                                     |
| Status           | Ready for Decomposition                                 |
| Created          | 2026-04-01                                              |
| Last Updated     | 2026-04-01 (v2.0 — Full-stack migration with SQLite)    |
| Derived From     | `requirements/req_generated_by_ai.md` v1.0              |
| Architecture     | Full-Stack Monorepo (Client SPA + REST API + SQLite)    |
| Classification   | Functional Prototype — No Docker, no external DB server |

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Database Schema (SQLite + Prisma)](#3-database-schema-sqlite--prisma)
4. [API Specification (REST)](#4-api-specification-rest)
5. [Client Application](#5-client-application)
6. [Component Specifications](#6-component-specifications)
7. [State Management](#7-state-management)
8. [Routing & Navigation](#8-routing--navigation)
9. [SEO & Accessibility](#9-seo--accessibility)
10. [Responsive Design](#10-responsive-design)
11. [UI/UX Interactions](#11-uiux-interactions)
12. [Project Structure](#12-project-structure)
13. [Build & Development](#13-build--development)
14. [Verification Matrix](#14-verification-matrix)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              BROWSER                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     CLIENT (React SPA)                            │  │
│  │  Vite + React + TypeScript + Tailwind CSS v4                      │  │
│  │  Pages: Home, ProductDetail, Cart, OrderSuccess                   │  │
│  │  State: React Context (cart) + API calls (products, orders)       │  │
│  └───────────────────┬───────────────────────────────────────────────┘  │
│                      │ HTTP (fetch / REST)                              │
└──────────────────────┼──────────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         SERVER (Node.js + Express)                       │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────────┐ │
│  │  Routes/API    │──│  Controllers   │──│  Prisma ORM                │ │
│  │  /api/products │  │  Business logic│  │  Schema → SQLite file      │ │
│  │  /api/orders   │  │                │  │  (server/prisma/dev.db)    │ │
│  │  /api/categories│ │                │  │                            │ │
│  └────────────────┘  └────────────────┘  └──────────┬─────────────────┘ │
│                                                      │                   │
│                                          ┌───────────▼───────────────┐   │
│                                          │    SQLite Database        │   │
│                                          │    (file: dev.db)         │   │
│                                          │    Tables:                │   │
│                                          │    - Product              │   │
│                                          │    - Category             │   │
│                                          │    - Order                │   │
│                                          │    - OrderItem            │   │
│                                          └───────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architectural Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Database | SQLite (file-based) | Zero config, no server process, portable single-file DB |
| ORM | Prisma | Type-safe queries, auto-generated client, easy migrations |
| API Style | REST (Express.js) | Simple, well-understood, fast to implement |
| Client-Server Split | Monorepo (`/client` + `/server`) | Single repo, simple dev workflow |
| No Docker | ✅ | SQLite is embedded — no DB container needed |
| No Auth | ✅ | Out of scope for prototype |

### 1.3 Data Flow: Order Placement

```
[1] User browses products          → GET /api/products (from SQLite)
[2] User adds to cart               → Client-side state (React Context)
[3] User clicks "Đặt Hàng"         → POST /api/orders (body: cart items + customer info)
[4] Server validates & writes       → Prisma creates Order + OrderItems in SQLite
[5] Server returns order            → { orderId, status: "confirmed" }
[6] Client shows confirmation       → Redirect to /order-success/:id
[7] Admin queries orders            → GET /api/orders (reads from same SQLite file)
```

---

## 2. Technology Stack

### 2.1 Server (`/server`)

| Package | Version | Purpose |
| --- | --- | --- |
| `express` | ^4.21 | HTTP framework |
| `@prisma/client` | latest | ORM client (generated) |
| `prisma` | latest | CLI for migrations & schema |
| `cors` | ^2.8 | Cross-origin support (dev) |
| `typescript` | ^5.x | Type safety |
| `tsx` | latest | Dev runner (ts-node replacement) |
| `nodemon` | latest | Auto-restart on changes |

### 2.2 Client (`/client`)

| Package | Version | Purpose |
| --- | --- | --- |
| `react` | ^19.x | UI framework |
| `react-dom` | ^19.x | DOM renderer |
| `react-router-dom` | ^7.x | Client-side routing |
| `react-helmet-async` | ^3.x | Dynamic SEO head |
| `lucide-react` | latest | Icon library |
| `tailwindcss` | ^4.x | Utility-first CSS (v4, CSS-first) |
| `@tailwindcss/vite` | ^4.x | Vite integration |
| `vite` | ^8.x | Build tool & dev server |
| `typescript` | ^5.x | Type safety |

### 2.3 Explicitly Excluded

| Technology | Reason |
| --- | --- |
| Docker / Docker Compose | SQLite is embedded, no infrastructure needed |
| PostgreSQL / MySQL | Overkill for prototype; SQLite is sufficient |
| NextJS / SSR | Client SPA is adequate for demo purposes |
| Redux / Zustand | React Context is sufficient for cart state |
| Authentication | Out of scope |

---

## 3. Database Schema (SQLite + Prisma)

### 3.1 Prisma Schema

```prisma
// server/prisma/schema.prisma

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  image       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  products    Product[]
}

model Product {
  id                String      @id @default(cuid())
  name              String
  slug              String      @unique
  price             Int         // Price in VND (integer, no decimals needed)
  description       String      // Short description
  detailDescription String      // Full description for detail page
  image             String      // Primary image URL
  images            String      // JSON string array of gallery image URLs
  weight            String      // e.g., "5kg"
  coverage          String      // e.g., "10-12 m²/lít"
  dryTime           String      // e.g., "2-4 giờ"
  finish            String      // e.g., "Bóng mờ"
  inStock           Boolean     @default(true)
  tags              String      // JSON string array of tags
  categoryId        String
  category          Category    @relation(fields: [categoryId], references: [id])
  orderItems        OrderItem[]
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  @@index([categoryId])
  @@index([slug])
}

model Order {
  id              String      @id @default(cuid())
  customerName    String
  customerPhone   String
  customerEmail   String?
  customerAddress String
  note            String?
  status          String      @default("pending") // pending | confirmed | shipping | delivered | cancelled
  totalAmount     Int         // Total in VND
  items           OrderItem[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  quantity  Int
  unitPrice Int     // Price at time of order (snapshot)
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])

  @@index([orderId])
  @@index([productId])
}
```

### 3.2 Design Notes

| Topic | Decision |
| --- | --- |
| Price type | `Int` (VND has no decimals — 450000 not 450000.50) |
| Images array | Stored as JSON string in SQLite (no native array type) |
| Tags array | Stored as JSON string — parsed on read by API |
| Slug | Unique index for URL-friendly lookups |
| Order status | String enum: `pending → confirmed → shipping → delivered → cancelled` |
| `unitPrice` in OrderItem | Snapshot of price at order time (decoupled from product price changes) |
| Cascade delete | Deleting an Order cascades to its OrderItems |

### 3.3 Seed Data

The seed script (`server/prisma/seed.ts`) SHALL populate:

- **2 Categories**: "Sơn Công Nghiệp", "Sơn Trang Trí"
- **6+ Products**: Realistic ATA Paint products with Unsplash images
- **0 Orders**: Orders are created via the API at runtime

---

## 4. API Specification (REST)

### 4.1 Base URL

```
Development: http://localhost:3001/api
```

### 4.2 Endpoints

#### Products

| Method | Path | Description | Response |
| --- | --- | --- | --- |
| `GET` | `/api/products` | List all products (with category) | `Product[]` |
| `GET` | `/api/products/:slug` | Get single product by slug | `Product` or 404 |

**GET /api/products** Response:
```json
[
  {
    "id": "clx...",
    "name": "Sơn Chống Rỉ ATA-CR01",
    "slug": "son-chong-ri-ata-cr01",
    "price": 450000,
    "description": "Sơn chống rỉ cao cấp...",
    "image": "https://images.unsplash.com/...",
    "images": ["url1", "url2"],
    "category": { "id": "...", "name": "Sơn Công Nghiệp", "slug": "son-cong-nghiep" },
    "inStock": true,
    "tags": ["chống rỉ", "công nghiệp"]
  }
]
```

> Note: `images` and `tags` are returned as parsed arrays by the API (not raw JSON strings).

#### Categories

| Method | Path | Description | Response |
| --- | --- | --- | --- |
| `GET` | `/api/categories` | List all categories | `Category[]` |

#### Orders

| Method | Path | Description | Request Body | Response |
| --- | --- | --- | --- | --- |
| `POST` | `/api/orders` | Place a new order | See below | `Order` with items |
| `GET` | `/api/orders` | List all orders (admin) | — | `Order[]` with items |
| `GET` | `/api/orders/:id` | Get single order | — | `Order` with items |
| `PATCH` | `/api/orders/:id/status` | Update order status | `{ status }` | Updated `Order` |

**POST /api/orders** Request Body:
```json
{
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0901234567",
  "customerEmail": "a@email.com",
  "customerAddress": "123 Nguyễn Huệ, Q.1, TP.HCM",
  "note": "Giao buổi sáng",
  "items": [
    { "productId": "clx...", "quantity": 2 },
    { "productId": "cly...", "quantity": 1 }
  ]
}
```

**POST /api/orders** Response:
```json
{
  "id": "clz...",
  "customerName": "Nguyễn Văn A",
  "status": "pending",
  "totalAmount": 1220000,
  "items": [
    { "productId": "clx...", "quantity": 2, "unitPrice": 450000, "product": { "name": "..." } }
  ],
  "createdAt": "2026-04-01T..."
}
```

### 4.3 Error Handling

| Status Code | Usage |
| --- | --- |
| `200` | Successful GET/PATCH |
| `201` | Successful POST (created) |
| `400` | Validation error (missing fields, empty cart) |
| `404` | Resource not found |
| `500` | Server error |

Error response format:
```json
{ "error": "Descriptive error message" }
```

### 4.4 Validation Rules

| Field | Rule |
| --- | --- |
| `customerName` | Required, min 2 chars |
| `customerPhone` | Required, 10-11 digits |
| `customerAddress` | Required, min 5 chars |
| `items` | Required, non-empty array |
| `items[].productId` | Must exist in Product table |
| `items[].quantity` | Integer, min 1 |
| `status` (PATCH) | Must be one of: `pending`, `confirmed`, `shipping`, `delivered`, `cancelled` |

---

## 5. Client Application

### 5.1 Pages

| Route | Page Component | Data Source | Description |
| --- | --- | --- | --- |
| `/` | `HomePage` | `GET /api/products` | Product grid with hero section |
| `/product/:slug` | `ProductDetailPage` | `GET /api/products/:slug` | Full product view |
| `/cart` | `CartPage` | Local state (Context) | Cart review + checkout form |
| `/order-success/:id` | `OrderSuccessPage` | `GET /api/orders/:id` | Order confirmation |
| `*` | `NotFoundPage` | — | 404 fallback |

### 5.2 Data Fetching Pattern

```typescript
// Custom hook pattern
function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
```

### 5.3 Cart → Order Flow

```
[1] User adds items to cart (React Context, persisted in localStorage)
[2] User navigates to /cart
[3] User fills checkout form (name, phone, address, note)
[4] User clicks "Đặt Hàng"
[5] Client sends POST /api/orders with cart items + customer info
[6] Server creates Order + OrderItems in SQLite, returns order data
[7] Client clears cart (Context + localStorage)
[8] Client redirects to /order-success/:orderId
[9] OrderSuccessPage fetches order details via GET /api/orders/:id
```

---

## 6. Component Specifications

### 6.1 Header

- `<header>` with `<nav>`: logo (→ `/`), nav links, cart icon with badge
- Cart badge: total item count from `useCart()`
- Click cart icon → navigate to `/cart`

### 6.2 ProductCard

- `<article>`: image (`alt`), name, category, price, "Xem chi tiết" link, "Thêm vào giỏ" button
- Hover: `scale(1.02)` + shadow elevation (200ms)

### 6.3 ProductDetailPage

- Image gallery (main + thumbnails)
- Product info: name, category, price, full description
- Specifications table
- QuantitySelector + "Thêm vào giỏ hàng"
- Breadcrumb: Home → Product Name

### 6.4 CartPage (NEW — replaces CartDrawer)

- Full page at `/cart` (not a drawer)
- Cart items table: image, name, price, qty controls, line total, remove
- If empty → "Giỏ hàng trống" + "Tiếp tục mua sắm" link
- Checkout form: customerName, customerPhone, customerEmail (optional), customerAddress, note (optional)
- Order summary: subtotal display
- "Đặt Hàng" button → POST /api/orders → redirect to success page
- Form validation before submit

### 6.5 OrderSuccessPage (NEW)

- Fetches order by ID from API
- Displays: order ID, status, customer info, item list, total
- "Tiếp tục mua sắm" link → home

### 6.6 Footer

- `<footer>`: brand info, placeholder links

---

## 7. State Management

### 7.1 Cart Context (Client-side)

```typescript
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}
```

### 7.2 Persistence

- Cart state synced to `localStorage` (key: `"ata-cart"`)
- Survives page refresh (F5)
- Cleared after successful order placement

### 7.3 Product Data

- **NOT** stored in context — fetched via API on each page that needs it
- Loading & error states handled in custom hooks

---

## 8. Routing & Navigation

### 8.1 Route Table

| Path | Component | SEO Title |
| --- | --- | --- |
| `/` | `HomePage` | `Sơn ATA — Sơn Công Nghiệp Chất Lượng Cao` |
| `/product/:slug` | `ProductDetailPage` | `{name} — Sơn ATA` |
| `/cart` | `CartPage` | `Giỏ Hàng — Sơn ATA` |
| `/order-success/:id` | `OrderSuccessPage` | `Đặt Hàng Thành Công — Sơn ATA` |
| `*` | `NotFoundPage` | `Trang Không Tồn Tại — Sơn ATA` |

### 8.2 ScrollToTop

`ScrollToTop` component inside `<BrowserRouter>` — `window.scrollTo(top)` on every `pathname` change.

### 8.3 Navigation Rules

- All internal links use `<Link>` / `<NavLink>` (no full-page reloads)
- Active link styling via `NavLink` `isActive`

---

## 9. SEO & Accessibility

### 9.1 Semantic HTML (MANDATORY)

| Element | Usage |
| --- | --- |
| `<header>` | Site-wide top bar — one per page in Layout |
| `<nav>` | Navigation within header |
| `<main>` | Page content — exactly one per page |
| `<section>` | Logical content groups |
| `<article>` | Product cards |
| `<footer>` | Site footer |
| `<h1>` | One per page — page title |

### 9.2 Meta Tags

- `react-helmet-async` updates `<title>` and `<meta description>` per route
- `<html lang="vi">`

### 9.3 Image Alt Policy

- All `<img>` must have descriptive `alt`
- Decorative images: `alt="" aria-hidden="true"`

---

## 10. Responsive Design

| Breakpoint | Name | Grid Columns |
| --- | --- | --- |
| 0–640px | Mobile | 1 col |
| 641–1024px | Tablet | 2 col |
| ≥1025px | Desktop | 3–4 col |

---

## 11. UI/UX Interactions

| Element | Animation | Duration |
| --- | --- | --- |
| Product Card hover | `scale(1.02)` + shadow | 200ms |
| Cart badge | Bounce on add | 150ms |
| Add to Cart | Color feedback flash | 300ms |
| Page transitions | No jarring jumps | — |
| Loading states | Skeleton / spinner | — |

---

## 12. Project Structure

```
e-commerce-prototype/
├── requirements/
│   ├── req_origin.md
│   └── req_generated_by_ai.md
├── specs/
│   └── system.spec.md              # THIS FILE
├── user-stories/
│   └── US-*.md
│
├── server/                          # ━━━ BACKEND ━━━
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   ├── seed.ts                 # Seed data script
│   │   └── dev.db                  # SQLite database file (gitignored)
│   └── src/
│       ├── index.ts                # Express app entry point
│       ├── routes/
│       │   ├── products.ts         # /api/products routes
│       │   ├── categories.ts       # /api/categories routes
│       │   └── orders.ts           # /api/orders routes
│       ├── controllers/
│       │   ├── productController.ts
│       │   ├── categoryController.ts
│       │   └── orderController.ts
│       └── lib/
│           └── prisma.ts           # Prisma client singleton
│
├── client/                          # ━━━ FRONTEND ━━━
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css               # Tailwind v4 @theme config
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── Footer.tsx
│       │   ├── Layout.tsx
│       │   ├── ProductCard.tsx
│       │   ├── QuantitySelector.tsx
│       │   ├── ScrollToTop.tsx
│       │   └── LoadingSpinner.tsx
│       ├── context/
│       │   └── CartContext.tsx
│       ├── hooks/
│       │   ├── useProducts.ts
│       │   └── useOrder.ts
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── ProductDetailPage.tsx
│       │   ├── CartPage.tsx
│       │   ├── OrderSuccessPage.tsx
│       │   └── NotFoundPage.tsx
│       ├── types/
│       │   └── index.ts
│       └── utils/
│           ├── format.ts           # formatPrice()
│           └── api.ts              # API base URL + fetch helpers
│
└── .gitignore
```

---

## 13. Build & Development

### 13.1 Server Setup

```bash
cd server
npm init -y
npm install express cors @prisma/client
npm install -D typescript @types/express @types/cors @types/node tsx nodemon prisma
npx tsc --init
npx prisma init --datasource-provider sqlite
# Edit schema.prisma → add models
npx prisma migrate dev --name init
npx prisma db seed
```

### 13.2 Client Setup

```bash
cd client
npx -y create-vite@latest ./ --template react-ts --no-interactive
npm install react-router-dom react-helmet-async lucide-react
npm install -D tailwindcss @tailwindcss/vite
```

### 13.3 Development Workflow

```bash
# Terminal 1: Server (port 3001)
cd server && npm run dev

# Terminal 2: Client (port 5173)
cd client && npm run dev
```

Client Vite dev server proxies API calls or uses `http://localhost:3001` directly with CORS.

### 13.4 Server Scripts (`server/package.json`)

```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## 14. Verification Matrix

| Req ID | Description | Verification | Pass Criteria |
| --- | --- | --- | --- |
| DB-1 | SQLite file created | Check `server/prisma/dev.db` exists | File present after migration |
| DB-2 | Schema has 4 tables | `prisma studio` or SQL query | Product, Category, Order, OrderItem |
| DB-3 | Seed data loaded | `GET /api/products` | Returns 6+ products |
| API-1 | List products | `curl localhost:3001/api/products` | 200 + JSON array |
| API-2 | Get product by slug | `curl localhost:3001/api/products/son-chong-ri-ata-cr01` | 200 + single product |
| API-3 | List categories | `curl localhost:3001/api/categories` | 200 + JSON array |
| API-4 | Create order | `POST /api/orders` with valid body | 201 + order with items |
| API-5 | Validation rejects empty cart | `POST /api/orders` with empty items | 400 + error message |
| API-6 | List orders (admin) | `GET /api/orders` | 200 + orders array |
| API-7 | Update order status | `PATCH /api/orders/:id/status` | 200 + updated order |
| UI-1 | Home renders product grid | Open `http://localhost:5173` | 6+ products from API |
| UI-2 | Product detail page | Navigate to `/product/:slug` | Full product info |
| UI-3 | Add to cart | Click "Thêm vào giỏ" | Cart count increments |
| UI-4 | Cart page | Navigate to `/cart` | Items listed, checkout form |
| UI-5 | Order placement | Fill form + submit | Order created in DB, redirect to success |
| UI-6 | Order success | `/order-success/:id` | Order details displayed |
| UI-7 | Cart persists on refresh | F5 with items in cart | Items restored |
| SEO-1 | Dynamic meta tags | Check `<title>` on each page | Unique per route |
| SEO-2 | Semantic HTML | DOM audit | `<header>`, `<main>`, `<footer>` present |
| SEO-3 | All images have `alt` | `querySelectorAll('img:not([alt])')` | 0 results |
| RWD-1 | Responsive layout | Resize to 640/1024/1280px | Grid adapts |
| NF-1 | Zero console errors | DevTools during full flow | 0 errors |

---

*End of System Specification v2.0 — Ready for `/decompose`*
