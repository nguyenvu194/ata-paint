# US-008: Cart Page & Checkout → Order in SQLite

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-008                                          |
| Title        | Cart Page with Checkout Form & Order Submission  |
| Priority     | Must                                            |
| Story Points | 5                                               |
| Spec Refs    | §5.1, §5.3, §6.4                                |

---

## User Story

> **As a** customer,
> **I want** to review my cart, fill in my delivery details, and place an order that gets saved to the database,
> **So that** my order is recorded and can be processed.

---

## Tasks

### Cart Page (`client/src/pages/CartPage.tsx`)
- [ ] Route: `/cart`
- [ ] Cart items table: thumbnail, name, unit price, qty controls (±), line total, remove button
- [ ] Empty state: "Giỏ hàng trống" + link to home
- [ ] Order summary with subtotal

### Checkout Form
- [ ] Fields: customerName (required), customerPhone (required), customerEmail, customerAddress (required), note
- [ ] Client-side validation before submit
- [ ] Form state management (useState)

### Order Submission
- [ ] "Đặt Hàng" button → `POST /api/orders` with cart items + customer info
- [ ] Loading state while submitting
- [ ] On success: `clearCart()` → redirect to `/order-success/:orderId`
- [ ] On error: show error message, keep form data

### SEO
- [ ] `<Helmet>` with title "Giỏ Hàng — Sơn ATA"

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | Cart page shows all items from context | Visual |
| 2 | Qty ± updates cart and subtotal | Click |
| 3 | Remove item works | Click trash |
| 4 | Empty cart shows empty state | Remove all items |
| 5 | Form validates required fields | Submit without name → error |
| 6 | Successful order → POST /api/orders → 201 | Network tab |
| 7 | Order exists in SQLite after submission | `prisma studio` |
| 8 | Redirect to `/order-success/:id` after order | URL check |
| 9 | Cart emptied after order | Cart badge = 0 |
| 10 | localStorage cleared after order | F5 → empty cart |

---

## Dependencies
- US-003 (POST /api/orders endpoint)
- US-004 (Layout, types)
- US-007 (CartContext)

## Blocks
- US-009 (Order Success page)
