# Hansum Order App — Visual Redesign Plan

> **Superseded (2026-09-22).** The customer interface described here was replaced by the approved Design V2.1 port. See `CHANGELOG.md` and `FUNCTION_TO_UI_MAP.md` for the current state. Kept for history.


Companion to `hansum-order-design-system.md`. **UI/UX only. Zero functional change.**

## 1. Baseline (what exists today)

Both pages are single-file Vue 3.5.13 apps (global build, self-hosted `js/vue.global.js`) styled with
**Tailwind's runtime CDN** plus ~17KB of hand-written inline CSS each. They are **not identical copies**:

| | Da Nang `hansum.html` | Saigon `hansum-saigon.html` |
|---|---|---|
| Version tag | v5.8.2 | v5.7.6 |
| Entry | QR only (`?table=NN`); **no table chooser** — without `?table=` the page renders an empty `<main>` | QR **or** an on-page table chooser (step 0, `v-else-if`) |
| Flavour cards | photo cards (`images/flavor/*.jpg`), `aria-label`ed | emoji + text cards (data-driven icons) |
| Prices | Dark Leaf 680,000 · Fruit Head 980,000 | Dark Leaf 780,000 · Fruit Head 1,180,000 |
| Menu | 9 categories, Da Nang prices | different drinks, prices and an extra *Tea* category |
| Telegram | `HANSUM_TELEGRAM_ENDPOINT` | `HANSUM_SAIGON_TELEGRAM_ENDPOINT` |
| Weight | ~1.06MB (two inline base64 bowl images ≈ 1MB) | ~1.06MB (same) |

Flow (identical in both): `0 welcome → 1 shisha → 2 bowl → 3 flavour → 4 preferences → 6 add-ons → 7 review → 8 sent → 9 drinks → 10 drinks review → 11 sent` (step 5 is unused).
Persistence: `localStorage` keys `hansumOrderV55` (state) and `hansumLocale`. Submission: `POST` JSON to the location's Worker.

### Visual problems found (from screenshots at 390px and code)
1. **Legibility:** 7–10px labels throughout (`text-[7px]`…`[10px]`); secondary text at `white/35–40` = 3.2–3.8:1 (fails 4.5:1).
2. **Header is heavy and unclear:** logo, wordmark, tagline, table, 8-segment bar, caption and language switch stack into ~190px before content; the language pills are ~8px text with ~14px hit areas.
3. **Inconsistent product cards:** Blonde/Dark Leaf use a 180px cropped photo; Fruit Head shows an uncropped portrait (~500px tall) with a different padding model.
4. **Weak selected state:** a thin gold border + tiny "SELECTED" caption; hover styles on touch.
5. **Drinks page is a ~8,000px text wall** with no persistent orientation; the category chips scroll away; add/qty controls are 30px.
6. **Glassmorphism everywhere:** `backdrop-filter` on every card.
7. **Type:** Cinzel/Montserrat only — Hangul and Chinese (which the UI ships) fall to whatever the OS picks.
8. **Two competing systems:** Tailwind arbitrary values (`text-[8px] tracking-[.28em]`) mixed with page-local CSS, duplicated across both pages and already drifted.
9. **Weight:** ~1MB of base64 images inside each HTML file; ~300KB Tailwind JIT script.
10. **Accessibility gaps:** no `:focus-visible`, no skip link, unlabelled sliders/inputs, selection conveyed by colour, no reduced-motion handling.

## 2. Functionality freeze (contract)

Nothing below may change:
menu data · product names · prices · calculations · quantity/cart logic · order submission · Telegram endpoints & payload ·
localStorage keys/behaviour · `?table=` & QR flow · Da Nang / Saigon routing · Vue business logic · visible copy.

**How the freeze is enforced (not just promised):**

1. **Static invariants** (`invariants.mjs`, run against `git HEAD`): the main `<script>` block is byte-identical; the endpoint `<script>` is byte-identical; the multiset of every Vue directive/binding (`v-*`, `@*`, `:*`) and every `{{ }}` interpolation is identical. The only permitted additions are attribute-only `:aria-*` bindings. `telegram-worker.js`, `index.html`, `style.css`, `script.js` must be untouched.
2. **Golden-master run** (`regress.mjs`): 60+ checkpoints per page across 8 scenarios (happy path, persistence, table switch, refill/fruit-head/specific/other/omakase, failing endpoint, locale, no-table, back-navigation). It records `localStorage` state and the exact Telegram payloads, then diffs before/after. Every Telegram request is intercepted — nothing reaches the live staff chat.
3. **Baseline captured before any edit**, twice, and shown deterministic.

