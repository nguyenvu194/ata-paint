# US-006: Product Detail Page

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-006                                          |
| Title        | Product Detail View with Gallery & Specs        |
| Priority     | Must                                            |
| Story Points | 5                                               |
| Spec Refs    | §5.1, §6.3                                      |

---

## User Story

> **As a** customer,
> **I want** to view detailed product information fetched from the API,
> **So that** I can make an informed purchase decision.

---

## Tasks

### Data Fetching
- [ ] Fetch `GET /api/products/:slug` using `useParams()` slug
- [ ] Handle loading, error, and 404 states

### Page Content
- [ ] Breadcrumb: Home → Product Name
- [ ] Image gallery: main image + clickable thumbnails
- [ ] Product info: name, category, price, full description
- [ ] Specifications table (weight, coverage, dryTime, finish)
- [ ] QuantitySelector (min 1, max 99) + "Thêm vào giỏ hàng" button
- [ ] In-stock / out-of-stock indicator
- [ ] SEO: `<Helmet>` with `{product.name} — Sơn ATA`

### QuantitySelector Component
- [ ] Props: `value`, `onChange`, `min`, `max`
- [ ] [−] disabled at min, [+] disabled at max
- [ ] Uses `<button>` elements

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | `/product/:slug` fetches product from API | Network tab |
| 2 | Image gallery: click thumbnail swaps main | Click |
| 3 | Quantity + add to cart works | Add 3 → cart shows 3 |
| 4 | Invalid slug → 404 message | Navigate to invalid |
| 5 | Responsive: stacked (mobile) → side-by-side (desktop) | Resize |

---

## Dependencies
- US-003 (API)
- US-004 (Layout, CartContext, types)

## Blocks
- None
