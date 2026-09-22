# Hansum Order — Design System (v1.1 — final implementation)

> **Superseded (2026-09-22).** The customer interface described here was replaced by the approved Design V2.1 port. See `CHANGELOG.md` and `FUNCTION_TO_UI_MAP.md` for the current state. Kept for history.


Scope: the two ordering pages only — `hansum.html` (Da Nang) and `hansum-saigon.html` (Saigon).
This is a **visual/UX system**. It defines no behaviour. Every rule below is expressed as CSS/markup
classes; none of it may change Vue data, methods, bindings, prices, payloads or storage keys
(see *Functionality freeze* in `hansum-order-redesign-plan.md`).

Direction: **Premium Korean shisha lounge, seen at night.** Near-black foundation, one warm gold accent,
serif display type, cinematic photography, and a whisper of the brand's blue/pink nightlife glow.
Minimal, calm, and fast to order from. Not a restaurant template, not neon, not glass.

Method: UI/UX Pro Max checklist (accessibility → touch → performance → style → layout → type/colour →
motion → forms → navigation) applied to the existing Hansum brand. The dataset's generic recommendation
(light palette, "Liquid Glass") was rejected as off-brand; its verified rules (contrast, focus, target size,
fixed-element clearance, reduced motion, no emoji icons, motion tokens) were kept.

---

## 1. Colour tokens

Dark only. Brand hexes are preserved (`#050505`, `#d9b86c`, `#efd58e`, `#b68830`).

| Token | Value | Use | Contrast (on `--o-surface`) |
|---|---|---|---|
| `--o-bg` | `#050505` | page | — |
| `--o-surface` | `#0d0d10` | cards, sheets | — |
| `--o-surface-2` | `#141418` | raised / nested / inputs | — |
| `--o-line` | `rgba(255,255,255,.10)` | hairlines, card borders (decorative) | — |
| `--o-line-strong` | `rgba(255,255,255,.34)` | control outlines (needs 3:1) | 3.05 |
| `--o-text` | `#f5f1e8` | primary text, names | 17.2 |
| `--o-text-2` | `#cfcac0` | body / descriptions | 11.9 |
| `--o-text-3` | `#a8a49b` | secondary labels | 7.8 |
| `--o-text-4` | `#8d8a83` | lowest allowed meta (never for prices/actions) | 5.6 |
| `--o-gold` | `#d9b86c` | accent, prices, selection | 10.2 |
| `--o-gold-hi` | `#efd58e` | hover/pressed highlight, focus ring | 13.5 |
| `--o-gold-lo` | `#b68830` | gradient depth, dividers on gold | 6.1 |
| `--o-on-gold` | `#0a0a0a` | text on gold | 10.4 (on gold) |
| `--o-danger-text` | `#ffb4b4` | error copy (paired with icon) | 10.5 |
| `--o-glow-blue` | `rgba(39,111,255,.14)` | ambient nightlife glow (hero/success only) | decorative |
| `--o-glow-pink` | `rgba(255,49,168,.12)` | ambient nightlife glow (hero/success only) | decorative |

Rules
- Old secondary text (`white/40`, `white/35`) measured **3.8:1 / 3.2:1** and is retired. Nothing below `--o-text-4`.
- Gold is the *only* accent. Blue/pink appear only as low-opacity ambient light behind hero and success, never on controls.
- State is never colour-only: selected = gold border **+ check glyph + text "SELECTED"**; error = tinted box **+ icon + text**.
- No raw hex in components; everything reads a token.

## 2. Typography

| Role | Family | Size / line-height | Weight | Notes |
|---|---|---|---|---|
| Display | Playfair Display | `clamp(2.25rem, 9vw, 3rem)` / 1.05 | 600 | hero, success title |
| H1 (step title) | Playfair Display | 2rem / 1.1 | 600 | one per view |
| H2 (card/category title) | Playfair Display | 1.5rem / 1.15 | 600 | product & category names |
| H3 | Playfair Display | 1.25rem / 1.2 | 600 | tile titles |
| Body | Inter | 1rem / 1.55 | 400 | descriptions |
| Small | Inter | .875rem / 1.5 | 400–500 | notes |
| Label | Inter | .75rem (12px) / 1.3, uppercase, `letter-spacing:.16em` | 600 | eyebrows, step captions |
| Price | Inter | 1.0625–1.25rem, `tabular-nums` | 600 | gold |
| Numeric hero (sliders) | Cinzel (`--o-font-sig`) | 4.5rem / 1 | 500 | slider values |
| Wordmark, order reference, subtotal, table numerals | Cinzel (`--o-font-sig`) | as component | 600 | signature face — used for nothing else |

