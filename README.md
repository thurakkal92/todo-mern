# Todo Kanban Board

A full-stack Kanban task management app built with the MERN stack and TypeScript. Three columns (To Do, In Progress, Done), drag-and-drop reordering, a task creation form, and a dark-navy sidebar shell — all wired through RTK Query with optimistic updates.

**Workspace hierarchy**: Teams contain Projects; Projects contain Tasks. Switch the board between a single project's view and an "All Projects" view that aggregates tasks across every project plus any unassigned tasks. The SideNav lets you create, rename, and delete Teams and Projects inline.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy env files and set your MongoDB URI
cp apps/backend/.env.example apps/backend/.env

# 3. Start both apps
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

---

## Scripts

All scripts run from the repo root via npm workspaces.

| Command             | What it does                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `npm run dev`       | Starts backend (ts-node-dev) and frontend (Next.js) concurrently |
| `npm run build`     | Builds both apps for production                                  |
| `npm run typecheck` | `tsc --noEmit` across shared, backend, and frontend              |
| `npm run lint`      | ESLint across all workspaces                                     |
| `npm test`          | Vitest on all workspaces (38 tests: 28 backend, 10 frontend)     |

---

## Repository layout

```
apps/
  backend/          Express + Mongoose API
  frontend/         Next.js 15 App Router
packages/
  shared/           Zod schemas + TypeScript types (imported by both apps)
docs/
  DESIGN.md         Full design spec extracted from Stitch screens
  brief.pdf
CLAUDE.md           Engineering context and non-negotiables
```

---

## Architecture

### Shared package (`@todo/shared`)

Zod schemas live in `packages/shared` and are imported by both apps. The backend uses them for request validation middleware; the frontend uses them as the React Hook Form resolver. One schema, zero duplication.

### Backend

Layered architecture: `routes → controllers → services → models`. Zod validation middleware runs before controllers. A centralized error handler formats every response as `{ error: { code, message, details? } }`.

The `PATCH /api/tasks/:id/move` endpoint handles status changes and recomputes order server-side using the **float-between-neighbors** algorithm: `newOrder = (prevOrder + nextOrder) / 2`. When any adjacent gap shrinks below `1e-9`, the column is rebalanced (integers 0, 1, 2 …). Indexes on `{ status, order }` keep the board query fast.

### Frontend

All server communication goes through **RTK Query** — components never call `fetch` or `axios` directly (enforced by ESLint `no-restricted-imports`). A custom `baseQuery` wraps `fetchBaseQuery` and normalises every error path to a typed `ApiError` shape. A single `useErrorToast` hook subscribes to RTK Query errors and fires sonner toasts.

Two RTK Query slices keep concerns separate:

- **`tasksApi`** — task CRUD and the `/move` endpoint. `getTasks` accepts an optional `projectId` argument so per-project boards and the "All Projects" view share the same cache key strategy.
- **`workspaceApi`** — teams and projects CRUD. The SideNav, ProjectHeader, and BoardViewHeader subscribe to these queries.

A small **`workspaceSlice`** (Redux state, not RTK Query) tracks the currently active `projectId` so the rest of the app can render the correct board without prop-drilling.

`moveTask` uses **true optimistic updates**: the cache is patched immediately on dispatch, and `patch.undo()` rolls it back if the server returns an error. `createTask` is pessimistic — a spinner shows while the server confirms before the card appears.

Components follow a strict RSC/Client split: anything that uses Redux, React Hook Form, dnd-kit, or DOM events is a Client Component (`"use client"`). Static shells and layout components are RSC.

### Drag-and-drop

`@dnd-kit/core` + `@dnd-kit/sortable` power the board. `KanbanBoard` owns the `DndContext` with a `PointerSensor` requiring 8 px of movement before activation (prevents accidental drags on clicks). On `dragEnd`, the frontend computes the float-between-neighbors order and dispatches the `moveTask` mutation. The optimistic update makes the move feel instant; the server response confirms and may rebalance.

### Component hierarchy

```
ShellLayout (RSC)
└── NavShell (Client — owns mobile drawer state)
    ├── SideNav (Client — usePathname + workspace state)
    │   └── TeamSpacesSection (Client — collapsible teams + nested projects,
    │                          inline create/rename/delete via workspaceApi)
    ├── TopBar (Client — hamburger + Create New)
    └── main
        ├── BoardPage (RSC shell)
        │   ├── BoardViewHeader (Client — project title, team breadcrumb,
        │   │                    member avatars, filter slot)
        │   └── BoardContent (Client)
        │       ├── KanbanBoard (Client — DndContext, pointerWithin collision)
        │       │   └── KanbanColumn × 3 (Client — useDroppable)
        │       │       └── TaskCard × N (Client — useSortable + ContextMenu)
        │       └── AllProjectsBoard (Client — used when no project is active)
        ├── TaskCreationModal (Client — modal wrapper around TaskCreationForm)
        ├── TaskCreationForm (Client — React Hook Form + Zod resolver)
        └── DeleteConfirmationModal (Client — used for Task / Project / Team)
```

---

## Key decisions

**Float-between-neighbors over LexoRank** — simpler to implement and reason about at this scale. Rebalancing is rare and cheap (one bulk update when a gap shrinks below 1e-9).

**Pessimistic create, optimistic move** — Creating a task is infrequent and users expect a confirmation moment. Moving a card is frequent and latency-sensitive; the optimistic update with rollback gives instant feedback without risking stale UI.

**RTK Query as the single data layer** — One `createApi` call with a custom error-normalising `baseQuery` covers all five endpoints. Cache invalidation, loading states, and error propagation are handled in one place. Components stay dumb.

**MSW for API tests** — `msw/node` intercepts real `fetch` calls in the test environment. Tests run with `// @vitest-environment node` to avoid jsdom/undici `AbortSignal` incompatibility. The test setup mirrors real network behaviour without a live server.

---

## Environment variables

```bash
# apps/backend/.env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/todo
NODE_ENV=development

# apps/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```
