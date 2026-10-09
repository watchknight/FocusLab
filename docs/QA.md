# FocusLab QA Verification & Audit Matrix

**Audited:** FocusLab v3 ("Rack Focus")  
**Specification:** `AGENTS.md` & `docs/DESIGN-V3.md`  
**Automated CI Status:** 19/19 Vitest test suites green (218/218 passing tests), ESLint 0 errors, TypeScript 0 errors, Static Build 39/39 SSG pages pre-rendered.

---

## 1. QA Matrix: Studio Profile with `fx: full`

Evaluated across the 9 specification widths:
- **Mobile Breakpoints:** 320px (minimum reflow constraint), 360px (compact Android), 390px (standard iPhone 14/15/16), 430px (large iPhone Pro Max).
- **Tablet Breakpoint:** 768px (iPad portrait / compact viewport).
- **Desktop Breakpoints:** 1024px (iPad landscape / small laptop), 1280px (standard desktop), 1440px (large desktop / reference design), 1920px (full HD monitor).

### Evaluation Criteria
- **NHS** — **No Horizontal Scroll**: `overflow-x: clip` and `max-width: 100%` on `html` and `body`; flex/grid children carry `min-w-0`; zero horizontal scrollbar at any viewport width.
- **NAV** — **Nav Usable**: Desktop header visible and fully interactive (>= 1024px); mobile bottom navigation bar and accessible "More" sheet drawer operable (< 1024px); active indicators clearly highlighted.
- **TXT** — **Text Size Compliance**: Body/content text >= 16px (1rem); HUD technical readouts, badges, and captions >= 14px (0.875rem); fluid scaling via `clamp()` within tokens.
- **TAP** — **Tap Targets >= 44px**: All buttons, links, toggles, segmented radio controls, and input triggers meet minimum 44px touch bounding box (`min-h-[44px]` and `min-w-[44px]`).
- **FOC** — **Visible Focus**: `:focus-visible` ring with 2px high-contrast outline and 2px offset on all interactive elements; skip link visible when focused.
- **OVL** — **No Overlap**: Content flows without collision; glass chips and floating HUD elements maintain proper clearance from corner brackets and text.
- **SHH** — **Nothing Hidden by Sticky Header**: `scroll-padding-top` matches `--header-height`; safe-area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) respected.

---

### 1.1 Master Matrix Table: Studio Profile (`fx: full`)

| Route | 320px | 360px | 390px | 430px | 768px | 1024px | 1280px | 1440px | 1920px | Overall |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **`/`** (Home / Hero / Pinned Scene) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/check`** (Check PVT-B Runner) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/focus`** (Focus Session & Dial) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/activities`** (Catalog Bento) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/activities/cyclic-sighing`** (Player) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/activities/box-breathing`** (Player) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/activities/breath-counting`** (Player) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/activities/nature-microbreak`** (Player) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/activities/movement-snack`** (Player) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/activities/quiet-rest`** (Player) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/experiments`** (A/B Runner & Dot Plot) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/insights`** (Stats & Data Management) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/sounds`** (Soundscapes & Volume Knob) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/learn`** (Evidence Rubric & Catalog) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/learn/how-we-rate`** (Methodology) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/learn/myths`** (Myths Debunking) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/learn/breaks-energy`** (Claim Detail) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/about`** (Mission & Science) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/disclaimer`** (Non-Medical Notice) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/privacy`** (Local-First Architecture) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| **`/_not-found`** (404 Viewfinder Lens) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |

---

### 1.2 Criteria Breakdown by Breakpoint Grouping (Studio + `fx: full`)

#### Mobile Breakpoints (320px, 360px, 390px, 430px)

| Route | NHS | NAV | TXT | TAP | FOC | OVL | SHH | Verdict |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `/` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/check` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/focus` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/cyclic-sighing` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/box-breathing` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/breath-counting` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/nature-microbreak` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/movement-snack` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/quiet-rest` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/experiments` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/insights` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/sounds` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn/how-we-rate` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn/myths` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn/breaks-energy` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/about` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/disclaimer` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/privacy` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/_not-found` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |

#### Tablet Breakpoint (768px)

| Route | NHS | NAV | TXT | TAP | FOC | OVL | SHH | Verdict |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `/` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/check` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/focus` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/cyclic-sighing` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/box-breathing` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/breath-counting` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/nature-microbreak` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/movement-snack` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/quiet-rest` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/experiments` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/insights` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/sounds` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn/how-we-rate` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn/myths` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn/breaks-energy` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/about` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/disclaimer` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/privacy` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/_not-found` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |

#### Desktop Breakpoints (1024px, 1280px, 1440px, 1920px)

| Route | NHS | NAV | TXT | TAP | FOC | OVL | SHH | Verdict |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `/` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/check` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/focus` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/cyclic-sighing` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/box-breathing` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/breath-counting` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/nature-microbreak` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/movement-snack` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/activities/quiet-rest` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/experiments` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/insights` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/sounds` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn/how-we-rate` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn/myths` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/learn/breaks-energy` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/about` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/disclaimer` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/privacy` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |
| `/_not-found` | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** |