- **Minimum text size is 12px.** The previous 7–10px labels are removed. 
- **Hangul / Chinese:** the UI ships `EN / 中文 / 한국어`. None of Playfair Display, Inter or Cinzel contains CJK glyphs,
  so each stack ends in system CJK faces (zero download):
  - display: `"Playfair Display", Georgia, "Noto Serif KR", "Apple Myungjo", "Nanum Myeongjo", "Batang", "Songti TC", "Noto Serif CJK KR", serif`
  - body: `Inter, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK KR", system-ui, sans-serif`
- Long names wrap (never truncate prices or item names): `overflow-wrap:anywhere` on text children, `min-width:0` on flex text.
- Tabular figures on every price, quantity and total so columns never shift.

## 3. Spacing, radius, elevation, z-index

- **Spacing (4pt):** `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56 · 72` → `--o-s1 … --o-s10`.
- **Gutter:** 20px on phones (≥16 at 375), 32px at ≥768.
- **Radius:** `--o-r-sm 12` (controls) · `--o-r-md 16` (nested) · `--o-r-lg 20` (cards) · `--o-r-xl 28` (hero, sheets) · `999` (pills).
- **Elevation:** `e0` none · `e1` `0 10px 28px rgba(0,0,0,.38)` (cards) · `e2` `0 -14px 36px rgba(0,0,0,.55)` (sticky bars).
  No coloured glows on cards; selection uses border + inset ring, not a shadow that leaks.
- **z-index scale:** base 0 · quick-nav 10 · header 20 · cart bar 40 · overlays 100.
- **Glass:** allowed **only** on the sticky cart bar and quick-nav (blur signals "content passes behind"). Cards are solid.

## 4. Buttons (one primary per screen)

| Type | Look | Use |
|---|---|---|
| **Primary** | solid `--o-gold`, `--o-on-gold` text, 52px tall, radius 14, 14px/700, `letter-spacing:.14em`, uppercase | the single next step: Continue, Review Order, Confirm & Send |
| **Secondary** | transparent, 1px `--o-gold` border, gold text, 48px | Add More, Drinks, alternative path |
| **Tertiary** | text-only, `--o-text-2`, 44px | Back, Finish |
| **Chip / pill** | 44px tall hit area, 1px `--o-line-strong` | quick-nav, language |
| **Icon (stepper)** | 44×44 hit area, 36px visual | quantity −/+ |

States: hover (desktop only) lifts to `--o-gold-hi`; **pressed** = `scale(.98)` + `--o-gold-lo`; **disabled** = 40% opacity,
`cursor:not-allowed`, no press motion; **busy** keeps its label (the app already swaps the label to *SENDING…*).
`touch-action:manipulation` on all controls (no 300ms delay). Hit areas ≥ 44×44; adjacent targets ≥ 8px apart. (Language pills are 36px tall visually; an invisible `::after` extends their hit area to 44px.)

## 5. Cards & selection

