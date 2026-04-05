# US-010: SEO, Responsive Design & Final QA

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-010                                          |
| Title        | SEO, Responsive Polish & End-to-End QA          |
| Priority     | Must                                            |
| Story Points | 3                                               |
| Spec Refs    | §9, §10, §11, §14                               |

---

## User Story

> **As a** user on any device,
> **I want** the site to look great, be accessible, and work end-to-end from browsing to order placement,
> **So that** I have a seamless experience.

---

## Tasks

### SEO (§9)
- [ ] Dynamic `<title>` and `<meta description>` on every route
- [ ] Semantic HTML audit: `<header>`, `<main>`, `<footer>`, `<article>`, `<nav>`
- [ ] All `<img>` have descriptive `alt` attributes
- [ ] No `<div onClick>` — all interactive elements use `<button>` or `<a>`

### Responsive (§10)
- [ ] Product grid: 1→2→3-4 cols at breakpoints
- [ ] Product detail: stacked → side-by-side
- [ ] Cart page: responsive table/list
- [ ] Header: works on mobile

### Animations (§11)
- [ ] ProductCard hover: scale + shadow
- [ ] Cart badge bounce on add
- [ ] Add to Cart button color feedback
- [ ] Loading spinners on data fetch

### End-to-End QA
- [ ] Full flow: Home → browse → add to cart → detail → add with qty → /cart → checkout → order success
- [ ] Cart persists on F5
- [ ] Order verified in SQLite
- [ ] Zero console errors
- [ ] Cross-browser: Chrome, Safari, Firefox

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | All pages have unique `<title>` | Navigate each route |
| 2 | `img:not([alt])` → 0 results | Console query |
| 3 | Responsive at 640/1024/1280px | Resize |
| 4 | Full E2E flow completes | Manual walkthrough |
| 5 | Order appears in SQLite | `prisma studio` |
| 6 | Zero console errors | DevTools |

---

## Dependencies
- US-001 through US-009

## Blocks
- None (final story)
