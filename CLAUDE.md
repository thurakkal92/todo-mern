# CLAUDE.md — Kanban App Engineering Context

This file is the authoritative reference for Claude Code when working in this repository.
It captures non-negotiables, conventions, architecture decisions, and acceptance criteria
for the technical-assessment Kanban application.

---

## Project Overview

A full-stack Kanban board (MERN + TypeScript) built as a technical assessment.
Three columns: **To Do**, **In Progress**, **Done**.
Two views: Main Board View and Task Creation View.

Graders evaluate: engineering quality, architecture decisions, AI orchestration skill,
developer-workflow maturity, maintainability, and code standards.
Documentation is a first-class deliverable.

---

## Repository Layout

```
/apps/frontend        → Next.js 14 App Router frontend
/apps/backend         → Express backend
/packages/shared      → Zod schemas + shared TypeScript types (published via workspace)
/docs                 → DESIGN.md, brief.pdf
CLAUDE.md             ← this file
README.md
Conversation.md
```

---

## Stack (Non-Negotiable)

### Frontend

- **Next.js** (App Router) + **React** + **TypeScript strict**
- **Redux Toolkit** + **RTK Query** for all server interactions
- **Tailwind CSS** — tokens sourced from DESIGN.md; no ad-hoc values
- **@dnd-kit/core** + **@dnd-kit/sortable** for drag-and-drop
- **React Hook Form** + **Zod resolver** for forms
- **sonner** (or equivalent) for toast notifications

### Backend

- **Node.js** + **Express** + **TypeScript strict**
- Layered architecture: `routes → controllers → services → models`
- **Zod** for request validation middleware (before controllers)
- Centralized error handling middleware

### Database

- **MongoDB** + **Mongoose** with explicit TypeScript types
- Indexes on `status` and `order` fields for the board query

### Shared

- Zod schemas live in `/packages/shared` and are imported by both apps
- TypeScript types derived from Zod schemas (not duplicated)

---

## RSC vs Client Component Policy

| Component type                                   | Rendering                          |
| ------------------------------------------------ | ---------------------------------- |
| Static layout shells, page wrappers              | React Server Component (RSC)       |
| Board column headers (static)                    | RSC                                |
| Interactive board (drag-and-drop, context menus) | Client Component                   |
| Task cards (draggable)                           | Client Component                   |
| Forms (React Hook Form)                          | Client Component                   |
| Redux-connected UI                               | Client Component                   |
| Toast pipeline                                   | Client Component                   |
| Skeletons / loading states                       | Client Component (inside Suspense) |

**Rule:** if a component dispatches to Redux, calls an RTK Query hook, uses `useState`/`useEffect`, or handles events — it is a Client Component (`"use client"`). Document the boundary in DESIGN.md per organism.

---

## Data Access Rule

> **Components never call `fetch` or `axios` directly.**
> All server communication goes through RTK Query hooks or Redux Toolkit thunks.
> The data layer is the only place that knows about HTTP.

This is enforced by ESLint rule `no-restricted-imports` on `fetch`/`axios` in component files.

---

## TypeScript Conventions

- **Strict mode** in both `apps/frontend/tsconfig.json` and `apps/backend/tsconfig.json`
- **Zero `any`**, zero `@ts-ignore`
- Use `unknown` + type narrowing as the escape hatch when truly needed
- All Mongoose models have explicit interface types (not inferred from schema only)
- All RTK Query endpoints are fully typed (request, response, error)

---

## Naming Conventions

| Thing                   | Convention                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------- |
| Files (components)      | `PascalCase.tsx`                                                                    |
| Files (hooks)           | `useCamelCase.ts`                                                                   |
| Files (utils, services) | `camelCase.ts`                                                                      |
| Files (schemas)         | `camelCase.schema.ts`                                                               |
| CSS classes             | Tailwind utilities only; no custom class names unless a Tailwind `@layer component` |
| API routes              | `kebab-case` (`/tasks/:id/move`)                                                    |
| DB field names          | `camelCase`                                                                         |
| Env vars                | `SCREAMING_SNAKE_CASE`                                                              |

---

## Commit Conventions

**Conventional Commits** — small, focused commits per logical change.

```
feat(backend): add Task model with status and order indexes
fix(frontend): correct optimistic update rollback on move failure
chore(repo): configure Husky + lint-staged
test(backend): integration tests for PATCH /tasks/:id/move
```

**Never** one giant "implement app" commit.

---

## API Contract