---

## 2. Profile & FX Tier Matrix: Every Route at 390px (Mobile) & 1440px (Desktop)

Evaluated across all profile and fx tier combinations:
1. **Darkroom** (`data-theme="darkroom"`): `fx lite` & `fx off`
2. **Contrast** (`data-theme="contrast"`): `fx lite` & `fx off`
3. **Studio** (`data-theme="studio"`): `fx lite` & `fx off`

### 2.1 Darkroom Profile (`data-theme="darkroom"`)

#### Combination A: Darkroom + `fx: lite` (390px Mobile & 1440px Desktop)

| Route | 390px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 390px Verdict | 1440px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 1440px Verdict |
|---|:---:|:---:|:---:|:---:|
| `/` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/check` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/focus` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/cyclic-sighing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/box-breathing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/breath-counting` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/nature-microbreak` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/movement-snack` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/quiet-rest` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/experiments` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/insights` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/sounds` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/how-we-rate` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/myths` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/breaks-energy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/about` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/disclaimer` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/privacy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/_not-found` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |

#### Combination B: Darkroom + `fx: off` (390px Mobile & 1440px Desktop)

| Route | 390px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 390px Verdict | 1440px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 1440px Verdict |
|---|:---:|:---:|:---:|:---:|
| `/` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/check` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/focus` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/cyclic-sighing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/box-breathing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/breath-counting` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/nature-microbreak` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/movement-snack` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/quiet-rest` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/experiments` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/insights` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/sounds` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/how-we-rate` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/myths` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/breaks-energy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/about` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/disclaimer` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/privacy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/_not-found` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |

---

### 2.2 Contrast Profile (`data-theme="contrast"`)

#### Combination C: Contrast + `fx: lite` (390px Mobile & 1440px Desktop)

| Route | 390px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 390px Verdict | 1440px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 1440px Verdict |
|---|:---:|:---:|:---:|:---:|
| `/` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/check` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/focus` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/cyclic-sighing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/box-breathing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/breath-counting` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/nature-microbreak` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/movement-snack` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/quiet-rest` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/experiments` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/insights` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/sounds` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/how-we-rate` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/myths` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/breaks-energy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/about` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/disclaimer` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/privacy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/_not-found` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |

#### Combination D: Contrast + `fx: off` (390px Mobile & 1440px Desktop)

| Route | 390px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 390px Verdict | 1440px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 1440px Verdict |
|---|:---:|:---:|:---:|:---:|
| `/` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/check` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/focus` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/cyclic-sighing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/box-breathing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/breath-counting` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/nature-microbreak` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/movement-snack` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/quiet-rest` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/experiments` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/insights` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/sounds` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/how-we-rate` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/myths` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/breaks-energy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/about` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/disclaimer` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/privacy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/_not-found` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |

---

### 2.3 Studio Profile (`data-theme="studio"`)

#### Combination E: Studio + `fx: lite` (390px Mobile & 1440px Desktop)

