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
