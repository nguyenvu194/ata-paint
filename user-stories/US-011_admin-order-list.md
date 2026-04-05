# US-011: Admin Layout & Order List

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-011                                          |
| Title        | Admin Dashboard — Layout & Order List           |
| Priority     | Must                                            |
| Story Points | 3                                               |
| Spec Refs    | §4.2 (GET /api/orders), §1.3 step [7], §14 API-6 |

---

## User Story

> **As an** admin,
> **I want** a dashboard where I can see all customer orders,
> **So that** I can monitor and manage incoming orders.

---

## Tasks

### Admin Layout (`client/src/components/AdminLayout.tsx`)
- [ ] Sidebar navigation: Đơn hàng, Sản phẩm
- [ ] Header with admin title + link back to storefront
- [ ] Responsive: sidebar collapses on mobile
- [ ] Route: `/admin` → redirect to `/admin/orders`

### Order List Page (`client/src/pages/admin/OrderListPage.tsx`)
- [ ] Route: `/admin/orders`
- [ ] Fetch `GET /api/orders` on mount
- [ ] Table: Order ID (truncated), Customer Name, Phone, Total, Status badge, Date
- [ ] Filter by status (All / Pending / Confirmed / Shipping / Delivered / Cancelled)
- [ ] Click row → navigate to `/admin/orders/:id`
- [ ] Loading & error states
- [ ] Empty state if no orders

### SEO
- [ ] `<Helmet>` with title "Quản Lý Đơn Hàng — Admin Sơn ATA"

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | Admin layout with sidebar renders | Visual |
| 2 | Order list fetches from GET /api/orders | Network tab |
| 3 | All orders displayed in table | Compare with prisma studio |
| 4 | Status filter works | Click filter tabs |
| 5 | Click order row navigates to detail | URL check |
| 6 | Responsive on mobile | Resize browser |

---

## Dependencies
- US-003 (GET /api/orders endpoint)
- US-004 (Types, routing)

## Blocks
- US-012 (Order detail page)