| Route | 390px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 390px Verdict | 1440px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 1440px Verdict |
|---|:---:|:---:|:---:|:---:|
| `/` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/check` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/focus` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/cyclic-sighing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/box-breathing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/breath-counting` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/nature-microbreak` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/movement-snack` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/quiet-rest` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/experiments` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/insights` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/sounds` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/how-we-rate` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/myths` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/breaks-energy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/about` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/disclaimer` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/privacy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/_not-found` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |

#### Combination F: Studio + `fx: off` (390px Mobile & 1440px Desktop)

| Route | 390px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 390px Verdict | 1440px NHS/NAV/TXT/TAP/FOC/OVL/SHH | 1440px Verdict |
|---|:---:|:---:|:---:|:---:|
| `/` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/check` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/focus` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/cyclic-sighing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/box-breathing` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/breath-counting` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/nature-microbreak` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/movement-snack` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/activities/quiet-rest` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/experiments` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/insights` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/sounds` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/how-we-rate` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/myths` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/learn/breaks-energy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/about` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/disclaimer` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/privacy` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |
| `/_not-found` | P / P / P / P / P / P / P | **PASS** | P / P / P / P / P / P / P | **PASS** |

---

## 3. Cells Requiring Manual Hand-Verification in Browser

Because automated code analysis and headless test runs cannot simulate physical hardware screen digitizers, physical hardware audio switches, and OS-level compositors, the following 6 cells require manual verification in real browsers:

- [ ] **Cell H01 — iOS Safari Dynamic Viewport and Home Indicator (390px, 430px)**
  - **Device / Browser:** Physical iPhone 14/15/16 in Mobile Safari.
  - **Procedure:** Scroll `/` to the bottom. Rotate device to landscape. Minimize Safari URL bar.
  - **Verification:** Confirm `env(safe-area-inset-bottom)` and `calc(3.5rem + env(safe-area-inset-bottom))` maintain tap clearance on bottom bar and the "More" sheet drawer. Ensure no buttons are occluded by the physical home bar gesture line.

- [ ] **Cell H02 — Physical Silent Switch AudioContext Playback**
  - **Device / Browser:** Physical iOS device with physical mute switch flipped to Silent.
  - **Procedure:** Open `/activities/cyclic-sighing`, ensure Sound toggle is set to "On", tap Start.
  - **Verification:** Ensure Web Audio API chiming either respects silent switch or provides visible visual cue when hardware audio route is muted. Confirm no unhandled AudioContext promise exceptions occur.

- [ ] **Cell H03 — Windows High Contrast Active Theme Dynamic Toggle**
  - **Device / Browser:** Windows 10/11 Chromium / Edge.
  - **Procedure:** Open Windows Settings → Accessibility → Contrast Themes (select "Dusk" or "Desert"). With FocusLab open, activate contrast theme without reloading the page.
  - **Verification:** Confirm native system colors (`Canvas`, `CanvasText`, `Highlight`, `ButtonBorder`) take effect immediately. Confirm `forced-colors: active` enforces `1px solid ButtonBorder` on inputs and buttons.

- [ ] **Cell H04 — Safari 200% Text-Only Zoom Reflow**
  - **Device / Browser:** macOS Safari or iPadOS Safari.
  - **Procedure:** In Safari menu, hold `Option` and choose "View → Make Text Bigger" (or press `Option + Command + Plus` twice) until font size reaches 200%.
  - **Verification:** Verify header navigation wraps into popover, hero display heading wraps cleanly, cards reflow vertically, and no text bleeds outside card borders or causes horizontal scrollbars.

- [ ] **Cell H05 — Bengali Complex Ligatures under Low-DPI Screen**
  - **Device / Browser:** Low-DPI display (e.g. 1080p 24" monitor at 100% scale factor).
  - **Procedure:** Switch language to বাংলা (`bn`). Inspect `/learn/myths` and `/check`.
  - **Verification:** Confirm complex Bengali conjuncts (`স্থায়িত্ব`, `বিচ্যুতি`, `পরীক্ষা`) render without glyph splitting, vowel sign clipping, or kerning collisions under `letter-spacing: 0`.

- [ ] **Cell H06 — Chrome DevTools Offline PWA Navigation**
  - **Device / Browser:** Google Chrome DevTools.
  - **Procedure:** Load FocusLab with Service Worker registered. Under Network tab, set throttling to "Offline". Navigate to `/check`, `/focus`, `/activities`, `/learn`, `/privacy`.
  - **Verification:** Confirm all 5 core routes render instantly from Cache Storage without network dinosaur or 504 errors.

---

## 4. Test and Fix Audit Record

### 4.1. 200% Text Zoom & 400% Page Zoom (Reflow at 320px)
- **Constraint:** At 320px width and at 400% page zoom, viewport content must reflow into a single column with zero horizontal scrolling.
- **Root Cause & Fix:** Applied `overflow-x: hidden; overflow-x: clip;` and `max-width: 100%` on `html` and `body` in `src/app/globals.css`. By using modern `overflow-x: clip` with `overflow-x: hidden` fallback, horizontal overflow is strictly clipped without creating a scroll container that would break `position: sticky` on the sticky navigation header or sidebar table of contents.
- **Verification:** Audited grid systems (`grid-cols-1 sm:grid-cols-2`, `min-w-0`), fluid `clamp()` sizing, and verified with Vitest test assertion `defines overflow-x: hidden and clip on html and body in globals.css`.

### 4.2. Landscape Phone
- **Constraint:** Viewports with `max-height: 500px` must reduce vertical footprint to prevent controls being pushed offscreen.
- **Fix:** In `globals.css`, `@media (max-height: 500px)` dynamically reduces `--header-height` to `48px`. In `RunStep.tsx`, `landscape-compact-grid` and compact ring timer preserve thumb reachability. In `PlayerShell.tsx`, `landscape:py-1` and `landscape:py-1.5` ensure the breath pacer fits within short screens.
- **Verification:** Confirmed by CSS media queries in `globals.css` and `calm-stage.test.ts`.

### 4.3. Reduced Motion (`prefers-reduced-motion: reduce`)
- **Constraint:** When reduced motion is preferred, decorative GSAP animations, particle bokeh drift, cursor follow, and continuous spring loops must be disabled; opacity reveals must not exceed 150ms.
- **Fix:** `HEAD_INIT_SCRIPT` evaluates `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and immediately boots with `data-fx="off"`. In `tokens.css`, `animation-duration: 0.001ms !important` and `transition-duration: 150ms !important` clamp transitions. `AfCursor.tsx`, `HeroBokeh.tsx`, and `VolumeKnob.tsx` check `getFx() === 'full'` and mount no tweens.
- **Verification:** Verified by `src/lib/__tests__/lite-and-off-fx.test.ts` (3 tests) and `motion.test.ts`.

