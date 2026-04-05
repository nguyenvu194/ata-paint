# US-003: REST API Endpoints

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-003                                          |
| Title        | Express REST API — Products, Categories, Orders |
| Priority     | Must                                            |
| Story Points | 5                                               |
| Spec Refs    | §4.1 → §4.4                                     |

---

## User Story

> **As a** client application,
> **I want** REST API endpoints for products, categories, and orders,
> **So that** the frontend can fetch product data and submit orders that persist in SQLite.

---

## Tasks

### Route Structure
- [ ] `src/routes/products.ts` — product endpoints
- [ ] `src/routes/categories.ts` — category endpoints
- [ ] `src/routes/orders.ts` — order endpoints
- [ ] Mount all routes under `/api` prefix in `src/index.ts`

### Products API
- [ ] `GET /api/products` — list all products with category, parse JSON fields (images, tags)
- [ ] `GET /api/products/:slug` — single product by slug, 404 if not found

### Categories API
- [ ] `GET /api/categories` — list all categories

### Orders API
- [ ] `POST /api/orders` — create order with items
  - Validate: customerName, customerPhone, customerAddress required
  - Validate: items non-empty, each productId exists, quantity ≥ 1
  - Lookup product prices, calculate totalAmount
  - Create Order + OrderItems in a transaction
  - Return 201 with full order data
- [ ] `GET /api/orders` — list all orders with items (admin)
- [ ] `GET /api/orders/:id` — single order by ID
- [ ] `PATCH /api/orders/:id/status` — update status (validate against enum)

### Controllers
- [ ] `src/controllers/productController.ts`
- [ ] `src/controllers/categoryController.ts`
- [ ] `src/controllers/orderController.ts`

### Error Handling
- [ ] Consistent `{ error: "message" }` format
- [ ] 400 for validation, 404 for not found, 500 for server errors

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | `GET /api/products` → 200 + 6+ products | curl |
| 2 | `GET /api/products/son-chong-ri-ata-cr01` → 200 + product with category | curl |
| 3 | `GET /api/products/invalid-slug` → 404 | curl |
| 4 | `GET /api/categories` → 200 + 2 categories | curl |
| 5 | `POST /api/orders` with valid body → 201 + order | curl |
| 6 | `POST /api/orders` with empty items → 400 | curl |
| 7 | `POST /api/orders` with missing name → 400 | curl |
| 8 | `GET /api/orders` → 200 + orders list | curl |
| 9 | `GET /api/orders/:id` → 200 + order with items | curl |
| 10 | `PATCH /api/orders/:id/status` → 200 + updated status | curl |
| 11 | Order saved in SQLite (verify via `prisma studio`) | DB check |
| 12 | `images` and `tags` returned as arrays, not JSON strings | Response check |

---

## Dependencies
- US-001 (server scaffolding)
- US-002 (Prisma schema & seed data)

## Blocks
- US-005 (Home Page needs product API)
- US-006 (Product Detail needs product API)
- US-008 (Cart/Checkout needs order API)
