# DESIGN.md — Kanban App Design Source of Truth

Extracted from three Stitch screens provided by the architect on 2026-05-10.
This document is the single source of truth for all visual decisions.
No color, type, spacing, radius, or shadow value may be invented outside this spec.

---

## Source Screens

| Screen   | HTML comment                         | Actual content               | Role in app                  |
| -------- | ------------------------------------ | ---------------------------- | ---------------------------- |
| Screen 1 | "Design System"                      | Workspace Settings page      | Design system reference only |
| Screen 2 | "Team Settings & Members - Redesign" | **Task Creation View**       | App screen 2                 |
| Screen 3 | "Create New Task - Full Page"        | **Main Board View (Kanban)** | App screen 1                 |

> **Note on token divergence.** Screens 1+2 use `primary: #15458e` (blue); Screen 3 uses `primary: #000000` (black) with dark-navy sidebar. The Kanban board (Screen 3) is the authoritative token source since it contains the core product UI. The task creation form (Screen 2) layout is used but its shell is adapted to Screen 3's sidebar + nav. Where the two forms conflict on CTA color, Screen 3's `secondary: #3074CA` fills the role of the interactive blue.

---

## 1. Color Tokens

All values sourced from Screen 3's Tailwind config (Kanban Board — primary reference), supplemented with status colors that appear in both Screen 2 and Screen 3.

### Brand / Interactive

| Token                        | Hex       | Usage                                          |
| ---------------------------- | --------- | ---------------------------------------------- |
| `primary`                    | `#000000` | Card titles, primary text, "Create New" button |
| `on-primary`                 | `#ffffff` | Text on primary button                         |
| `primary-container`          | `#0b1940` | Sidebar background (dark navy)                 |
| `on-primary-container`       | `#7682af` | Inactive sidebar text                          |
| `primary-fixed`              | `#dce1ff` | Background tint                                |
| `primary-fixed-dim`          | `#b9c5f5` | Lighter primary tint                           |
| `on-primary-fixed`           | `#0b1940` | Text on primary-fixed bg                       |
| `on-primary-fixed-variant`   | `#39456e` | Sidebar nav active bg overlay                  |
| `inverse-primary`            | `#b9c5f5` | Inverse primary                                |
| `secondary`                  | `#3074CA` | CTA accent (sidebar upgrade, interactive blue) |
| `on-secondary`               | `#ffffff` | Text on secondary button                       |
| `secondary-container`        | `#67a4fe` | Container variant                              |
| `secondary-fixed`            | `#d5e3ff` | Fixed container                                |
| `secondary-fixed-dim`        | `#a8c8ff` | Dimmed fixed container                         |
| `on-secondary-fixed`         | `#001b3c` | Text on secondary-fixed                        |
| `on-secondary-fixed-variant` | `#00468a` | Variant text                                   |
| `on-secondary-container`     | `#003972` | Text on secondary container                    |

### Status (Column indicators + semantic feedback)

| Token            | Hex       | Usage                                                       |
| ---------------- | --------- | ----------------------------------------------------------- |
| `status-warning` | `#F8C540` | TO DO column dot + card left border                         |
| `status-info`    | `#2167F5` | IN PROGRESS column dot + card left border + category labels |
| `status-success` | `#58B388` | DONE column dot + card left border + check icon             |

### Surface / Background

| Token                       | Hex       | Usage                                         |
| --------------------------- | --------- | --------------------------------------------- |
| `background`                | `#f8f9fa` | Page background                               |
| `surface`                   | `#f8f9fa` | Top nav background                            |
| `surface-bright`            | `#f8f9fa` | Project header area, Kanban canvas background |
| `surface-dim`               | `#d9dadb` | —                                             |
| `surface-tint`              | `#515d87` | —                                             |
| `surface-container-lowest`  | `#ffffff` | Task cards (white)                            |
| `surface-container-low`     | `#f3f4f5` | Sidebar bg, DONE card bg, search input        |
| `surface-container`         | `#edeeef` | Mid-level surfaces                            |
| `surface-container-high`    | `#e7e8e9` | Avatar placeholder, hover bg on rows          |
| `surface-container-highest` | `#e1e3e4` | Highest container                             |
| `surface-variant`           | `#e1e3e4` | Variant surface                               |
| `inverse-surface`           | `#2e3132` | Dark inverse                                  |
| `inverse-on-surface`        | `#f0f1f2` | Text on inverse surface                       |