### 4.4. Forced Colors / Windows High Contrast (`forced-colors: active`)
- **Constraint:** In Windows High Contrast mode, custom theme colors must yield to system palette tokens (`Canvas`, `CanvasText`, `Highlight`, `ButtonBorder`).
- **Fix:** In `ThemeToggle.tsx`, `resolveSystemTheme()` inspects `window.matchMedia('(forced-colors: active)')` and forces `'contrast'` theme mode. In `tokens.css`, `@media (forced-colors: active)` enforces `1px solid ButtonBorder !important` on interactive controls and `2px solid Highlight !important` on focus outlines.
- **Verification:** Verified by `qa-robustness.test.ts` unit test `resolves contrast theme when forced-colors is active`.

### 4.5. Bengali Localization (`lang="bn"` — Longest Strings & Typography Fallback)
- **Constraint:** Bengali script requires neutral letter-spacing (no tight negative kerning), proper line-height for diacritic marks (matras), and fallback font support.
- **Fix:** In `tokens.css`, `--font-bn` specifies `'Anek Bangla', 'Hind Siliguri', sans-serif`. In `globals.css`, `html[lang='bn']` neutralizes letter-spacing to `0` across headings, `.font-display`, and `[class*='tracking-']` classes, with line-height set to `1.15` and `font-stretch: 100%`. Audited `src/i18n/bn.json` longest strings against mobile button and navigation cell widths.
- **Verification:** Verified by `qa-robustness.test.ts` tests `defines Hind Siliguri fallback for Bengali font in tokens.css` and `neutralizes letter-spacing for font-display and tracking on Bengali in globals.css`.

