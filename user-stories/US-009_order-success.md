# US-009: Order Success Page

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-009                                          |
| Title        | Order Confirmation Page                         |
| Priority     | Must                                            |
| Story Points | 2                                               |
| Spec Refs    | §5.1, §6.5                                      |

---

## User Story

> **As a** customer who just placed an order,
> **I want** to see a confirmation page with my order details fetched from the server,
> **So that** I know my order was successfully recorded.

---

## Tasks

### OrderSuccessPage (`client/src/pages/OrderSuccessPage.tsx`)
- [ ] Route: `/order-success/:id`
- [ ] Fetch `GET /api/orders/:id` on mount
- [ ] Display: order ID, status badge, customer info
- [ ] Item list: product name, quantity, unit price, line total
- [ ] Total amount
- [ ] "Tiếp tục mua sắm" link → home
- [ ] Loading state while fetching
- [ ] Error state if order not found

### SEO
- [ ] `<Helmet>` with title "Đặt Hàng Thành Công — Sơn ATA"

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | Page fetches order from API | Network tab |
| 2 | Order ID, status, customer info displayed | Visual |
| 3 | Items match what was ordered | Compare with POST body |
| 4 | Total amount correct | Math check |
| 5 | "Tiếp tục mua sắm" → home | Click |
| 6 | Invalid order ID → error message | Navigate to invalid |

---

## Dependencies
- US-003 (GET /api/orders/:id)
- US-004 (Layout)
- US-008 (Cart checkout triggers redirect here)

## Blocks
- None