### Content

| Token                | Hex       | Usage                         |
| -------------------- | --------- | ----------------------------- |
| `on-surface`         | `#191c1d` | Primary body text             |
| `on-surface-variant` | `#45464e` | Secondary/muted text, labels  |
| `on-background`      | `#191c1d` | Headings, page-level text     |
| `outline`            | `#76767f` | Visible borders               |
| `outline-variant`    | `#c6c6cf` | Subtle dividers, card borders |

### Tertiary

| Token                       | Hex       | Usage |
| --------------------------- | --------- | ----- |
| `tertiary`                  | `#000000` | —     |
| `tertiary-container`        | `#20005e` | —     |
| `on-tertiary`               | `#ffffff` | —     |
| `on-tertiary-container`     | `#8c74d7` | —     |
| `tertiary-fixed`            | `#e8ddff` | —     |
| `tertiary-fixed-dim`        | `#cebdff` | —     |
| `on-tertiary-fixed`         | `#20005e` | —     |
| `on-tertiary-fixed-variant` | `#4d3495` | —     |

### Error

| Token                | Hex       | Usage                             |
| -------------------- | --------- | --------------------------------- |
| `error`              | `#ba1a1a` | Destructive actions, field errors |
| `on-error`           | `#ffffff` | Text on error button              |
| `error-container`    | `#ffdad6` | Error background tint             |
| `on-error-container` | `#93000a` | Text in error container           |

---

## 2. Typography Scale

**Font families:** Manrope (headings/display), Inter (body), JetBrains Mono (code/mono).
All fonts loaded from Google Fonts.

| Token        | Size | Line height | Letter spacing | Weight | Family         | Usage                                      |
| ------------ | ---- | ----------- | -------------- | ------ | -------------- | ------------------------------------------ |
| `display`    | 48px | 1.1         | -0.02em        | 700    | Manrope        | Hero headings                              |
| `h1`         | 32px | 1.2         | -0.01em        | 600    | Manrope        | Page titles                                |
| `h2`         | 24px | 1.3         | —              | 600    | Manrope        | Section headers                            |
| `h3`         | 20px | 1.4         | —              | 600    | Manrope        | Card titles                                |
| `body-lg`    | 18px | 1.6         | —              | 400    | Inter          | Lead paragraphs                            |
| `body-md`    | 16px | 1.5         | —              | 400    | Inter          | Default body copy                          |
| `body-sm`    | 14px | 1.5         | —              | 400    | Inter          | Secondary text, card descriptions          |
| `label-caps` | 12px | 1           | 0.05em         | 600    | Inter          | Category labels, column headers (ALL CAPS) |
| `mono`       | 13px | 1.5         | —              | 400    | JetBrains Mono | Task counts, code snippets                 |

---

## 3. Spacing Scale

| Token         | Value | Usage                                       |
| ------------- | ----- | ------------------------------------------- |
| `xs` / `base` | 4px   | Tight gaps, micro-spacing                   |
| `sm`          | 8px   | Within-component padding, button icon gaps  |
| `md`          | 16px  | Default component padding, nav item padding |
| `lg`          | 24px  | Card internal padding, section gaps         |
| `xl`          | 40px  | Page section separation                     |
| `2xl`         | 64px  | Page top/side padding                       |
| `3xl`         | 80px  | Major layout gaps                           |

---

## 4. Border Radius

| Token     | Value | Usage                                          |
| --------- | ----- | ---------------------------------------------- |
| `DEFAULT` | 2px   | Micro elements                                 |
| `lg`      | 4px   | Task cards, table rows                         |
| `xl`      | 8px   | Form sections, nav items, modals               |
| `full`    | 12px  | Pills, badges (not truly circular — use px-sm) |

> Avatars use Tailwind's `rounded-full` (9999px via inline style or `border-radius: 50%`).

---

## 5. Shadows