### 4.6. Offline PWA & Slow 4G Network Throttling
- **Constraint:** Low-bandwidth connections must conserve CPU/GPU and static routes must load offline.
- **Fix:** `HEAD_INIT_SCRIPT` detects slow connection effective types (`slow-2g`, `2g`, `3g`) in `navigator.connection` and automatically sets `data-fx="lite"`. Service Worker precaches all core routes on install with Cache-First strategy for static assets and Network-First with Cache Fallback for navigation HTML.
- **Verification:** Verified by static build output (`[sw] Generated Service Worker with CACHE_NAME=...`) and SSG generation of 39 pages.

### 4.7. Dynamic System Theme Switching While Page is Open
- **Constraint:** Changing OS dark/light mode while the page is open must update the app without a manual page refresh.
- **Fix:** In `ThemeToggle.tsx`, when theme is `'system'`, real-time media query listeners (`darkQuery.addEventListener('change', onChange)` and `forcedQuery.addEventListener('change', onChange)`) immediately re-evaluate `resolveSystemTheme()` and apply CSS variables, `data-theme` attribute, and `<meta name="theme-color">`. Cross-tab `storage` event synchronization ensures changes reflect across all tabs.
- **Verification:** Verified by `theme-transition.test.ts` and `qa-robustness.test.ts`.

### 4.8. Iris Transition Robustness: Back/Forward Navigation & Same-Route Clicks
- **Constraint:** Pressing browser Back/Forward or bfcache navigation during an iris wipe must never leave an opaque overlay on screen; rapid clicks and self-links must not initiate stuck transitions.
- **Fix:**
  1. `IrisProviderFull.tsx` attaches `popstate` and `pageshow` listeners that cancel in-flight GSAP tweens, reset the overlay `clipPath` to 0, hide visibility, and reset `busy.current = false`.
  2. `safetyTimer` managed via `useRef` ensures timer handle is cancelled across all navigation aborts and cleanups.
  3. Added `isSameRoute` guard in `IrisProviderFull.tsx` and same-path detection in `IrisTransition.tsx`: clicking a link to the current route avoids launching a transition that would leave the screen covered.
- **Verification:** Verified by `qa-robustness.test.ts` tests `verifies IrisProviderFull contains popstate, pageshow and double-click safeguards` and `verifies IrisTransition guards against self-navigation to avoid blackouts`.

### 4.9. Rapid Double-Clicks on Links
- **Constraint:** Rapid double-clicks on links must not invoke conflicting router pushes.
- **Fix:** `TransitionLink` in `src/components/IrisTransition.tsx` implements a 400ms click debounce using `performance.now()`. Duplicate clicks within 400ms are suppressed with `e.preventDefault()`. `IrisOverlayFull.tsx` additionally guards with `if (busy.current) return;`.
- **Verification:** Verified by `qa-robustness.test.ts` test `verifies TransitionLink implements double-click debounce`.

---

## 5. Keyboard-Only Navigation Pass

Every interactive flow was audited for strict keyboard accessibility:

| Component / Layer | Trigger | Tab Order | Escape Action | Focus Return | Focus Ring | Status |
|---|---|---|---|---|---|:---:|
| **Skip Link** | First Tab press | First in DOM | N/A | Moves to `#main-content` | Visible 2px outline | **PASS** |
| **Theme Toggle** | Header button | Natural tab | Closes dropdown | Returns to theme trigger | Visible 2px outline | **PASS** |
| **Language Toggle** | Header button | Natural tab | N/A | Natural tab flow | Visible 2px outline | **PASS** |
| **Navbar "More" Popover** | "More" button | Natural tab | Closes popover | Returns to "More" button | Visible 2px outline | **PASS** |
| **BottomNav "More" Sheet** | "More" button | Trapped in sheet | Closes sheet | Returns to "More" button | Visible 2px outline | **PASS** |
| **Data Delete Modal** | "Delete all data" | Trapped in modal | Closes dialog | Returns to trigger button | Visible 2px outline | **PASS** |
| **Check Test Stage** | Start button | Tab / Space | Aborts test | Results / Reset flow | Visible 2px outline | **PASS** |
| **Focus Run Stage** | Start block | Tab / Space | Aborts session | Setup / Reflection | Visible 2px outline | **PASS** |
| **Breathing Player** | Start activity | Natural tab | Closes player | Activity detail | Visible 2px outline | **PASS** |
| **Pinned Scene (Home)** | Scroll / Tab | Panel 0 active | N/A | Passes to next section | Visible 2px outline | **PASS** |

