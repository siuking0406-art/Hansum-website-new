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

    // Returns true if the POS saved the order; false = caller should use the old Telegram route.
    send: function (payload) {
      if (!api.enabled()) return Promise.resolve(false);
      return fetch(base + '/api/orders/qr', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: storeId, payload: payload }), signal: withTimeout(10000)
      }).then(function (r) {
        if (r.ok) return true;
        return r.text().then(function (t) { console.warn('[Hansum] POS refused the order, using Telegram fallback:', r.status, t); return false; });
      }).catch(function (e) { console.warn('[Hansum] POS not reachable, using Telegram fallback:', e.message); return false; });
    }
  };

  window.HansumOrderAPI = api;
})();