If a visual idea needs a logic change, the idea is dropped.

## 3. Files

| File | Change |
|---|---|
| `hansum.html`, `hansum-saigon.html` | new markup classes/wrappers; **script block untouched**; inline CSS moved out; Tailwind CDN removed; base64 → file refs |
| `css/order.css` (new) | shared design-system stylesheet |
| `images/order-bowl-cosmo.jpg`, `images/order-bowl-oblako.jpg` | *(superseded in V1 — see §9)* |
| `docs/*.md` (new) | this plan + the design system |
| **Removed reference** | `<script src="https://cdn.tailwindcss.com">` (no longer needed — see class audit) |
| **Not touched** | `telegram-worker.js`, `index.html`, `style.css`, `script.js`, `js/vue.global.js`, any menu data |

## 4. Screen-by-screen

- **Header + progress** — compact 3-slot header (back / brand / table chip); language switch moves to a slim row (36px pills, 44px hit area) with `aria-pressed`; 3px gold progress + 12px "STEP 02 · BOWL" caption.
- **0 Welcome** — cinematic hero card; the two big tiles (Shisha / Drinks) become the unmistakable primary actions with 12px+ copy; site card, Wi-Fi and location QR cards get a consistent surface, spacing and text sizes.
- **0 Table chooser (Saigon only)** — 3-column grid of 80px tiles, clear selected state, primary Continue.
- **1 Shisha** — three cards on one grid (fixed image aspect), name/price/CTA hierarchy, ✓ badge selected state; refill options as a labelled 2-up tile pair.
- **2 Bowl** — two photo cards labelled EGYPTIAN BOWL / PHUNNEL BOWL only, caption bar with number + arrow, selected badge.
- **3 Flavour** — Da Nang: photo tiles restyled (radius, ring, ✓); Saigon: text tiles with decorative emoji (`aria-hidden`); "Other" textarea and Continue restyled.
- **4 Preferences** — large numeric readout, 44px slider hit area, 0–10 numerals, hatched cap zone, gold fill, 12px end-labels, static `aria-label`s.
- **6 Add-ons** — rows with a custom check control, price in gold, `aria-pressed`.
- **7 / 10 Review** — receipt card: hairline rows, subtotal as the hero number, VAT note ≥ 12px, primary Confirm + tertiary Back, `role="alert"` errors.
- **8 / 11 Sent** — centred success with a ✓ mark, reference card, prominent **Order More** panel (Drinks / Shisha), quiet Finish.
- **9 Drinks** — sticky quick-nav, category cards with 44px controls, 2-up item grid at ≥ 1024, safe-area cart bar with transition.

## 5. Implementation order

1. Extract inline images → files. 2. Write `css/order.css` (reset, tokens, components, motion, responsive, a11y). 3. Rewrite Da Nang template classes, run invariants + golden master. 4. Same for Saigon. 5. Screenshot matrix (375/390/414/430/768/1024/1440), fix overflow/clipping. 6. Class audit → Tailwind CDN removed. 7. Reduced-motion + keyboard pass. 8. Final regression + report.

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| A class string inside a Vue binding (`'bg-[#d9b86c]'`, `'bg-white/10'` in the progress bar) is not a Tailwind-only concern — it is *logic text* | Binding is left byte-identical; the two escaped selectors are defined in `order.css` so the segments still render |
| Removing Tailwind loses its reset | `order.css` carries an explicit reset; removal happened only after a class audit (0 undefined classes) and a screenshot review |
| Sticky quick-nav/cart bar obscuring focus or the jump target | `scroll-margin-top`, `scroll-padding-bottom`, clearance padding, tested by the harness (Playwright fails a click if another element intercepts it) |
| Saigon/Da Nang drift | shared CSS; templates edited separately and each verified against its own baseline |
| Base64 → file could change an image | bytes extracted directly from the data URI; hash-verified equal |
| Motion causing input lag or layout shift | transform/opacity only; no animation on layout properties; reduced-motion collapses all |

