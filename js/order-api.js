/* HANSUM ORDER — connection to the Hansum POS (shared menu + order database).
   ---------------------------------------------------------------------------
   OFF by default. Switched on per page by setting, before this file loads:
       window.HANSUM_ORDER_API = 'https://<pos-server>';   // '' = off (old behaviour)
       window.HANSUM_STORE_ID  = 'hcmc' | 'danang';

   When ON:
   - the menu (leaves, prices, bowls, flavors, add-ons, drinks, defaults, caps) is loaded from the POS,
     so a price changed in POS → Settings shows here on the next page load;
   - orders go to the POS (saved in its database, shown on the POS screen, then sent to Telegram);
   - if the POS cannot be reached or refuses the order, the page falls back to the old Telegram
     worker, so a customer's order is never lost.
   The page's own data stays as the offline fallback. */
(function () {
  'use strict';
  var base = String(window.HANSUM_ORDER_API || '').replace(/\/+$/, '');
  var storeId = window.HANSUM_STORE_ID || '';
  var menu = null;

  function withTimeout(ms) {
    if (window.AbortSignal && AbortSignal.timeout) return AbortSignal.timeout(ms);
    return undefined;
  }

  function img(p) {
    // images uploaded in the POS are served by the POS server
    return p && p.charAt(0) === '/' && p.indexOf('/uploads/') === 0 ? base + p : p;
  }

  var api = {
    enabled: function () { return !!(base && storeId); },
    menu: function () { return menu; },

    directions: function (dark, fallback) {
      if (!menu) return fallback;
      var list = dark ? menu.directions.dark : menu.directions.blonde;
      return list.map(function (d) { return { name: d.name, description: d.description }; });
    },

    prefMax: function (shishaType) { return menu && menu.prefMax[shishaType] != null ? menu.prefMax[shishaType] : null; },

    applyDefaults: function (order) {
      if (!menu) return;
      order.intensity = menu.defaults.intensity;
      order.mint = menu.defaults.mint;           // page field "mint" = Cool
      order.mintiness = menu.defaults.mintiness; // page field "mintiness" = Mint
    },

    // Called from the page's mounted(): loads the shared menu into the page.
    attach: function (vm) {
      if (!api.enabled()) return;
      fetch(base + '/api/menu?format=order-web&store=' + encodeURIComponent(storeId), { signal: withTimeout(5000) })
        .then(function (r) { if (!r.ok) throw new Error('menu ' + r.status); return r.json(); })
        .then(function (m) {
          menu = m;
          vm.shishaOptions = m.shishaOptions;
          vm.refillOptions = m.refillOptions;
          vm.addonOptions = m.addonOptions;
          vm.specificFlavors = m.specificFlavors.map(function (f) { return { name: f.name }; });
          vm.signatureFlavors = m.signatureFlavors.map(function (f) { return Object.assign({}, f, { image: img(f.image) }); });
          vm.moreCategories = m.moreCategories.map(function (c) {
            return { label: c.label, name: c.name, items: c.items.map(function (i) { return i.img ? Object.assign({}, i, { img: img(i.img) }) : i; }) };
          });
          if (m.tables && m.tables.length) vm.tables = m.tables;   // table chooser = tables from POS Settings
          if (m.bowls && m.bowls.length) {
            vm.BOWLS = m.bowls.map(function (b) {
              return { value: b.value, label: b.label, short: b.label.split(' ')[0], cls: /^egypt/i.test(b.label) ? 'egy' : /^phun/i.test(b.label) ? 'phu' : '', line: b.line };
            });
          }
          // keep a customer's current choice consistent with the new menu
          var cur = vm.order.shishaType && m.shishaOptions.concat(m.refillOptions).find(function (o) { return o.type === vm.order.shishaType; });
          if (cur && !vm.shishaSent) vm.order.price = cur.price;
          if (vm.order.shishaType) vm.setDirections(vm.order.shishaType !== 'Classic' && vm.order.shishaType !== 'Refill Blonde');
          if (!vm.order.shishaType && !vm.shishaSent) api.applyDefaults(vm.order);
        })
        .catch(function (e) { console.warn('[Hansum] POS menu not loaded, using the menu in this page:', e.message); });
    },

    // QR table codes: with the POS on, any simple table code is accepted here and checked against
    // the POS database (so a table added in POS Settings works without editing this website).
    acceptsTable: function (code) { return api.enabled() && /^[0-9A-Z]{1,6}$/.test(String(code || '')); },

    // Returns true if the POS saved the order; false = POS unreachable/busy → caller uses the old Telegram route.
    // Throws (with err.userMessage) if the POS refused the order as invalid — then nothing is sent anywhere.
    // Network errors / 5xx are retried with the SAME order ref (the POS ignores repeats), so a slow but
    // successful save is never followed by a Telegram fallback (no double messages).
    send: function (payload) {
      if (!api.enabled()) return Promise.resolve(false);
      var body = JSON.stringify({ store_id: storeId, payload: payload });
      var attempt = function (n) {
        return fetch(base + '/api/orders/qr', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, signal: withTimeout(8000) })
          .then(function (r) {
            if (r.ok) return true;
            if (r.status >= 500 && n < 3) return wait(1000 * n).then(function () { return attempt(n + 1); });
            if (r.status >= 400 && r.status < 500 && r.status !== 429) {
              // The POS checked the order and refused it (item no longer available, unknown table, …).
              // Do NOT send it another way: tell the guest instead.
              return r.json().catch(function () { return {}; }).then(function (j) {
                var err = new Error('POS refused the order: ' + r.status + ' ' + (j.code || '') + ' ' + (j.detail || j.error || ''));
                err.userMessage = api.message(j.code);
                console.warn('[Hansum] ' + err.message);
                throw err;
              });
            }
            return r.text().then(function (t) { api.lastFailure = 'POS answered ' + r.status + ' ' + t.slice(0, 160); return false; });
          }, function (e) {
            if (n < 3) return wait(1000 * n).then(function () { return attempt(n + 1); });
            api.lastFailure = 'POS not reachable: ' + (e && e.message); return false;
          });
      };
      return attempt(1);
    },

    // What the guest reads when the POS refuses an order.
    message: function (code) {
      if (code === 'ITEM_UNAVAILABLE' || code === 'OPTION_UNAVAILABLE') return 'This item is no longer available. Please refresh the menu.';
      if (code === 'INVALID_TABLE') return 'This table could not be found. Please ask our staff for help.';
      return 'We could not send the order. Please ask our staff for help.';
    },

    // The copy sent by the old Telegram route when the POS could not take the order.
    // "NOT IN POS" appears next to the table in Telegram so staff know to enter it in the POS by hand.
    fallbackPayload: function (payload) {
      var reason = api.lastFailure || 'unknown';
      console.warn('[Hansum] Order ' + payload.orderRef + ' sent by Telegram fallback, NOT saved in the POS. ' + reason);
      try {
        var log = JSON.parse(localStorage.getItem('hansumPosFallbacks') || '[]');
        log.push({ ref: payload.orderRef, at: new Date().toISOString(), reason: reason });
        localStorage.setItem('hansumPosFallbacks', JSON.stringify(log.slice(-20)));
      } catch (e) { /* storage not available */ }
      var copy = JSON.parse(JSON.stringify(payload));
      copy.table = String(payload.table || (payload.order && payload.order.table) || '-') + ' ⚠ NOT IN POS';
      if (copy.order) copy.order.table = copy.table;
      copy.posFallback = { reason: reason };
      return copy;
    }
  };

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  window.HansumOrderAPI = api;
})();
