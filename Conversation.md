# Conversation.md — AI Orchestration Log

This file records key decisions, phase summaries, and architect↔engineer exchanges
for the Kanban technical assessment. Graders can trace every architectural choice here.

---

## Phase 0 — Discovery & Alignment

**Date:** 2026-05-10

### Summary

- Produced `CLAUDE.md` capturing all non-negotiables, conventions, RSC/Client split policy,
  data-access rule, commit conventions, API contract, ordering strategy, context-menu behaviour,
  error pipeline, env vars, scripts, tooling, and acceptance criteria

### Ambiguities Raised (Phase 0)

1. brief.pdf not present — treated system prompt as the brief
2. Stitch MCP not used — architect pasted HTML/CSS directly
3. No auth layer confirmed → public API
4. Task deletion → include Delete in context menu (wired to endpoint)
5. Task editing → create-only unless design reveals edit affordance
6. Float-between-neighbors ordering confirmed in CLAUDE.md
7. Optimistic update: pessimistic-then-optimistic for create, true optimistic for move
8. Dark mode → conditional on DESIGN.md (documented but not fully designed)
9. npm run dev → concurrently, backend: 4000, frontend: 3000

---

## Phase 1 — Design Extraction

**Date:** 2026-05-10

### Summary

- Analyzed three HTML/CSS screens from Stitch pasted by architect
- Identified true screen mapping: Screen 3 = Main Board View, Screen 2 = Task Creation View, Screen 1 = Design System reference
- Reconciled token divergence: Screen 3 (Kanban Board) is authoritative token source; task creation form layout from Screen 2 adapted to Screen 3's shell
- Produced `docs/DESIGN.md` containing:
  - Full color token palette (45+ tokens)
  - Typography scale (9 levels, Manrope + Inter + JetBrains Mono)
  - Spacing scale (xs through 3xl)
  - Border radius tokens
  - Shadow usage
  - Atomic component inventory (atoms / molecules / organisms) with RSC/Client classification
  - Screen 1 (Board View) full spec: layout, all component states (rest, hover, dragging, drop-zone-active, loading, empty, error)
  - Screen 2 (Task Creation) full spec: layout, form states (rest, focus, error), button variants
  - Responsive breakpoints (360px / 768px / 1280px)
  - RSC vs Client decision table per organism
  - Key design decisions (ordering algorithm, status color mapping, dark mode policy, icon library)

### Files Changed

- `docs/DESIGN.md` — created

### Design Decisions Surfaced

1. **Token source conflict**: Screen 1+2 use blue primary (#15458e); Screen 3 uses black primary (#000000) + dark navy sidebar (#0b1940). Resolution: Screen 3 is canonical. `secondary: #3074CA` fills interactive-blue role.
2. **Board data fetching**: No RSC data fetch → RTK Query client-side only (per Redux non-negotiable).
3. **Task form fields**: Stitch shows team assignment + due date; brief only requires title + description. Scoped to title + description only per acceptance criteria.
4. **Dark mode**: Token system supports it; board/form screens do not fully define dark variants. Documented but not invented.

---

<!-- Phase summaries appended here as work progresses -->