## 7. Known pre-existing quirks (preserved on purpose)

These are behaviours, not visuals, so they are **not** fixed here — they are flagged for a separate change:
- Da Nang without `?table=` renders an empty page (Saigon shows a chooser).
- With a QR-locked table, the header **Back** button is shown at step 1 but does nothing.
- On a *different-table QR* the reset path sets `mint:0` (and omits `mintiness`), unlike the normal initial state (`mint:1, mintiness:1`).
- `document.documentElement` is `lang="en"` even when the UI is switched to 中文/한국어 (would need script).
- Visible copy is a mix of translated (`t()`) and hard-coded English strings.


## 8. Outcome (implemented on branch `order-ui-redesign`, not deployed)

**Functional freeze — verified, not assumed**

| Check | Result |
|---|---|
| Vue app `<script>` byte-identical to `HEAD` (both pages) | ✅ (`70bcf3da…` / `9749f83c…`) |
| Endpoint `<script>` byte-identical | ✅ |
| Every original Vue directive/binding present & unchanged; every `{{ }}` interpolation identical | ✅ (only additions: 15–16 attribute-only `:aria-*` bindings per page) |
| `telegram-worker.js`, `index.html`, `style.css`, `script.js` untouched | ✅ |
| Golden master, mobile 390 (61 + 63 checkpoints, 8 scenarios) — flows reach every expected step, Telegram payloads (incl. endpoint URLs) identical, `localStorage` identical at every checkpoint, locale key identical | ✅ |
| Same, desktop 1440 with mouse input | ✅ |
| Same, `prefers-reduced-motion` | ✅ |

**Visual QA** — 203 screens (375/390/414/430/768/1024/1440 × 2 pages × up to 14 screens): 0 horizontal overflow, 0 broken images, 0 text under 12px.

**Performance** (same throttled mobile profile — slow 4G, 4× CPU — median of 3): HTML 1,064 KB → 47 KB; total transfer 3.6 MB → 1.2 MB; requests 15 → 10; first paint 17.4 s → 2.4 s; LCP 17.4 s → 4.9 s; CLS 0 before and after.

**Accessibility** — skip link, `:focus-visible` ring (2px), `aria-pressed` on every toggle, labelled sliders/inputs/language group, `role="alert"` errors, reduced-motion, no unnamed controls (automated).

**Known, intentionally unchanged** (behaviour, not visuals) — see §7. Also: the drinks page keeps whatever scroll position the previous screen had (no `scrollTo` exists in the frozen script).

> The regression tooling (`invariants.mjs`, `regress.mjs`, `compare.mjs`, `classaudit.mjs`, `shots.mjs`, `perf.mjs`) is kept **outside this repository** on purpose: everything in the repo root is served publicly by the site host.


## 9. Final implementation (V1, `HANSUM_ORDER_REDESIGN_V1`)

The §2 "byte-identical script" freeze described the first visual pass. V1 deliberately changes a small, listed set of behaviours
and copy; everything else in the script (menu data, prices, payloads, storage keys, QR/table logic, Telegram calls) is unchanged.
See `CHANGELOG.md` for the exact list and `FUNCTION_TO_UI_MAP.md` for the function → screen map.

| Area | V1 rule |
|---|---|
| Preferences | one combined screen; defaults **5 / 0 / 0**; minimum **0**; Classic/Blonde max **5**; Dark Leaf max **10**; other types unchanged; warning only for Classic; table switch resets to 5 / 0 / 0; fields `order.mint` / `order.mintiness` kept |
| Bowl | customer UI shows only **Egyptian Bowl** and **Phunnel Bowl**; internal `order.bowl` values unchanged; Bowl → Flavor directly |
| Drinks | independent "Order More" flow — never forced into the first shisha order |
| After first order | success screens carry an **Order More** panel (Drinks / Shisha) so the customer knows the menu is still open |
| Typography | Playfair Display (headlines) + Inter (body/UI) + Cinzel (wordmark, big numerals, references) |
| Motion / 3D | CSS-only, lightweight; no Three.js / WebGL / particles; `prefers-reduced-motion` honoured |
| Not changed | `telegram-worker.js`, secrets, Cloudflare configuration, Da Nang / Saigon separation |