```
GET    /api/tasks              → all tasks, sorted by status+order
POST   /api/tasks              → create task
PATCH  /api/tasks/:id          → update task fields
DELETE /api/tasks/:id          → delete task
PATCH  /api/tasks/:id/move     → change status + recompute order
```

### Error shape (always)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [{ "field": "title", "message": "Required" }]
  }
}
```

---

## Task Model Fields

| Field         | Type                                | Notes                     |
| ------------- | ----------------------------------- | ------------------------- |
| `_id`         | ObjectId                            | MongoDB default           |
| `title`       | string                              | required, 1–100 chars     |
| `description` | string                              | optional, max 500 chars   |
| `status`      | `"todo" \| "in-progress" \| "done"` | required                  |
| `order`       | number                              | float/LexoRank per column |
| `createdAt`   | Date                                | Mongoose timestamps       |
| `updatedAt`   | Date                                | Mongoose timestamps       |

---

## Ordering Strategy

Tasks have a numeric `order` field scoped per column.
On drag-drop reorder, use **float-between-neighbors**:

- New order = `(prevOrder + nextOrder) / 2`
- On PATCH `/tasks/:id/move`: compute new order server-side, return updated task
- Rebalance (reassign 0, 1, 2, … integers) when gap < 1e-9

Justification documented in DESIGN.md.

---

## Context Menu Behaviour

The drop-down on a task card must show **only** columns the task is not currently in.

| Current status | Menu options                       |
| -------------- | ---------------------------------- |
| `todo`         | Move to In Progress, Move to Done  |
| `in-progress`  | Move to To Do, Move to Done        |
| `done`         | Move to To Do, Move to In Progress |

---

## Error Handling Pipeline

1. Backend middleware catches all errors, formats `{ error: { code, message, details? } }`
2. RTK Query `transformErrorResponse` normalizes to a typed `AppError`
3. A single `useErrorToast` hook subscribes to RTK Query errors and fires `sonner` toasts
4. No component handles errors individually — they go through the pipeline

---

## Environment Variables

```
# apps/backend/.env.example
PORT=4000
MONGODB_URI=mongodb://localhost:27017/kanban
NODE_ENV=development

# apps/frontend/.env.example
NEXT_PUBLIC_API_URL=http://localhost:4000
```

`.env` files are gitignored. Only `.env.example` is committed.

---

## Scripts (from repo root)

```
npm run dev          → starts both apps concurrently
npm run build        → builds both apps
npm run typecheck    → tsc --noEmit on both apps
npm run lint         → ESLint on all workspaces
npm test             → Vitest on all workspaces
```

---

## Tooling

- **ESLint** — `@typescript-eslint` + `eslint-plugin-react-hooks` + `no-restricted-imports` for fetch/axios
- **Prettier** — enforced via ESLint plugin
- **Husky** + **lint-staged** — runs ESLint + Prettier on staged files pre-commit
- **Vitest** — frontend unit tests (RTK Query slice, components via RTL)
- **Supertest** — backend integration tests (in-memory MongoDB via `mongodb-memory-server`)

---

## Acceptance Criteria (Grader Checklist)

- [ ] `npm run dev` from repo root starts both apps
- [ ] `npm run build`, `npm run typecheck`, `npm run lint`, `npm test` all pass
- [ ] Creating a task validates inputs, persists to MongoDB, appears optimistically, shows success toast
- [ ] Dragging a card across columns updates status + order in DB and survives page refresh
- [ ] Context menu on a "To Do" card shows exactly "Move to In Progress" and "Move to Done"
- [ ] Loading states visible on every async action
- [ ] Layout works at 360px, 768px, and 1280px
- [ ] README explains setup, scripts, architecture, key decisions in under 5 minutes

---

## Phases

| Phase | Deliverable                                   | Status      |
| ----- | --------------------------------------------- | ----------- |
| 0     | Discovery & alignment → CLAUDE.md             | In progress |
| 1     | Design extraction → DESIGN.md                 | Pending     |
| 2     | Scaffolding → monorepo, tooling, healthcheck  | Pending     |
| 3     | Backend → models, endpoints, tests            | Pending     |
| 4     | Frontend data layer → RTK Query slice, tests  | Pending     |
| 5     | Atomic UI components                          | Pending     |
| 6     | Board view → dnd-kit, context menu, skeletons | Pending     |
| 7     | Task creation view → form, validation, toast  | Pending     |
| 8     | Polish & responsive                           | Pending     |
| 9     | Documentation → README                        | Pending     |
