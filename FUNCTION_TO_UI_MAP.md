# Function → UI map (Hansum Order App, Design V2.1 port)

Which Vue function / state drives which screen and control. Applies to both `hansum.html` (Da Nang) and
`hansum-saigon.html` (Saigon) unless noted.

**How the code is organised.** Each page keeps its own business logic, data, prices, menus, order references, persistence and
Telegram sending (Vue 3 Options API, one `createApp`). The customer interface is shared:
`js/order-ui.js` holds the template plus display-only computed properties (mixed into each page's app) and `css/order.css` the styles.
`order-ui.js` never defines prices, menus, flavors, references, storage or the payload; it only reads the page's state and calls the page's methods.

Flow: `0 welcome → 1 shisha → 2 bowl → 3 flavor → 4 feel (preferences) → 6 extras → 7 review → 8 sent → 9 drinks → 10 drinks review → 11 sent`
(step 5 is unused, as before). Fruit Head and refills skip step 2.

## Screens

| Step | Screen | Control (customer sees) | Function / state | Notes |
|---|---|---|---|---|
| 0 | Table chooser (Saigon, no valid QR) | number chips, "This is table NN" | `chooseTable(t)` → `order.table`; `confirmTable()` → `tableConfirmed` | Da Nang without `?table=` renders no welcome (existing behaviour) |
| 0 | Welcome | Start with shisha / Order another shisha | `startMoreShisha()` → step 1 | wording switches once a shisha order has been sent |
| 0 | Welcome | Just drinks / Order drinks | `startMoreOrder()` → step 9 | drinks are reachable without ordering shisha |
| 0 | Welcome | "Sent from your table" | `sentLog` | display-only list of references sent from this device; not a status system |
| 0 | Welcome | Wi-Fi, Instagram and map | `sheet='lounge'` | Wi-Fi, links and the language selector live here |
| 1 | Shisha | New session / Refill | `shishaMode`, `setShishaMode()` | switching clears an existing choice (`clearShisha()`) |
| 1 | Shisha | photo bands | `tapShisha(option)` → `selectShisha(type,name,price,fruitHead)` or `selectRefill(name,price,leaf)` → step 2 or 3 | prices come from `shishaOptions` / `refillOptions` in each page; production reset rules apply on every tap |
| 1 | Shisha | dock: hint, or "Continue with X" | `dock`, `fromShisha()` | the Continue button only appears when returning to this step with a choice already made |
| 2 | Bowl | Egyptian Bowl / Phunnel Bowl | `tapBowl(b)` → `selectBowl(internal value)` → step 3 | customer copy "Classic · Smooth" / "Rich · Smoky"; internal values `Egyptian Bowl — Cosmo` / `Phunnel Bowl — Oblako` are never shown |
| 3 | Flavor | blend tray (First / Second / Third) | `blend`, `toggleDirection`, `clearFlavor()` | reads `selectedDirections` / `order.*`; tap a disc to remove |
| 3 | Flavor | Directions | `toggleDirection(name)` (max 3, toast on the 4th), `flavorDirections` (3 for Classic / Refill Blonde, else 6) | unchanged production rule |
| 3 | Flavor | House signatures | `selectSpecific(name)`; shown when `showSpecific` (Classic, Refill Blonde) | replaces directions, as before |
| 3 | Flavor | Hansum Omakase | `selectOmakase()` | |
| 3 | Flavor | Something else (+ text) | `pickOther()` → `selectOther()`, `order.other` | Continue needs text (`canContinueFlavor`) |
| 3 | Flavor | dock Continue + summary | `nextFromFlavor()`, `flavorBrief` | summary reads "Dark Leaf · Phunnel · 3 flavors" |
| 4 | Feel | three faders + sentence | `setDial(field,value)` (same clamp as `setPref`), `order.intensity` / `order.mint` (= Cool) / `order.mintiness` (= Mint), `feelSentence` | defaults 5 / 0 / 0, min 0, max `prefMax`; Mint only for Classic / Premium |
| 4 | Feel | cap note (Classic) | `prefMax===5`; "Dark Leaf" link → `switchToDark()` → step 1 | |
| 4 | Feel | dock Continue | `nextFromPreferences()` → `clampPreferences()`, step 6 | |
| 6 | Extras | five priced chips | `toggleAddon(addon)`, `isAddonSelected(name)`, `order.addons` | display names from `addonName()`; payload names unchanged |
| 6 | Extras | Something else (+ text) | `pickOtherAddon()` → `toggleOtherAddon()`, `order.otherAddon` | |
| 6 | Extras | dock: Skip and review / Review order | `toReview()` → step 7 | |
| 7 | Review | "Your Hansum" card, edit buttons | `order.*`, `bowlLabel`, `flavorLabel`, `totalPrice`, `go(step)` | shows Egyptian / Phunnel, never the brand suffix |
| 7 | Review | dock: Confirm and send | `confirmOrder()`: first shisha → `generateRef('SH')`, `type:'shisha'`, step 8; any later shisha → `additionalRef()`, `type:'additional-order'`, step 11 | full-screen "Sending to our team" while `sending`; failure shows `sendMessage` on this screen |
| 8 | Shisha sent | reference + Copy | `shishaOrderRef` via `refShown` | |
| 8 / 11 | Sent | Order drinks | `startMoreOrder()` → step 9 | |
| 8 / 11 | Sent | Another shisha | `startMoreShisha()` → step 1 (clean selection once the original is sent) | sends an additional order |
| 8 / 11 | Sent | Keep browsing | step 0 | Welcome lists what has been sent |
| 8 / 11 | Sent | I'm done for tonight | `finish()` → `clearSavedOrder()`, go to `index.html` | unchanged from production |
| 9 | Drinks | category rows (one open at a time) | `toggleCat(i)`, `moreCategories`, `catTitle(cat)` | menus and prices are the page's own data |
| 9 | Drinks | + / − | `addMoreItem(item)`, `changeQty(item,±1)`, `itemQty(name)`, `basket` | independent cart |
| 9 | Drinks | dock: Review your round | `toRound()` → step 10 | |
| 10 | Drinks review | "Your round", Confirm and send | `sendFinalOrder()` → `additionalRef()` → `sendToTelegram(payload)` → cart emptied → step 11 | payload `type:'additional-order'`, only the current cart |
| 11 | Additional order sent | reference | `drinkOrderRef` (e.g. `SH-260921-AB12-A01`) | shown for drinks and for shisha additional orders |

## Global

| Control | Function / state |
|---|---|
| Dock Back | `back()`: step 1 → Welcome; 3 → 1 for Fruit Head / refills; 6 → 4; 9 → where Drinks was opened (`drinksFrom`); 10 → 9; otherwise `step--` |
| Dock summary → order sheet | `dock`, `orderRows`, `go(step)` ("Change" jumps back without resetting later choices) |
| Progress line, "Bowl · 2 of 6" | `journey`, `journeyIndex`, `progress` (5 steps when the bowl is skipped) |
| Table chip / gold mark → table sheet | `order.table`, `tableLocked` (from `?table=NN`, 01–12), Wi-Fi / links from `L` |
| Language selector (table sheet) | `setLocale(code)`, `t(key)`, `tx(key, english)`, `translations` — stored in `localStorage.hansumLocale` |
| Slide direction, scroll reset, heading focus | `watch: step` in `js/order-ui.js` (`dir`, `$refs.stage`) |

## State, storage, integrations

| Concern | Where |
|---|---|
| QR table detection | `?table=01…12` parsed at load (`normalizeTable`, `hasQrTable`); `initializeQrTable()` on mount |
| Table switching | scanning a different table's QR clears saved state and resets the order, including **Intensity 5 / Cool 0 / Mint 0** |
| Persistence | `persistState()` on every change of `order` / `basket` / `step`; `restoreState()` on mount; key `hansumOrderV55` (same key; additive fields `additionalSeq`, `sentLog`, `tableConfirmed`, each defaulting safely when absent) |
| Order reference | Original: `generateRef('SH')` → `SH-YYMMDD-XXXX` (never changes). Additional orders: `additionalRef()` → original ref + `-A01`, `-A02`, … (`SH-YYMMDD-XXXX-A01`). If drinks are ordered before any shisha, the base is `AD-YYMMDD-XXXX`. One `sessionRef` per session |
| Telegram | `sendToTelegram(payload)` → `POST` JSON to the location's Cloudflare Worker (`HANSUM_TELEGRAM_ENDPOINT` on Da Nang, `HANSUM_SAIGON_TELEGRAM_ENDPOINT` on Saigon). Secrets live only in Cloudflare |
| Prices | inline in each page (Da Nang and Saigon differ); VAT wording `t('vat')` / `t('vatSentence')` |

## Preferences rules (quick reference)

| Shisha type | Intensity / Cool / Mint max | Warning shown | MINT slider |
|---|---|---|---|
| Classic (Blonde Leaf) | 5 | yes | yes |
| Premium (Dark Leaf) | 10 | no | yes |
| Refill Blonde | 10 (existing behaviour) | no | no |
| Refill Dark | 10 | no | no |
| Fruit Head | 10 | no | no |

Defaults 5 / 0 / 0, minimum 0. `prefMax` is the single source of the maximum; it is used by `setPref`, `clampPreferences`,
the slider tick/hatch rendering and the warning.

## Repeated Order More (how it works)

State meaning:
- `shishaSent` — the **original** shisha order has been sent. It stays true for the rest of the session.
- `drinkSent` — the **latest additional order** (drinks or shisha) has been sent and the customer has not started another. It is cleared by `startMoreOrder()` / `startMoreShisha()`, so it only ever protects the order that was just sent.
- `additionalSeq` — how many additional orders have been sent (persisted, reset on a different table). The next one is `additionalSeq + 1`.
- `sending` — a submission is in flight; `confirmOrder()` / `sendFinalOrder()` ignore further taps.

Rules:
- Each additional order gets a new reference `<original ref>-A01`, `-A02`, … The number is committed only after Telegram accepts the order, so a failed send keeps the cart and the retry reuses the same reference.
- A drinks order sends only the current cart (`basket`), then the cart is emptied. A shisha additional order starts from a clean selection (5 / 0 / 0, no add-ons) and sends only that shisha.
- Payloads carry `type:'additional-order'`, `orderRef`, `parentOrderRef` (the original ref) and `additionalNo`. The existing Worker ignores the two extra fields it does not know about.

## Remaining limitations

- The existing `telegram-worker.js` does not print `orderRef` / `additionalNo`, so the Telegram message shows the type, table, time and items but not the reference. The reference is on the customer's screen and in the payload. (Worker deliberately unchanged.)
- Language selector: the V2.1 interface is written in English. Where the page already had a translation for the same meaning (Continue, Review order, Subtotal, VAT sentence, Back, Sending, drink category names) the selected language is used; all other V2.1 copy stays English.
- Da Nang without a valid `?table=` still shows no welcome screen (existing behaviour).
- Tapping a leaf or bowl applies the production reset rules every time, so tapping the already chosen leaf again clears its bowl / flavor picks (existing rule). "Change" from the order sheet is the way to revisit a step without resetting.
- After a reload the page returns to Welcome for QR tables; the order in progress and the sent-orders list are restored.
