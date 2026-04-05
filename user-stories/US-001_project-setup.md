# US-001: Project Setup — Monorepo, Client & Server Scaffolding

| Field        | Value                                           |
| ------------ | ----------------------------------------------- |
| ID           | US-001                                          |
| Title        | Monorepo Structure, Client & Server Init        |
| Priority     | Must (Blocker)                                  |
| Story Points | 3                                               |
| Spec Refs    | §2, §12, §13                                    |

---

## User Story

> **As a** developer,
> **I want** the project structured as a monorepo with `/client` (Vite + React) and `/server` (Node.js + Express) fully scaffolded,
> **So that** both frontend and backend can be developed and run independently.

---

## Tasks

### Server (`/server`)
- [ ] `npm init -y`, install: `express`, `cors`, `@prisma/client`
- [ ] Install dev: `typescript`, `@types/express`, `@types/cors`, `@types/node`, `tsx`, `nodemon`, `prisma`
- [ ] Create `tsconfig.json`
- [ ] Create `src/index.ts` — Express app listening on port 3001, CORS enabled
- [ ] Create `src/lib/prisma.ts` — Prisma client singleton
- [ ] Add npm scripts: `dev`, `build`, `db:migrate`, `db:seed`, `db:studio`
- [ ] Verify `npm run dev` starts server on `http://localhost:3001`

### Client (`/client`)
- [ ] Scaffold Vite + React + TypeScript
- [ ] Install: `react-router-dom`, `react-helmet-async`, `lucide-react`
- [ ] Install dev: `tailwindcss`, `@tailwindcss/vite`
- [ ] Configure `vite.config.ts` (port 5173, Tailwind v4 plugin)
- [ ] Set up `index.html` (`lang="vi"`, Inter font, meta tags)
- [ ] Set up `src/index.css` with Tailwind v4 `@theme` (ATA brand colors)
- [ ] Create folder structure: `components/`, `context/`, `hooks/`, `pages/`, `types/`, `utils/`
- [ ] Create placeholder `App.tsx`
- [ ] Verify `npm run dev` starts on `http://localhost:5173`

### Root
- [ ] Create root `.gitignore` (node_modules, dist, dev.db, .env)

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|-------------|
| 1 | `cd server && npm run dev` → server on port 3001 | Terminal |
| 2 | `cd client && npm run dev` → client on port 5173 | Terminal |
| 3 | `GET http://localhost:3001/api/health` → `{ status: "ok" }` | curl |
| 4 | Client renders placeholder page with Tailwind styles | Browser |
| 5 | Both `npm run build` succeed | Terminal |

---

## Dependencies
- None (root story)

## Blocks
- All other stories
