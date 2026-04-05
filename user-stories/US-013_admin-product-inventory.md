# US-013: Product Inventory Management

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-013                                          |
| Title        | Admin Product Inventory — Stock Toggle          |
| Priority     | Should                                          |
| Story Points | 3                                               |
| Spec Refs    | §3.1 (Product.inStock), §4.2                    |

---

## User Story

> **As an** admin,
> **I want** to view all products and toggle their stock availability,
> **So that** out-of-stock products are correctly reflected on the storefront.

---

## Tasks

### Backend: PATCH Product Endpoint
- [ ] `PATCH /api/products/:id` — update product fields (inStock, price)
- [ ] Add route in `server/src/routes/products.ts`
- [ ] Add controller in `server/src/controllers/productController.ts`
- [ ] Validation: `inStock` must be boolean if provided

### Product List Page (`client/src/pages/admin/ProductListPage.tsx`)
- [ ] Route: `/admin/products`
- [ ] Fetch `GET /api/products` on mount
- [ ] Table: Image thumbnail, Name, Category, Price, Stock status toggle, Date
- [ ] Toggle switch for inStock → PATCH `/api/products/:id`
- [ ] Visual feedback on toggle (optimistic update)
- [ ] Loading & error states

### Integration
- [ ] Toggling inStock OFF → storefront shows "Hết hàng" overlay + disabled "Thêm vào giỏ"
- [ ] Toggling inStock ON → product is purchasable again

### SEO
- [ ] `<Helmet>` with title "Quản Lý Sản Phẩm — Admin Sơn ATA"

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | PATCH /api/products/:id works | curl test |
| 2 | Product list shows all products | Compare with DB |
| 3 | Toggle inStock sends PATCH | Network tab |
| 4 | Storefront reflects inStock change | Refresh homepage |
| 5 | "Hết hàng" badge appears when inStock=false | Visual |
| 6 | Product list responsive | Resize |

---

## Dependencies
- US-003 (GET /api/products)
- US-011 (Admin layout)

## Blocks
- None
