# US-007: Cart Context with localStorage Persistence

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-007                                          |
| Title        | Cart State Management + localStorage            |
| Priority     | Must                                            |
| Story Points | 3                                               |
| Spec Refs    | §7.1, §7.2                                      |

---

## User Story

> **As a** customer,
> **I want** my cart to persist across pages and survive browser refresh,
> **So that** I don't lose my selected items.

---

## Tasks

### CartContext (`client/src/context/CartContext.tsx`)
- [ ] Interface: `items`, `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `totalItems`, `subtotal`
- [ ] `addToCart`: if exists → increment qty; if new → push
- [ ] `removeFromCart`: filter by productId
- [ ] `updateQuantity`: set qty, remove if ≤ 0
- [ ] `clearCart`: empty items + remove from localStorage
- [ ] Computed: `totalItems` (useMemo), `subtotal` (useMemo)

### localStorage Persistence
- [ ] Key: `"ata-cart"`
- [ ] Initialize from localStorage (with try/catch)
- [ ] Sync on every state change via `useEffect`
- [ ] `clearCart()` removes key

### Custom Hook
- [ ] `useCart()` — `useContext(CartContext)` with null check

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | Add to cart works | Badge increments |
| 2 | Same product re-added → qty increments | Add twice → qty=2 |
| 3 | Remove from cart works | Item removed |
| 4 | Quantity update to 0 → removes | Set to 0 → gone |
| 5 | Cart survives F5 | Refresh → items intact |
| 6 | clearCart removes localStorage | Order → F5 → empty |
| 7 | Corrupted localStorage → empty cart (no crash) | Set invalid JSON |

---

## Dependencies
- US-001 (client setup)

## Blocks
- US-005, US-006 (need addToCart)
- US-008 (need cart data for checkout)
