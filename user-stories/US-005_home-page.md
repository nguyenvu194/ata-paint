# US-005: Home Page — Product Listing from API

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-005                                          |
| Title        | Home Page with API-driven Product Grid          |
| Priority     | Must                                            |
| Story Points | 3                                               |
| Spec Refs    | §5.1, §6.2                                      |

---

## User Story

> **As a** customer,
> **I want** to see all available products fetched from the server API in a grid,
> **So that** I can browse the real product catalog.

---

## Tasks

### Data Fetching
- [ ] `client/src/hooks/useProducts.ts` — custom hook fetching `GET /api/products`
- [ ] Handle loading, error, and success states

### Home Page (`client/src/pages/HomePage.tsx`)
- [ ] Hero/banner section
- [ ] Product grid: 1 col (mobile) → 2 col (tablet) → 3-4 col (desktop)
- [ ] Loading spinner while fetching
- [ ] Error state if API fails
- [ ] SEO: `<Helmet>` with title + description

### ProductCard (`client/src/components/ProductCard.tsx`)
- [ ] `<article>` with image (`alt`), name, category, price
- [ ] "Xem chi tiết" → `<Link to="/product/:slug">`
- [ ] "Thêm vào giỏ" → `addToCart()` from `useCart()`
- [ ] Hover: scale + shadow
- [ ] Out-of-stock visual state

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | Products fetched from API (not hardcoded) | Network tab |
| 2 | 6+ products rendered | Visual |
| 3 | Loading spinner shown while fetching | Throttle network |
| 4 | "Thêm vào giỏ" increments cart badge | Click |
| 5 | Grid responsive at all breakpoints | Resize |

---

## Dependencies
- US-003 (API endpoints)
- US-004 (Layout, types, CartContext)

## Blocks
- None