| Token             | Value               | Usage                                    |
| ----------------- | ------------------- | ---------------------------------------- |
| `shadow-sm`       | Tailwind default sm | Active/in-progress cards, focused inputs |
| `shadow-none`     | —                   | Default card rest state                  |
| `hover:shadow-md` | Tailwind default md | Card hover elevation                     |

No custom shadow values defined in the Stitch tokens. Standard Tailwind shadow scale used.

---

## 6. Atomic Component Inventory

### Atoms

| Component         | Description                                         | Interactive | Rendering |
| ----------------- | --------------------------------------------------- | ----------- | --------- |
| `StatusDot`       | 2.5×2.5 filled circle in warning/info/success color | No          | RSC       |
| `StatusBadge`     | Pill with uppercase label + background              | No          | RSC       |
| `TaskCountBadge`  | Monospace number next to column title               | No          | RSC       |
| `CategoryLabel`   | `label-caps` ALL CAPS text in `status-info`         | No          | RSC       |
| `Avatar`          | Rounded circle, initials fallback or image          | No          | RSC       |
| `AvatarStack`     | Overlapping avatars with +N overflow                | No          | RSC       |
| `Icon`            | Material Symbols Outlined wrapper                   | No          | RSC       |
| `Button`          | primary / secondary / ghost / danger variants       | Yes         | Client    |
| `IconButton`      | Square button with single icon                      | Yes         | Client    |
| `Input`           | Bordered text input with focus ring                 | Yes         | Client    |
| `Textarea`        | Multi-row input                                     | Yes         | Client    |
| `Select`          | Native select with custom chevron icon              | Yes         | Client    |
| `DateInput`       | Date picker input                                   | Yes         | Client    |
| `FormLabel`       | `label-caps` text in `on-surface-variant`           | No          | RSC       |
| `Skeleton`        | Animated loading placeholder                        | No          | Client    |
| `CheckCircleIcon` | Filled check circle in `status-success`             | No          | RSC       |

### Molecules

| Component          | Description                                               | Interactive | Rendering                  |
| ------------------ | --------------------------------------------------------- | ----------- | -------------------------- |
| `SearchBar`        | Icon + input in `surface-container-low` rounded container | Yes         | Client                     |
| `NavItem`          | Icon + label, active/inactive states                      | Yes         | Client                     |
| `TaskCard`         | Category + title + description + footer (date + avatar)   | Yes         | Client                     |
| `TaskCardSkeleton` | Placeholder card during loading                           | No          | Client                     |
| `ColumnHeader`     | StatusDot + label + TaskCountBadge + menu icon            | No          | Client (count is reactive) |
| `ContextMenu`      | Floating dropdown list of move-to options                 | Yes         | Client                     |
| `AddCardButton`    | `+` icon + "Add card" text button at column bottom        | Yes         | Client                     |
| `FormSection`      | White card with hover border + shadow                     | No          | RSC (shell)                |
| `BreadcrumbNav`    | Slash-separated page trail                                | No          | RSC                        |
| `InfoNote`         | Blue tinted info box with icon                            | No          | RSC                        |

### Organisms

| Component          | Description                                               | RSC/Client | Notes                                                           |
| ------------------ | --------------------------------------------------------- | ---------- | --------------------------------------------------------------- |
| `SideNav`          | Brand + nav links + New Task button + Help                | Client     | New Task button dispatches navigation; active state is reactive |
| `TopBar`           | Logo + search + notifications + avatar                    | Client     | Search input is interactive                                     |
| `KanbanBoard`      | Three `KanbanColumn` components inside dnd-kit DndContext | Client     | Owns all DnD state, must be Client                              |
| `KanbanColumn`     | `ColumnHeader` + scrollable card list + `AddCardButton`   | Client     | Drop target, receives `useDroppable`                            |
| `TaskCreationForm` | All form sections + Discard/Submit actions                | Client     | React Hook Form — must be Client                                |
| `ProjectHeader`    | Project title + status badge + subtitle                   | RSC        | Static markup, no interactivity                                 |

---

## 7. Screen Specifications

### Screen 1 — Main Board View

#### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ SideNav (w-64, fixed, bg-primary-container #0b1940)         │
├─────────────────────────────────────────────────────────────┤
│ TopBar (h-16, bg-surface, border-b outline-variant)         │
├─────────────────────────────────────────────────────────────┤
│ ProjectHeader (px-2xl pt-2xl pb-xl bg-surface-bright)       │
├─────────────────────────────────────────────────────────────┤
│ KanbanCanvas (flex-1 overflow-x-auto px-2xl pb-2xl)         │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐     │
│  │  TO DO col    │ │ IN PROGRESS   │ │    DONE col   │     │
│  │  min-w-320    │ │ min-w-320     │ │  min-w-320    │     │
│  └───────────────┘ └───────────────┘ └───────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

#### SideNav States

**Brand area:**

```
bg-secondary (#3074CA) rounded-xl icon
h3 "Core Workspace" text-white font-bold
body-sm "Enterprise Suite" text-on-primary-container/70
```

**Nav item — inactive:**

```
px-md py-sm rounded-xl
text-on-primary-container/70
hover: bg-on-primary-fixed-variant/10, text-white
transition-all
```

**Nav item — active (Tasks):**

```
px-md py-sm rounded-xl
bg-on-primary-fixed-variant/20
text-white font-semibold
```

**"New Task" button → navigates to /tasks/new (not in sidebar per final scope — see note below):**
Not present in Screen 3's sidebar footer; Screen 3 has "Upgrade Plan" in blue. For this app the "New Task" CTA should be placed in the TopBar ("Create New" button in Screen 3).

#### TopBar States

**Rest:**

```
h-16 bg-surface border-b border-outline-variant
Search: bg-surface-container-low rounded-lg w-64
"Create New": bg-primary text-white px-md py-1.5 rounded-lg body-sm font-semibold
Icons: p-sm text-on-surface-variant hover:text-primary
Avatar: w-8 h-8 rounded-full border border-outline-variant
```

#### Project Header

```
h1: font-h1 text-h1 text-primary tracking-tight
Status badge: px-sm py-0.5 bg-status-info text-white text-label-caps uppercase rounded
Subtitle: font-body-lg text-body-lg text-on-surface-variant mt-xs
```

#### Column Header States

**Rest:**

```
StatusDot: w-2.5 h-2.5 rounded-full (warning/info/success)
Label: font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest
Count: font-mono text-xs text-on-surface-variant/60
Menu icon: more_horiz text-on-surface-variant hover:text-primary
```

#### Task Card States

**TO DO card — Rest:**

```
bg-white p-lg rounded-lg
border border-outline-variant
border-l-4 border-l-status-warning
cursor-pointer group
transition-all
```

**TO DO card — Hover:**

```
hover:border-outline
edit icon: opacity-0 → group-hover:opacity-100
```

**IN PROGRESS card — Rest:**

```
bg-white p-lg rounded-lg
border border-outline-variant
border-l-4 border-l-status-info
shadow-sm
```

**IN PROGRESS card — Active/Dragging (dnd-kit):**

```
opacity-50 (source card while dragging)
shadow-lg scale-105 (drag overlay)
cursor-grabbing
```

**DONE card — Rest:**

```
bg-surface-container-low p-lg rounded-lg
border border-outline-variant/30
border-l-4 border-l-status-success
opacity-70 grayscale-[0.5]
```

**Card — Drop zone active (column receiving drag):**

```
Column background: bg-status-info/5
Placeholder slot: dashed border-2 border-dashed border-outline-variant h-[card-height] rounded-lg
```

**Card — Loading skeleton:**

```
TaskCardSkeleton: same dimensions as TaskCard
Title: animate-pulse bg-surface-container-high h-5 rounded w-3/4
Description: animate-pulse bg-surface-container h-3 rounded w-full (×2)
Footer: animate-pulse bg-surface-container h-3 rounded w-1/3
```

**Card internal anatomy:**

```
Row 1: CategoryLabel (label-caps text-status-info uppercase) + edit IconButton (hover only)
Row 2: h3 text-primary (DONE: line-through text-on-surface-variant)  [+ check_circle for DONE]
Row 3: body-sm text-on-surface-variant line-clamp-2
Divider: border-t border-outline-variant/50
Footer: date (calendar icon + xs text) + Avatar/AvatarStack
```

