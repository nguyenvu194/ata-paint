# US-012: Order Detail & Status Management

| Field        | Value                                                    |
| ------------ | -------------------------------------------------------- |
| ID           | US-012                                                   |
| Title        | Admin Order Detail — View & Update Status                |
| Priority     | Must                                                     |
| Story Points | 3                                                        |
| Spec Refs    | §4.2 (PATCH /api/orders/:id/status), §4.4, §14 API-7    |

---

## User Story

> **As an** admin,
> **I want** to view full order details and update the order status,
> **So that** I can process orders through the fulfillment pipeline.

---

## Tasks

### Order Detail Page (`client/src/pages/admin/OrderDetailPage.tsx`)
- [ ] Route: `/admin/orders/:id`
- [ ] Fetch `GET /api/orders/:id` on mount
- [ ] Display: Order ID, date, current status badge
- [ ] Customer info card: name, phone, email, address, note
- [ ] Items table: product name, quantity, unit price, line total
- [ ] Total amount
- [ ] Back to order list link

### Status Management
- [ ] Status transition buttons based on current status:
  - `pending` → Xác nhận (confirmed) | Hủy (cancelled)
  - `confirmed` → Giao hàng (shipping) | Hủy (cancelled)
  - `shipping` → Đã giao (delivered)
  - `delivered` → (no further transitions)
  - `cancelled` → (no further transitions)
- [ ] PATCH `/api/orders/:id/status` on click
- [ ] Confirmation prompt before status change
- [ ] Optimistic UI update + error rollback
- [ ] Loading state during PATCH

### SEO
- [ ] `<Helmet>` with title "Đơn Hàng {id} — Admin Sơn ATA"

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | Order detail fetches from API | Network tab |
| 2 | Customer info displayed correctly | Visual |
| 3 | Items match what was ordered | Compare with POST body |
| 4 | Status buttons follow transition rules | Click through states |
| 5 | PATCH request sent on status change | Network tab |
| 6 | Status updates in SQLite | prisma studio |
| 7 | Invalid order ID shows error | Navigate to invalid |

---

## Dependencies
- US-003 (GET /api/orders/:id, PATCH /api/orders/:id/status)
- US-011 (Admin layout)

## Blocks
- None
