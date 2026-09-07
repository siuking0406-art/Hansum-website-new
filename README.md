HANSUM V5.2 FINAL — Two-Order Optimized

# HANSUM V5.2 Optimized

## Included updates
- Bowl selection now uses the supplied Cosmo and Oblako images only; no extra bowl text/card labels.
- Category titles use a consistent heading size.
- Regular coffee is placed directly after the **-86°C Frozen Coffee** section.
- Final shisha review and final order review both show **VAT 10% NOT INCLUDED**.
- Shisha review no longer sends a duplicate Telegram order. Customers can continue to order drinks/items, then send one final complete order.
- Final order prices are displayed in VND consistently.
- Telegram sending is wired through `telegram-worker.js` and will work after the Cloudflare Worker URL is entered in `hansum.html`.

## GitHub Pages
Upload/replace the files in the repository root and commit to `main`.

## Telegram setup
1. Deploy `telegram-worker.js` as a Cloudflare Worker.
2. Add Worker secrets:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
3. Copy the Worker URL.
4. In `hansum.html`, replace the empty value in `window.HANSUM_TELEGRAM_ENDPOINT=''` with your Worker URL.
5. Commit the updated `hansum.html` to GitHub.

Do not put the Telegram bot token directly into the HTML. Keep it as a Cloudflare Worker secret.


Order flow: Shisha is confirmed and sent to Telegram first. Drinks & More are a separate second order and are sent only when the customer confirms the second order. All order review screens show 10% VAT NOT INCLUDED.

## V5.2 Order Flow Optimization
- Shisha confirmation is sent as Order #1 before drinks.
- Additional drinks/items are sent as Order #2.
- 10% VAT is clearly shown as not included.
- Telegram failures no longer show a false success screen; the customer can retry.
- Order references are generated for both orders.
- Additional-order items support + / − quantity controls.
- A floating cart/review bar is shown while browsing drinks.
- Order selections are saved in localStorage so refreshes do not lose the order.
- Separate success screens are used for the shisha order and additional order.


## V5.3 QR Table Setup

Each table can use its own QR code while all tables share the same `hansum.html`. Add the table number as a URL parameter:

- Table 01: `hansum.html?table=01`
- Table 02: `hansum.html?table=02`
- VIP 1: `hansum.html?table=VIP%201`

When a valid table parameter is present, the table is detected automatically, the table-selection screen is skipped, and the table is locked for the order. If a different table QR is opened on the same device, the previous saved order is cleared to prevent cross-table orders.

VAT wording is standardized to **8/10% VAT NOT INCLUDED** / **Prices are exclusive of 8/10% VAT.**


## Separate Saigon order page
- `hansum.html` remains the Da Nang order page and keeps `window.HANSUM_TELEGRAM_ENDPOINT`.
- `hansum-saigon.html` is a separate Saigon order page with its own localStorage namespace and `window.HANSUM_SAIGON_TELEGRAM_ENDPOINT`.
- Deploy a separate Saigon Telegram Worker/endpoint for Saigon orders so they are routed independently from Da Nang.
- Saigon can use the same table QR format, e.g. `hansum-saigon.html?table=01`.


Updated v5.6.10: replaced Cosmo and Oblako bowl images in order bowl selection and standardized Phunnel Bowl naming.


## HANSUM v5.7 Release
- Website redesigned with 01–07 section/category hierarchy.
- Uses the existing website imagery except for the new -86°C Coffee artwork (`images/coffee-86-v3.jpeg`).
- Bowl showcase uses Cosmo and Oblako images.
- Order pages (`hansum.html` and `hansum-saigon.html`) are included and remain separate.


## v5.7.3 update
- Restored the original Website hero image.
- Updated only the “ONE MORE PUFF / ONE MORE DRINK / ONE MORE NIGHT” manifesto background to the newly supplied photo.
- No Order page changes.