- **Card:** `--o-surface`, 1px `--o-line`, radius 20, `e1`. Interactive cards press to `scale(.985)` (120ms).
- **Product card (shisha):** image on top (fixed aspect so the grid doesn't jump), then eyebrow → name (H2) → note → price at right → a footer row "SELECT →". The image is the visual anchor.
- **Selected state (all selectable things):** border `--o-gold`, inset ring `0 0 0 1px --o-gold-lo`, a **✓ badge** (28px gold disc) and the word **SELECTED**. Unselected cards keep the hairline.
- **Option tile (refill, flavour, add-on):** same border/selection language, smaller.
- **Image handling:** `object-fit:cover`, explicit `width/height`, `aspect-ratio` on wrappers, `decoding="async"`, `loading="lazy"` below the fold. A bottom scrim (`linear-gradient(transparent, rgba(5,5,5,.85))`) protects any text over photos (≥ 4.5:1).

## 6. Forms & inputs

- Text inputs/textarea: `--o-surface-2`, 1px `--o-line-strong`, radius 14, **16px** font (prevents iOS zoom), 48px min height, visible focus ring, placeholder `--o-text-3`.
- **Sliders:** 44px tall hit area; a 6px neutral track (`rgba(255,255,255,.36)`, ≥ 3:1) and a 32px gold thumb with a dark inner border and a 1px gold ring. A gold "filled" portion is deliberately not used — it would need JavaScript to track the value. The value is shown as a large numeral above the slider with 12px end-labels beneath. Each slider carries a static `aria-label` (Intensity / Cool / Mint).
- Every input has a programmatic name (`aria-label` or `<label>`); no placeholder-only labelling.

## 7. Navigation & orientation ("where am I")

- **Header (compact):** back (44px) · brand lock-up · table chip. The back control keeps existing behaviour; only its size/contrast changes.
- **Step progress:** 8 segments (existing binding), 3px tall, gold when reached, plus a **12px caption** "STEP 02 · BOWL". Always visible on steps 1–7.
- **Table chip:** "TABLE 05" (+ "QR" tag when locked) — the user always sees where their order will go.
- **Drinks (step 9):** the category **quick-nav is sticky and pins to the top of the viewport** once the header scrolls away (horizontal chips — this scroll is an existing intentional interaction; it also covers the top safe-area inset). Category cards get `scroll-margin-top` so a jump never hides the heading under the bar.
- **Cart bar (drinks):** fixed to the bottom, `padding-bottom: env(safe-area-inset-bottom)`, shows count + subtotal (tabular) + primary "REVIEW ORDER". Page content reserves clearance so the bar never covers the last item or focused control.
- **Success screens (8, 11):** centred, one large ✓ mark, order reference in a card, then a prominent **Order More** panel (§14) so the customer sees the menu is still open. `FINISH` / `DONE` is a quiet tertiary button below it.

## 8. Cart, review & receipt

- Receipt card: label/value rows on a 16px rhythm with hairline separators; values right-aligned, tabular.
- **Subtotal is the largest value on the card** (Cinzel 28, gold — signature face). VAT note is 12px `--o-text-3`, never smaller.
- Item lines in the drinks review: name + `×qty` left, line total right.
- Error box: 1px tinted border, icon + text, `role="alert"`.

## 9. Motion (subtle, meaningful, interruptible)

Only `transform` and `opacity`. No animation blocks input. Everything collapses under `prefers-reduced-motion: reduce`.

| Token | Value | Use |
|---|---|---|
| `--o-dur-press` | 120ms | press feedback |
| `--o-dur-state` | 200ms | selected / hover / toggle |
| `--o-dur-enter` | 320ms | view & card entrance |
| `--o-dur-exit` | 200ms | exits (≈ 60–70% of enter) |
| `--o-ease` | `cubic-bezier(.2,.8,.2,1)` | arrivals (decelerate) |

| Moment | Treatment |
|---|---|
| View change (each `step`) | fade + 8px rise, 320ms |
| Product/category cards | stagger 40ms, capped at 6 items, then all at once |
| Selected state | border/ring cross-fade 200ms; ✓ badge pops `scale .6→1` |
| Button press | `scale(.98)`, 120ms |
| Cart bar | slides up 12px + fade (Vue `<transition>` around the existing `v-if`) |
| Quantity stepper | pops in when an item is first added |
| Category jump | native smooth scroll (existing) |
| Slider drag | thumb presses in `scale(1.12)` (120ms); the big value turns gold while the slider is active (`:focus-within` / `:active`) |
| Sending (loading) | the send button carries `aria-busy="true"`; a 4px sweep runs along its bottom edge, `transform` only, for the length of the request. Reduced motion: static bar |
| Success (steps 8, 11) | the ✓ draws itself once (`stroke-dashoffset`, 380ms) — the one non-transform animation: a single 38px icon, paint-only, never repeats |
| Error alert | fades + rises in via the existing view-child rule |

**Deliberately absent:** step-exit transitions. A Vue leave must finish before the next step mounts, which would delay the
customer's next tap. Enter motion alone carries navigation, and every control is tappable from the first frame.

Motion for React is intentionally **not** used: the app is Vue and CSS/Vue transitions cover every moment above
with zero added JavaScript.

## 9a. Ambient background
A fixed, very low-opacity radial (gold top, faint blue lower-left, faint pink lower-right) on `body`. Static; no animation, no blur filter over content.

## 10. Responsive rules

Design order: **375 → 390 → 414 → 430**, then **768 · 1024 · 1440**.

| Width | Behaviour |
|---|---|
| 375–430 | single column, 20px gutters (16 at 375), full-width cards, 2-up grids only for compact tiles (refill, flavour, welcome tiles) |
| ≥ 430 | slightly larger display type via `clamp` |
| ≥ 768 | centred column (`max-width: 40rem`), 32px gutters, hover states enabled |
| ≥ 1024 | drinks column widens to `48rem`; category item lists become 2-up grids |
| ≥ 1440 | same centred column; ambient background shows around it; type does not scale further |

- No horizontal scroll anywhere except the quick-nav (existing). `min-width:0` on all flex/grid text children.
- `min-height: 100dvh` (not `100vh`), safe-area insets top/bottom, `viewport-fit=cover` retained, zoom never disabled.
- Text measure ≤ 65ch.

## 11. Accessibility

- Contrast: text ≥ 4.5:1 everywhere (lowest token 5.6:1); UI outlines ≥ 3:1.
- **Focus:** `:focus-visible` → 2px `--o-gold-hi` outline, 3px offset (inset on clipped cards). Sticky bars never cover a focused control (`scroll-padding`).
- Keyboard: full tab order = visual order; **skip link** to `#main`; all interactive elements are real `<button>`/`<a>`/`<input>`.
- Names & state: icon-only controls have `aria-label`; toggles expose `aria-pressed`; the language switch is a labelled group; decorative glyphs/emoji are `aria-hidden`.
  These are **attribute-only additions** — no behaviour changes.
- Motion: `prefers-reduced-motion` honoured (see §9).
- Colour is never the only signal (see §1).
- No text below 12px; touch targets ≥ 44px.

## 12. Performance budget

- **No new dependencies.** No animation library, no icon font, no framework.
- One shared stylesheet `css/order.css` (cached across both pages) replaces ~2 × 17KB of duplicated inline CSS.
- The two inline base64 bowl images (~1MB in each HTML file) were removed from the HTML. The final build uses the clean product photos `images/cosmo-bowl.jpg` and `images/oblako-bowl.jpg` (768×1024, already in the repo) — cacheable and shared. The earlier extracted posters (`order-bowl-*.jpg`, with a caption baked in) are no longer used.
- Tailwind's runtime CDN (render-blocking JIT compiler) is **removed**. An automated class audit (`classaudit.mjs`) proves every class used by both pages is defined in `css/order.css`; `order.css` carries its own reset in place of Tailwind's preflight.
- Fonts: one Google Fonts request — Playfair Display 500–700, Inter 400–700, Cinzel 500–700 (all `display=swap`); CJK uses system fonts. If fonts are blocked the page falls back to Georgia / system-ui and still works.
- Images: explicit dimensions (no layout shift), lazy-load below the fold.

## 13. Icons

The current UI uses emoji as icons (add-ons `🧊 🍵 🥛 🥃 ☕`, Saigon flavour cards). Emoji come from **data** (`addonOptions`, `flavorDirections`), which is frozen, so they are **kept but treated as decorative** (`aria-hidden`, fixed-size glyph box). All *structural* icons the redesign adds (check, arrow, plus/minus, warning) are inline SVG, stroke 2, one visual language.

## 14. Final implementation rules (V1)

**Preferences (step 4) — one combined screen: INTENSITY · COOL · MINT**
- Defaults **5 / 0 / 0**; minimum **0** (`min="0"` on the input, clamp floor 0 in `setPref` / `clampPreferences`).
- Maximum: **Classic (Blonde Leaf) = 5**; **Dark Leaf (Premium) = 10**; Refill Blonde, Refill Dark and Fruit Head keep the existing behaviour (10). The clamp applies to all three sliders of a shisha, as it always has (`prefMax`).
- The 0–10 numerals sit under each slider. Numerals above the maximum are struck through and the track past the maximum is hatched (`.o-range--capped`). The gold fill and the active value follow the thumb (`--v`).
- The warning "Maximum intensity is 5. For stronger intensity, please select Dark Leaf." appears **only** for Classic (`prefMax===5`). Never for Dark Leaf, Fruit Head or either refill.
- The subtitle reads "Slide from 0 (none) up to N" where N is the current maximum. The old "Scale 1–10 — slide to 0 for none" wording is retired.
- Internal fields are unchanged: `order.intensity`, `order.mint` (COOL) and `order.mintiness` (MINT). A table switch resets to 5 / 0 / 0.
- The MINT slider still shows only for Classic and Premium (as before).

**Bowl (step 2) — customer-facing: Egyptian Bowl / Phunnel Bowl only**
- Exactly two cards. No brand chooser, no "View options", no brand names in labels, alt text, review or captions.
- The internal values sent to staff (`order.bowl` = `Egyptian Bowl — Cosmo` / `Phunnel Bowl — Oblako`) are unchanged so the order system and Telegram message keep working. The customer sees `bowlLabel` (a computed that strips the suffix).
- Selecting a bowl goes **directly** to Flavor Profile (`selectBowl` → `step=3`).
- The bowl photos are the clean product shots; the maker's name is **physically engraved** on the bowls and remains visible in the photograph.

**Order More (steps 8 and 11)**
- Below the order reference: an "ORDER MORE" panel — "WANT SOMETHING ELSE?" / "Order more Shisha or Drinks anytime. The menu is still open." with **DRINKS** (primary → `startMoreOrder`, step 9) and **SHISHA** (secondary → `startMoreShisha`, step 1). Each starts a new additional order; the order can be repeated indefinitely (references `<original>-A01`, `-A02`, …).
- Drinks remain an independent flow with their own cart and their own order reference; they are never forced into the first shisha order.
- Order status: there is no status feed from staff to the customer's device. The success screen states only what is true — the order was sent. No CONFIRMED / REJECTED states exist in production.
