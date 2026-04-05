# US-002: Prisma Schema, Migration & Seed Data

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-002                                          |
| Title        | SQLite Database Schema & Seed Data              |
| Priority     | Must                                            |
| Story Points | 3                                               |
| Spec Refs    | §3.1, §3.2, §3.3                                |

---

## User Story

> **As a** developer,
> **I want** the SQLite database schema defined via Prisma with seed data for products and categories,
> **So that** the API has realistic data to serve from day one.

---

## Tasks

### Prisma Init
- [ ] Run `npx prisma init --datasource-provider sqlite`
- [ ] Configure `schema.prisma` with 4 models: `Category`, `Product`, `Order`, `OrderItem`
- [ ] Define all fields, relations, and indexes per spec §3.1

### Migration
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Verify `dev.db` file created in `server/prisma/`
- [ ] Verify all 4 tables exist via `prisma studio`

### Seed Script (`server/prisma/seed.ts`)
- [ ] Create 2 categories: "Sơn Công Nghiệp", "Sơn Trang Trí"
- [ ] Create 6+ products with Unsplash image URLs
- [ ] Products span both categories, realistic VND prices (150K–2.5M)
- [ ] At least 1 product with `inStock: false`
- [ ] Full specifications (weight, coverage, dryTime, finish)
- [ ] Configure seed command in `package.json` → `prisma.seed`
- [ ] Run `npx prisma db seed` and verify

### Prisma Client
- [ ] Generate client: `npx prisma generate`
- [ ] Update `src/lib/prisma.ts` singleton

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | `server/prisma/dev.db` exists after migration | File check |
| 2 | 4 tables created (Category, Product, Order, OrderItem) | `prisma studio` |
| 3 | Seed data: 2 categories present | DB query |
| 4 | Seed data: 6+ products present | DB query |
| 5 | At least 1 out-of-stock product | DB query |
| 6 | All product slugs are unique, URL-safe | DB query |
| 7 | Relations work: product → category, orderItem → order/product | `prisma studio` |

---

## Dependencies
- US-001 (server setup)

## Blocks
- US-003 (API needs data to serve)