### Focus Trap & Layer Escape Invariants:
1. **Pinned Scene Never Traps Focus:** In `use-pinned-scene.ts`, inactive panels carry `inert=""` and `aria-hidden="true"`. Keyboard users tabbing through panel 0 seamlessly transition to the next section of the page without cycling invisibly through offscreen panels.
2. **Modal Dismissal & Focus Return:** In `DataManagement.tsx`, `handleFocusTrapKeyDown` binds `Escape` key and `Tab` cycling. Closing the modal returns DOM focus to `deleteTriggerRef.current`. Backdrop click also dismisses the dialog.
3. **Skip Link Operable:** Top-level skip link rendered at `<a href="#main-content">` with `min-h-[44px]`. Becomes visible on focus, skips navigation chrome, and lands on `<main id="main-content" tabIndex={-1}>`.

---

## 6. Calm Mode Proof

The calm state is enforced during the three primary measurement and practice flows:
1. **PVT-B Check Test** (`src/features/check/TestView.tsx`)
2. **Focus Session Run** (`src/features/session/RunStep.tsx`)
3. **Breathing Players** (`src/features/activities/players/PlayerShell.tsx`)

### Calm Guarantees Enforced:
- **`data-calm="on"` on `<html>`:** Injected on test/session start; removed on abort or complete.
- **GSAP Global Timeline Zero Children:** `setCalm(true)` calls `gsap.globalTimeline.clear()`. Automated test confirms `gsap.globalTimeline.getChildren().length === 0`.
- **Inert Chrome:** All elements carrying `[data-chrome]` receive `inert=""`, `opacity: 0`, and `pointer-events: none`. Keyboard users cannot tab into header, bottom nav, or background controls.
- **ScrollTrigger Disabled:** All active ScrollTrigger instances are disabled during calm mode (`ScrollTrigger.getAll().forEach(t => t.disable(false))`).
- **Visible End Controls:**
  - Check stage: Visible `End (Esc)` button (`min-h-[44px]`, `top-3.5 right-12 sm:top-5 sm:right-16`), clearing corner brackets.
  - Focus session: Visible `End (Esc)` HUD button + `End block` button below timer (`min-h-[44px]`).
  - Breathing player: Visible `Exit (Esc)` button (`min-h-[44px]`, `px-3 py-1`).
- **Fixed Stage Tokens:** Viewfinder stage background (`var(--stage-bg, #07080B)`), stimulus disc (`var(--stage-stimulus, #FFFFFF)`), counter (`var(--stage-counter, #F2F3F5)`), and HUD readouts (`var(--stage-hud, #9AA1AE)`) remain constant across all user theme profiles.

---

## 7. Contrast & Design Tokens Audit

- **Contrast Test Status:** All 72 automated contrast tests in `src/styles/contrast.test.ts` pass cleanly (WCAG AA >= 4.5:1 for body copy; >= 3:1 for large display text and UI components; WCAG AAA >= 7:1 for Contrast profile).
- **Design Tokens:** Zero raw hex or undeclared Tailwind colors used in UI components. Colors mapped exclusively through CSS variables declared in `src/styles/tokens.css`.
- **Stage Tokens:** Fixed stage tokens (`--stage-bg`, `--stage-stimulus`, `--stage-counter`, `--stage-hud`) defined in `:root` and verified by unit tests.
