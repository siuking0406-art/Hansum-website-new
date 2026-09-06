# HANSUM V5.1

## Website
- `index.html` — main Hansum website
- `hansum.html` — QR order page
- `images/` — local image assets

## QR Order flow
Table → Shisha → Bowl → Flavor → Strength → Cooling → Add-ons → Confirm → Order Received → Order More → Final Order.

The customer can order a shisha first, then use **ORDER MORE** to add cocktails, frozen drinks, -86°C coffee, shots, soft drinks, beer/soju/wine, or bottle service without losing the original shisha order.

## Telegram
The HTML deliberately does **not** contain a Telegram bot token. `hansum.html` supports a Cloudflare Worker endpoint via:

```js
window.HANSUM_TELEGRAM_ENDPOINT = 'https://YOUR-WORKER.workers.dev';
```

For production, deploy `telegram-worker.js` as a Cloudflare Worker and add these Worker secrets:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Then put the Worker URL in the HTML before publishing. Never put the Bot Token directly into GitHub HTML/JS.