**Context Menu:**

```
Position: absolute, top-right of card, z-50
Background: bg-surface-container-lowest rounded-xl border border-outline-variant shadow-md
Item: px-md py-sm body-sm hover:bg-surface-container-low transition-colors
```

Menu items per status:

- `todo` → "Move to In Progress", "Move to Done"
- `in-progress` → "Move to To Do", "Move to Done"
- `done` → "Move to To Do", "Move to In Progress"

**Empty column state:**

```
Dashed border rounded-lg border-2 border-dashed border-outline-variant
Text: body-sm text-on-surface-variant/60 text-center py-xl
Icon: add_circle text-outline
"No tasks yet. Drop one here or add a card."
```

**Column — Error state:**

```
error-container/20 background tint on column
body-sm text-error "Failed to load tasks. Retry?"
Retry button: text-primary font-semibold hover:underline
```

---

### Screen 2 — Task Creation View

#### Layout

```
┌──────────────────────────────────────────────────────────────┐
│ SideNav (same as board view — w-64 fixed dark navy)          │
├──────────────────────────────────────────────────────────────┤
│ TopBar (same as board view)                                   │
├──────────────────────────────────────────────────────────────┤
│ Page content (ml-64 p-2xl max-w-5xl)                         │
│  BreadcrumbNav: Tasks > Create New Task                       │
│  PageHeader: display-md "Create New Task"                     │
│  subtitle: body-lg text-on-surface-variant                    │
│                                                               │
│  Form:                                                        │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ FormSection: Title + Description                     │    │
│  ├────────────────────────┬─────────────────────────────┤    │
│  │ FormSection: Timeline  │ FormSection: Team Assignment │    │
│  └────────────────────────┴─────────────────────────────┘    │
│  Footer: [Discard Draft] [Generate Task]                      │
└──────────────────────────────────────────────────────────────┘
```

#### FormSection — Rest

```
p-lg bg-white border border-outline-variant rounded-xl
transition-all duration-300
```

#### FormSection — Hover

```
border-color: primary (#000000 → use secondary #3074CA for interactive hover)
bg-white
box-shadow: 0 4px 20px -2px rgba(0,12,52,0.08)
```

#### Input — Rest

```
w-full border border-outline-variant rounded-lg p-md
bg-surface-bright text-body-md
placeholder: text-outline-variant
transition-all
```

#### Input — Focus

```
outline: none
border-color: secondary (#3074CA)
box-shadow: 0 0 0 4px rgba(48,116,202,0.1)
```

#### Input — Error

```
border-color: error (#ba1a1a)
box-shadow: 0 0 0 4px rgba(186,26,26,0.1)
Error message below: text-error text-body-sm
```

#### Title Input (special)

```
text-h2 font-h2  (large — from Screen 2: text-headline-md equivalent)
border border-outline-variant rounded-lg p-md
```

#### Textarea

```
rows=6 resize-none
Same styling as Input
```

#### Button — Primary (Submit)

```
px-2xl py-md bg-primary (#000000) text-on-primary
font-bold rounded-lg shadow-sm
hover:opacity-90 transition-all
active:scale-95
```

#### Button — Secondary/Ghost (Discard)

```
px-lg py-md border border-primary (#000000) text-primary
font-bold rounded-lg
hover:bg-surface-container-low transition-all
active:scale-95
```

#### Button — Loading state (Submit while pending)

```
disabled opacity-70 cursor-not-allowed
Spinner: animate-spin border-2 border-on-primary/30 border-t-on-primary rounded-full w-4 h-4
```

#### Validation Inline Errors

```
Appear below the field
text-body-sm text-error mt-xs
Icon: error material symbol text-error text-[16px]
```

#### Form fields in scope for this app

Per the brief, only two fields are required. The Stitch form shows more (team, date) but the brief specifies only `title` and `description`. Additional fields (status initial value = "todo" always) are set implicitly. We include `status` as a hidden default, not a user-facing field.

| Field         | Type       | Validation              | Shown              |
| ------------- | ---------- | ----------------------- | ------------------ |
| `title`       | text input | required, 1–100 chars   | Yes                |
| `description` | textarea   | optional, max 500 chars | Yes                |
| `status`      | hidden     | always "todo" on create | No (set in schema) |

