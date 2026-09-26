# Changelog — Hansum Order App

## V2.1 port — new customer interface (2026-09-22)

Pages: `hansum.html` (Da Nang, v5.9.0 → **v6.0.0**), `hansum-saigon.html` (Saigon, v5.8.0 → **v5.9.0**).
New shared files: `js/order-ui.js` (interface template + display-only state), `css/order.css` (replaced), `fonts/` (six local woff2 files).
Not deployed. `telegram-worker.js`, Worker secrets and endpoints untouched.

### Changed
- The whole ordering interface now follows the approved Design V2.1: cinematic Welcome, photo-band Shisha with New session / Refill, two-photo Bowl, blend-tray Flavor, fader Feel with a live sentence, optional Extras chips, editorial "Your Hansum" review, full-screen sending moment, "Your order has been sent." with Order more actions, category-accordion Drinks, and one persistent dock (Back, primary action, running summary) with an order sheet for changing earlier choices.
- Bowl copy: Egyptian Bowl "Classic · Smooth", Phunnel Bowl "Rich · Smoky". Internal values `Egyptian Bowl — Cosmo` / `Phunnel Bowl — Oblako` are unchanged and never shown.
- Fonts are local (Bodoni Moda, Instrument Sans). Google Fonts and the three previous families are no longer requested.
- Entrance animation uses `animation-fill-mode: backwards`, which removes a stale 22px horizontal scroll extent left by `both`.
- The additional-order reference on the sent screen may wrap at a hyphen when it does not fit (previously it could run past its box at 360–390px).
- Each step now starts at the top of the screen and moves focus to its heading; the previous version kept the page scroll position.
- Saigon flavors use the same flavor photos as Da Nang (the previous Saigon page used emoji).
- Back from the first step returns to Welcome (previously a no-op when QR-locked). Drinks return to where they were opened.
- Welcome lists the references already sent from this device (display only).

### Storage
Same key `hansumOrderV55`. Two additive fields, `sentLog` and `tableConfirmed`, both safe when absent. Nothing else in the stored shape changed.

### Unchanged (verified against the previous pages by running the same journey)
Prices and menus (Da Nang / Saigon) · Telegram payloads (`shisha`, `additional-order` with `parentOrderRef` / `additionalNo`) · order references (`SH-`, `-A01`…, `AD-`) · QR `?table=` handling and table switching · preference defaults 5 / 0 / 0, minimum 0, Classic cap 5 · VAT wording · Worker endpoints per location.

## V1 (rebuild 3) — Flavor selected-summary (2026-09-21)

Flavor Profile now shows a compact "SELECTED — Fruity · Creamy · …" line directly above CONTINUE (both pages), so the choice is visible after scrolling down. Display only: it reads the existing flavor state through a new computed `flavorSelectedLabel` (title-cased `flavorSummary`; Other text shown as typed), updates as flavors are selected/deselected, and is hidden while nothing is selected (Continue validation unchanged). Card selected states, flavor data, payload, storage and CSS system are untouched apart from three small rules (`.o-selected-flavors`).

## V1 (rebuild 2) — Repeated Order More submissions fixed (2026-09-21)

Only submission state logic changed, in both pages. No visual, Preferences, Bowl, menu, price, QR/table, Worker or CSS change.

