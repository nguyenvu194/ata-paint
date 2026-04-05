# US-004: Shared Layout, Header, Footer & Routing

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-004                                          |
| Title        | Layout, Header, Footer, Router & ScrollToTop    |
| Priority     | Must                                            |
| Story Points | 3                                               |
| Spec Refs    | §6.1, §8, §9.1                                  |

---

## User Story

> **As a** user,
> **I want** a consistent layout with branded header, footer, and smooth navigation,
> **So that** I can navigate the site and always access key features.

---

## Tasks

### App Router (`client/src/App.tsx`)
- [ ] `<BrowserRouter>` → `<ScrollToTop>` → `<HelmetProvider>` → `<CartProvider>` → `<Routes>`
- [ ] Routes: `/`, `/product/:slug`, `/cart`, `/order-success/:id`, `*`
- [ ] All routes nested under `<Layout />`

### Layout (`client/src/components/Layout.tsx`)
- [ ] `<Header>` + `<main>` (wraps `<Outlet>`) + `<Footer>`
- [ ] Semantic HTML per §9.1

### Header (`client/src/components/Header.tsx`)
- [ ] Logo → `/`, "Trang chủ" NavLink, Cart icon (ShoppingCart from lucide)
- [ ] Cart badge: total items from `useCart()`, hidden when 0
- [ ] Cart icon → navigate to `/cart`
- [ ] Responsive

### Footer (`client/src/components/Footer.tsx`)
- [ ] `<footer>` with brand info

### ScrollToTop (`client/src/components/ScrollToTop.tsx`)
- [ ] `useLocation()` → `window.scrollTo(top)` on pathname change

### Types & Utils
- [ ] `client/src/types/index.ts` — Product, CartItem, Order, OrderItem, Category interfaces
- [ ] `client/src/utils/format.ts` — `formatPrice()`
- [ ] `client/src/utils/api.ts` — `API_BASE_URL` constant + fetch helpers

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | Every page has `<header>`, `<main>`, `<footer>` | DOM |
| 2 | Logo links to `/` | Click |
| 3 | Cart badge updates with item count | Add item check |
| 4 | Scroll resets on route change | Navigate and verify |
| 5 | NavLink shows active state | Visual |

---

## Dependencies
- US-001 (client scaffolding)

## Blocks
- US-005, US-006, US-007, US-008 (pages need layout)