---

## 8. Responsive Breakpoints

| Breakpoint | Width   | Board behavior                           | Form behavior            |
| ---------- | ------- | ---------------------------------------- | ------------------------ |
| Mobile     | 360px   | Single column visible, horizontal scroll | Single column form stack |
| Tablet     | 768px   | Two columns visible, scroll for third    | Two-column metadata grid |
| Desktop    | 1280px+ | All three columns visible                | Full layout              |

**Mobile nav:** Sidebar collapses to a bottom nav bar or hamburger. Not defined in Stitch — use standard mobile drawer pattern (hamburger button in TopBar → overlay drawer).

---

## 9. RSC vs Client — Decision Summary per Organism

| Organism                    | Decision      | Reason                                                                                                                      |
| --------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `SideNav`                   | **Client**    | Active nav state tracks current route via `usePathname`; "New Task" button navigates                                        |
| `TopBar`                    | **Client**    | Search input is interactive; "Create New" navigates; notification button                                                    |
| `ProjectHeader`             | **RSC**       | Static markup, no interactivity, no hooks                                                                                   |
| `KanbanBoard`               | **Client**    | Owns `DndContext` from dnd-kit — requires `useState`, drag event handlers                                                   |
| `KanbanColumn`              | **Client**    | `useDroppable` from dnd-kit; receives dragged card                                                                          |
| `TaskCard`                  | **Client**    | `useSortable` from dnd-kit; context menu toggle state                                                                       |
| `ContextMenu`               | **Client**    | Toggle open/close state; dispatches RTK Query mutation on click                                                             |
| `TaskCreationForm`          | **Client**    | React Hook Form; RTK Query mutation; validation state                                                                       |
| `BoardPage` (page.tsx)      | **RSC shell** | Thin RSC wrapper; renders `<KanbanBoard />` (Client); no data fetching at RSC level — data comes from RTK Query client-side |
| `CreateTaskPage` (page.tsx) | **RSC shell** | Thin RSC wrapper; renders `<TaskCreationForm />`                                                                            |
| `BreadcrumbNav`             | **RSC**       | Static based on route — can use `generateMetadata` pattern                                                                  |

> **Board data fetching decision:** Because all server interaction must go through RTK Query (non-negotiable), the board page does NOT use RSC `fetch` + props to pre-populate. The RSC shell renders a loading skeleton immediately; `KanbanBoard` (Client) fires the RTK Query `getTasks` hook on mount and populates from cache or API. This is the correct pattern when Redux is the single source of truth for server state.

---

## 10. Key Design Decisions

### Ordering Algorithm: Float-Between-Neighbors

Chosen over LexoRank for simplicity. `newOrder = (prevOrder + nextOrder) / 2`. Rebalance (assign 0, 1, 2… integers) when any gap < `1e-9`. Single PATCH per move. No multi-card updates unless rebalance triggers. Simpler to reason about, sufficient for the scale of this assessment.

### Status Color Mapping

| Status value  | Column label | Left border token        | Dot token        |
| ------------- | ------------ | ------------------------ | ---------------- |
| `todo`        | TO DO        | `status-warning` #F8C540 | `status-warning` |
| `in-progress` | IN PROGRESS  | `status-info` #2167F5    | `status-info`    |
| `done`        | DONE         | `status-success` #58B388 | `status-success` |

### Dark Mode

The Stitch config includes `darkMode: "class"` and dark variants on several components (Screen 1, 2). Screen 3 does not use dark classes on board-critical elements. **Dark mode is supported by the token system but not explicitly designed for the board or form screens.** We will wire up Tailwind dark mode classes on the shell components (sidebar, nav) where Screen 1/2 define them, but will not invent dark variants for board cards. This decision is documented here — dark mode can be added later by extending the spec.

### Icon Library

Material Symbols Outlined via Google Fonts CDN. Font variation settings:

```css
font-variation-settings:
  "FILL" 0,
  "wght" 400,
  "GRAD" 0,
  "opsz" 24;
```

Filled variant where specified (check_circle for DONE, assignment active nav).