- **Fixed — dead end after the first order.** The `shishaSent` / `drinkSent` guards were permanent, so after the first additional drinks order (or after the original shisha order) the Confirm buttons returned silently. They now protect only the order that was just sent: ORDER MORE (Drinks or Shisha) starts a new additional order and clears the "latest additional sent" state. Drinks and Shisha can be ordered any number of times, in any sequence.
- **References.** The original reference is unchanged (`SH-YYMMDD-XXXX`). Additional orders use `<original>-A01`, `-A02`, … — never reused; the number is committed only after a successful send, so a retry after a failure reuses the same reference. New payload fields: `additionalNo`; `parentOrderRef` (already present) carries the original reference.
- **Content.** A drinks order sends only the current cart, and the cart is emptied after a successful send. An additional shisha starts from a clean selection (5 / 0 / 0, no add-ons carried over) and sends only that shisha as `type:'additional-order'`.
- **Duplicate protection kept and extended.** Sending is ignored while a request is in flight (`sending`), the sent flag still blocks re-sending an order that was just sent, and the cart / selection is cleared after success.
- **Welcome tiles** (after a reload back to Welcome) now start a new order the same way, so they no longer lead to a silent dead end.
- **Storage.** Same `hansumOrderV55` key; one additive field `additionalSeq` (defaults to 0 when missing, reset when a different table's QR is scanned).
- Telegram Worker untouched. It does not print the reference (see `FUNCTION_TO_UI_MAP.md`, *Remaining limitations*).

## V1 — Order redesign, final implementation (2026-09-21)

Pages: `hansum.html` (Da Nang, v5.8.2 → **v5.9.0**), `hansum-saigon.html` (Saigon, v5.7.6 → **v5.8.0**).
Shared stylesheet: `css/order.css` (new, v1.1). Not deployed from this package; no Worker or secret changes.

### Changed
- **Redesign** — premium nightlife look: near-black / deep navy, restrained gold, faint cyan/pink ambient glow, mobile-first. Tailwind runtime CDN removed; one shared stylesheet for both pages; the two ~1 MB inline base64 bowl images are gone from the HTML.
- **Typography** — Playfair Display (headlines), Inter (body/UI), Cinzel (wordmark, big numerals, order reference, subtotal). CJK falls back to system fonts.
- **Preferences** — one combined screen: INTENSITY · COOL · MINT. Defaults **5 / 0 / 0**, minimum **0**. Classic / Blonde Leaf max **5**, Dark Leaf max **10**, other shisha types unchanged. The message "Maximum intensity is 5. For stronger intensity, please select Dark Leaf." shows only for Classic / Blonde. Sliders show 0–10 numerals, a gold fill, and a hatched zone past the maximum. Subtitle now reads "Slide from 0 (none) up to N". Table switching resets to 5 / 0 / 0. `order.mint` / `order.mintiness` are unchanged.
- **Bowl** — customer sees only **Egyptian Bowl** and **Phunnel Bowl** (labels, alt text, review). Uses the clean product photos `images/cosmo-bowl.jpg` / `images/oblako-bowl.jpg` instead of the captioned posters. Internal values (`Egyptian Bowl — Cosmo`, `Phunnel Bowl — Oblako`) are unchanged so staff/Telegram messages and stored orders keep working. New computed `bowlLabel` supplies the customer-facing name on the review screen.
- **Bowl → Flavor** directly (already the case; no brand chooser, no "View options").
- **After the first order** (steps 8 and 11) — new prominent **ORDER MORE** panel: "Want something else? / Order more Shisha or Drinks anytime. The menu is still open." with DRINKS and SHISHA buttons. FINISH / DONE is now a quiet secondary action. EN / 中文 / 한국어 strings added (`wantMore`, `orderMoreTitle`, `orderMoreHint`, `drinksBtn`, `shishaBtn`).
- **Drinks** remain an independent Order More flow with their own cart and order reference; nothing forces drinks into the first shisha order.
- Page titles and `hansum-version` meta bumped so a deployed build is identifiable.

### Fixed
- Da Nang page: the `#app` container was never closed in the markup (present in the previous version); it is now closed like the Saigon page. No behaviour change.

### Unchanged (verified by reading, not by running tests)
Menu data and prices · Da Nang / Saigon separation · QR `?table=` detection · localStorage keys and restore logic · Telegram payloads and Worker endpoints · order references · table switching · `telegram-worker.js` · all secrets.

### Not included / not done
- No ThreeUI, Three.js, WebGL or particle effects. Motion is CSS-only and honours `prefers-reduced-motion`.
- No fake order-status backend. The success screens only state what is true (order sent).
- The bowl photographs still show the maker's name engraved on the bowls; that is part of the photograph.
- The automated test suite was intentionally **not** run for this package — see `docs/` for the design rules to test against.

### Known limitation
Superseded by "V1 (rebuild 2)" above — repeated Order More submissions now work.

## Earlier (unreleased on this branch)
- Visual redesign of both order pages (`css/order.css`, `docs/`), motion polish (slider press, loading sweep, success tick), preference minimum lowered to 0 with defaults 5 / 0 / 0.
