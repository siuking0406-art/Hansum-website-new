/* HANSUM ORDER — customer interface (Design V2.1 port)
   ---------------------------------------------------------------------------
   Shared by hansum.html (Da Nang) and hansum-saigon.html (Saigon).

   This file owns PRESENTATION ONLY: the template, display state, and computed
   properties that describe what the customer sees.

   It does NOT define, and must not define: prices, menus, location data, flavors,
   add-ons, order references, localStorage persistence, the Telegram payload or
   sending. Those stay in each page's own script (production logic) and this file
   only reads them.

   Page contract (provided by each page's Vue options):
     data:    L, order, selectedDirections, flavorDirections, specificFlavors, addonOptions,
              otherAddonEnabled, basket, moreCategories, shishaOptions, refillOptions, tables,
              sending, sendMessage, shishaSent, drinkSent, shishaOrderRef, drinkOrderRef, locale, languages
     computed: tableLocked, prefMax, bowlLabel, flavorSummary, canContinueFlavor, showSpecific,
               totalPrice, addonTotal, basketTotal, basketCount
     methods: selectShisha, selectRefill, selectBowl, toggleDirection, selectSpecific, selectOther,
              selectOmakase, nextFromFlavor, nextFromPreferences, toggleAddon, toggleOtherAddon,
              isAddonSelected, itemQty, changeQty, addMoreItem, confirmOrder, sendFinalOrder,
              startMoreOrder, startMoreShisha, finish, back, formatPrice, persistState, t, setLocale,
              categoryTitle, clampPreferences */
(function () {
  'use strict';
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var reduced = function () { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); };
  var NB = String.fromCharCode(160);

  /* Customer-facing wording that is easy to review in one place. */
  var COPY = {
    stepLeaf: 'Leaf',
    headingLeaf: 'Choose your leaf',
    hintLeaf: 'Tap a leaf to continue',
    hintBowl: 'Tap a bowl to continue'
  };

  /* Customer-facing presentation of each production shishaType. Prices are NOT here. */
  var CATALOG = {
    'Classic': { label: 'Blonde Leaf', tier: 'Classic', img: 'images/blonde-leaf.jpeg', pos: '50% 58%', notes: 'Al Fakher · Adalya · Jam', ceiling: 5 },
    'Premium': { label: 'Dark Leaf', tier: 'Premium', img: 'images/dark-leaf.jpeg', pos: '50% 56%', notes: 'Darkside · MustHave · Element · Spectrum · Kismet · etc.', ceiling: 10 },
    'Fruit Head': { label: 'Fruit Head', tier: 'Signature', img: 'images/fruit-head.jpeg', pos: '50% 20%', notes: 'Dragon Fruit · Pineapple · Apple etc.', ceiling: 10, fruit: true },
    'Refill Blonde': { label: 'Blonde Leaf refill', tier: 'Refill', img: 'images/blonde-leaf.jpeg', pos: '50% 58%', notes: 'Al Fakher · Adalya · Jam', ceiling: 10 },
    'Refill Dark': { label: 'Dark Leaf refill', tier: 'Refill', img: 'images/dark-leaf.jpeg', pos: '50% 56%', notes: 'Darkside · MustHave · Element · Spectrum · Kismet · etc.', ceiling: 10 }
  };

  /* Bowls: `value` is the unchanged internal production value passed to selectBowl(). Never shown to customers. */
  var BOWLS = [
    { value: 'Egyptian Bowl — Cosmo', label: 'Egyptian Bowl', short: 'Egyptian', cls: 'egy', line: 'Classic · Smooth' },
    { value: 'Phunnel Bowl — Oblako', label: 'Phunnel Bowl', short: 'Phunnel', cls: 'phu', line: 'Rich · Smoky' }
  ];

  /* Photo crops for the flavor menu. `s` = where the photo starts inside the source banner (0-1). */
  var FLAVOR_META = {
    'FRUITY': { label: 'Fruity', img: 'images/flavor/fruity.jpg', s: 0.5 },
    'CITRUS': { label: 'Citrus', img: 'images/flavor/citrus.jpg', s: 0.5 },
    'CREAMY': { label: 'Creamy', img: 'images/flavor/creamy.jpg', s: 0.54 },
    'FLORAL': { label: 'Floral', img: 'images/flavor/floral.jpg', s: 0.55 },
    'TEA': { label: 'Tea', img: 'images/flavor/tea.jpg', s: 0.6 },
    'WOOD': { label: 'Wood', img: 'images/flavor/wood.jpg', s: 0.6 },
    'DOUBLE APPLE': { label: 'Double Apple', img: 'images/flavor/double-apple.jpg', s: 0.54 },
    'MINT': { label: 'Mint', img: 'images/flavor/mint.jpg', s: 0.42 },
    'LOVE 66': { label: 'Love 66', img: 'images/flavor/love66.jpg', s: 0.55 },
    'LADYKILLER': { label: 'Ladykiller', img: 'images/flavor/ladykiller.jpg', s: 0.54 }
  };
  var OMAKASE_IMG = { img: 'images/flavor/omakase.jpg', s: 0.6 };
  var OTHER_IMG = { img: 'images/flavor/other.jpg', s: 0.55 };

  var STEP_NAMES = { 1: COPY.stepLeaf, 2: 'Bowl', 3: 'Flavor', 4: 'Feel', 6: 'Extras', 7: 'Your order', 9: 'Drinks', 10: 'Your round' };

  var mixin = {
    data: function () {
      return {
        levels: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        sheet: '', openCat: 0, toast: '', copied: '', dir: 'fwd',
        shishaMode: 'new', drinksFrom: 0, capHit: '', activeDial: '',
        tableConfirmed: false, sentLog: [],
        BOWLS: BOWLS, OMAKASE_IMG: OMAKASE_IMG, OTHER_IMG: OTHER_IMG, COPY: COPY
      };
    },

    computed: {
      needsTable: function () { return !!(this.L.chooser && !this.tableLocked && !this.tableConfirmed && this.step === 0); },
      isRefill: function () { var t = this.order.shishaType; return t === 'Refill Blonde' || t === 'Refill Dark'; },
      bandList: function () {
        var src = this.shishaMode === 'refill' ? this.refillOptions : this.shishaOptions;
        return src.map(function (o) { return Object.assign({}, o, CATALOG[o.type]); });
      },
      currentMeta: function () { return CATALOG[this.order.shishaType] || null; },
      shishaDisplay: function () { var m = this.currentMeta; return m ? m.label : ''; },
      hasBowl: function () { var t = this.order.shishaType; return t === 'Classic' || t === 'Premium'; },
      hasMint: function () { var t = this.order.shishaType; return t === 'Classic' || t === 'Premium'; },
      bowlObj: function () { var v = this.order.bowl; return BOWLS.find(function (b) { return b.value === v; }) || null; },
      bowlArticle: function () { return /^[aeiou]/i.test(this.bowlLabel) ? 'an' : 'a'; },

      directionItems: function () {
        return this.flavorDirections.map(function (f) { return Object.assign({}, FLAVOR_META[f.name], { name: f.name, desc: f.description }); });
      },
      specificItems: function () {
        return this.specificFlavors.map(function (f) { return Object.assign({}, FLAVOR_META[f.name], { name: f.name }); });
      },
      flavorLabel: function () {
        var t = this.order.flavorType;
        if (!t) return '';
        if (t === 'Other') return this.flavorSummary.trim();
        return this.flavorSummary.toLowerCase().replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }).split(' · ').join(', ');
      },
      /* Compact phrase for the running summary. Never a list of names, so it can not truncate mid-word. */
      flavorBrief: function () {
        var t = this.order.flavorType, n = this.selectedDirections.length;
        if (t === 'Direction') {
          if (!n) return '';
          return n === 1 ? FLAVOR_META[this.selectedDirections[0]].label : n + ' flavors';
        }
        if (t === 'Specific') { var d = FLAVOR_META[this.order.specific]; return d ? d.label : ''; }
        if (t === 'Omakase') return 'Omakase';
        if (t === 'Other') return 'Custom flavor';
        return '';
      },
      /* What the customer has composed so far, shown above the flavor list. */
      blend: function () {
        var t = this.order.flavorType, sel = this.selectedDirections;
        if (t === 'Direction' || !t) {
          var slots = [0, 1, 2].map(function (i) {
            var m = FLAVOR_META[sel[i]];
            return m ? { key: sel[i], label: m.label, img: m.img } : null;
          });
          return { mode: 'dir', slots: slots };
        }
        if (t === 'Specific') { var d = FLAVOR_META[this.order.specific]; return { mode: 'one', slots: [{ key: this.order.specific, label: d.label, img: d.img, note: 'House signature' }] }; }
        if (t === 'Omakase') return { mode: 'one', slots: [{ key: 'OM', label: 'Hansum Omakase', img: OMAKASE_IMG.img, note: 'Chef’s choice' }] };
        return { mode: 'one', slots: [{ key: 'OT', label: this.order.other.trim() || 'Your own', img: OTHER_IMG.img, note: 'In your words' }] };
      },

      /* progress model */
      journey: function () { return this.order.shishaType && !this.hasBowl ? [1, 3, 4, 6, 7] : [1, 2, 3, 4, 6, 7]; },
      journeyIndex: function () { return this.journey.indexOf(this.step); },
      progress: function () {
        if (this.step === 8 || this.step === 11) return 100;
        if (this.journeyIndex >= 0) return ((this.journeyIndex + 1) / this.journey.length) * 100;
        if (this.step === 9) return this.basketCount ? 50 : 0;
        if (this.step === 10) return 80;
        return 0;
      },
      stepName: function () { return STEP_NAMES[this.step] || ''; },
      stepCount: function () { return this.journeyIndex >= 0 ? (this.journeyIndex + 1) + ' of ' + this.journey.length : ''; },
      clearTop: function () { return this.step === 0 || this.step === 8 || this.step === 11; },
      inShishaFlow: function () { return this.journeyIndex >= 0; },

      /* The single, persistent primary-action area. */
      dock: function () {
        var s = this.step, o = this.order;
        if (this.inShishaFlow) {
          var parts = [this.shishaDisplay, this.hasBowl && this.bowlObj ? this.bowlObj.short : '', this.flavorBrief].filter(Boolean);
          /* spaces inside a part are non-breaking, so a wrap can only happen after a dot */
          var text = parts.map(function (p) { return p.split(' ').join(NB); }).join(NB + '· ');
          var base = { show: true, parts: parts, text: text, summary: parts.join(' · '), price: o.shishaType ? this.totalPrice : 0, back: true };
          if (s === 1) {
            if (!this.currentMeta) return Object.assign(base, { hint: COPY.hintLeaf });
            return Object.assign(base, { label: 'Continue with ' + this.currentMeta.label, disabled: false, act: 'fromShisha' });
          }
          if (s === 2) {
            if (!this.bowlObj) return Object.assign(base, { hint: COPY.hintBowl });
            return Object.assign(base, { label: 'Continue with ' + this.bowlObj.short, disabled: false, act: 'fromBowl' });
          }
          if (s === 3) return Object.assign(base, { label: this.tx('continue', 'Continue'), disabled: !this.canContinueFlavor, act: 'nextFromFlavor' });
          if (s === 4) return Object.assign(base, { label: this.tx('continue', 'Continue'), disabled: false, act: 'nextFromPreferences' });
          if (s === 6) return Object.assign(base, { label: o.addons.length || o.otherAddon.trim() ? this.tx('reviewOrder', 'Review order') : 'Skip and review', disabled: false, act: 'toReview' });
          if (s === 7) return Object.assign(base, { label: 'Confirm and send', disabled: this.sending, act: 'confirmOrder', note: 'Goes straight to our team at table ' + o.table + '.', summary: '', parts: [] });
        }
        if (s === 9) {
          var n = this.basketCount, w = n === 1 ? 'item' : 'items';
          return { show: true, back: true, summary: n ? n + ' ' + w : '', text: n ? n + NB + w : '', price: this.basketTotal, label: n ? 'Review your round' : 'Choose something', disabled: !n, act: 'toRound' };
        }
        if (s === 10) return { show: true, back: true, summary: '', price: 0, label: 'Confirm and send', disabled: this.sending || !this.basketCount, act: 'sendFinalOrder', note: 'Sent as a separate order to table ' + o.table + '.' };
        return { show: false };
      },
      refShown: function () { return this.step === 11 ? this.drinkOrderRef : this.shishaOrderRef; },
      sentTitle: function () { return this.step === 8 ? 'Your order has been sent.' : 'Your additional order has been sent.'; },
      sentText: function () {
        return this.step === 8
          ? 'Your shisha order for table ' + this.order.table + ' has been sent to our team.'
          : 'Your additional order for table ' + this.order.table + ' has been sent to our team.';
      },
      sendingLine: function () {
        if (this.step === 10) return 'Table ' + this.order.table + ', ' + this.basketCount + (this.basketCount === 1 ? ' item' : ' items') + ', ' + this.formatPrice(this.basketTotal) + ' VND';
        return ['Table ' + this.order.table, this.shishaDisplay, this.bowlObj ? this.bowlObj.short : '', this.flavorLabel].filter(Boolean).join(', ');
      },

      /* Feel: descriptive wording only. Ranges, defaults and caps are production rules (order.*, prefMax). */
      feelSentence: function () {
        var o = this.order, i = o.intensity, c = o.mint, m = o.mintiness;
        var s = i === 0 ? 'Barely any draw' : this.bandInt(i);
        var coolTxt = c === 0 ? '' : { 'Soft': 'a soft chill', 'Medium': 'a medium chill', 'Icy': 'an icy chill', 'Extreme icy': 'an extreme icy chill' }[this.bandCool(c)];
        var mintTxt = !this.hasMint || m === 0 ? '' : { 'Soft': 'a touch of mint', 'Medium': 'medium mint', 'Strong': 'strong mint', 'Extreme strong': 'extreme mint' }[this.bandMint(m)];
        var extra = [coolTxt, mintTxt].filter(Boolean);
        return s + (extra.length ? ', with ' + extra.join(' and ') : ', no cooling') + '.';
      },
      dials: function () {
        var o = this.order;
        var d = [
          { field: 'intensity', name: 'Intensity', val: o.intensity, band: this.bandInt(o.intensity), tone: 'gold' },
          { field: 'mint', name: 'Cool', val: o.mint, band: this.bandCool(o.mint), tone: 'cyan' }
        ];
        if (this.hasMint) d.push({ field: 'mintiness', name: 'Mint', val: o.mintiness, band: this.bandMint(o.mintiness), tone: 'mint' });
        return d;
      },
      feelShort: function () {
        var o = this.order, t = 'Intensity ' + o.intensity + ' · Cool ' + o.mint;
        if (this.hasMint) t += ' · Mint ' + o.mintiness;
        return t;
      },
      orderRows: function () {
        var o = this.order, rows = [];
        rows.push({ k: 'Shisha', v: this.shishaDisplay, step: 1 });
        if (this.hasBowl && o.bowl) rows.push({ k: 'Bowl', v: this.bowlLabel, step: 2 });
        rows.push({ k: 'Flavor', v: this.flavorLabel || 'Not chosen yet', step: 3 });
        rows.push({ k: 'Feel', v: this.feelShort, step: 4 });
        var ex = o.addons.map(function (a) { return a.name; }).concat(o.otherAddon.trim() ? [o.otherAddon.trim()] : []);
        rows.push({ k: 'Extras', v: ex.length ? ex.join(', ') : 'None', step: 6 });
        return rows;
      }
    },

    watch: {
      /* runs in addition to the page's own step watcher (which persists state) */
      step: function (n, o) {
        var self = this;
        this.dir = n >= o ? 'fwd' : 'back';
        this.sheet = '';
        if (n === 1 && this.order.shishaType) this.shishaMode = this.isRefill ? 'refill' : 'new';
        this.$nextTick(function () {
          var st = self.$refs.stage; if (st) st.scrollTop = 0;
          var f = document.querySelector('.scr [data-focus]'); if (f) f.focus({ preventScroll: true });
        });
      }
    },

    methods: {
      /* i18n: English uses the V2.1 wording; other languages use the page's existing translation when one exists. */
      tx: function (key, en) {
        if (this.locale === 'en') return en;
        var d = this.translations && this.translations[this.locale];
        return (d && d[key]) || en;
      },
      bandInt: function (v) { return v === 0 ? 'None' : v <= 3 ? 'Light' : v <= 6 ? 'Balanced' : 'Strong'; },
      bandCool: function (v) { return v === 0 ? 'None' : v <= 3 ? 'Soft' : v <= 6 ? 'Medium' : v <= 9 ? 'Icy' : 'Extreme icy'; },
      bandMint: function (v) { return v === 0 ? 'None' : v <= 3 ? 'Soft' : v <= 6 ? 'Medium' : v <= 9 ? 'Strong' : 'Extreme strong'; },
      addonName: function (a) { return cap(a.name.replace(/\s*\(.*\)\s*$/, '').toLowerCase()); },
      addonNote: function (a) { return a.note || ''; },
      catTitle: function (cat) {
        if (this.locale !== 'en') return this.categoryTitle(cat);
        return cat.name === 'Cocktails' ? cap(cat.label.toLowerCase()) + ' cocktails' : cat.name;
      },
      catFrom: function (cat) { return Math.min.apply(null, cat.items.map(function (i) { return i.price; })); },
      isDirSel: function (n) { return this.selectedDirections.indexOf(n) > -1; },
      dirRank: function (n) { return this.selectedDirections.indexOf(n) + 1; },

      /* navigation (presentation) */
      go: function (step) { this.sheet = ''; this.step = step; },
      dockAct: function () { var d = this.dock; if (!d.show || d.disabled || !d.act) return; this[d.act](); },
      fromShisha: function () { this.step = this.hasBowl ? 2 : 3; },
      fromBowl: function () { this.step = 3; },
      toReview: function () { this.step = 7; },
      toRound: function () { this.step = 10; },

      /* Tapping a leaf or bowl runs the production selection method, which applies the production reset rules and advances. */
      tapShisha: function (s) {
        if (s.tier === 'Refill') this.selectRefill(s.name, s.price, s.leaf);
        else this.selectShisha(s.type, s.name, s.price, !!s.fruitHead);
      },
      tapBowl: function (b) { this.selectBowl(b.value); },
      setShishaMode: function (m) {
        if (this.shishaMode === m) return;
        this.shishaMode = m;
        if ((m === 'refill') !== this.isRefill && this.order.shishaType) this.clearShisha();
      },
      /* switching New session / Refill with a choice already made: return to "nothing chosen" (same fields production resets) */
      clearShisha: function () {
        Object.assign(this.order, { shishaType: '', shishaName: '', price: 0, bowl: '', flavorType: '', specific: '', other: '' });
        this.selectedDirections = [];
        this.clampPreferences();
      },
      clearFlavor: function () { this.order.flavorType = ''; this.order.specific = ''; this.order.other = ''; this.selectedDirections = []; },
      pickOther: function () {
        var self = this;
        this.selectOther();
        this.$nextTick(function () {
          var t = self.$refs.otherText; if (!t) return;
          t.focus({ preventScroll: true });
          setTimeout(function () { t.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); }, 420);
        });
      },
      pickOtherAddon: function () {
        var self = this;
        this.toggleOtherAddon();
        if (!this.otherAddonEnabled) return;
        this.$nextTick(function () {
          var t = self.$refs.otherAddon; if (!t) return;
          t.focus({ preventScroll: true });
          setTimeout(function () { t.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); }, 420);
        });
      },

      /* Feel faders. Same clamp as production setPref: whole numbers from 0 up to prefMax. */
      setDial: function (field, raw) {
        var v = Math.round(Number(raw)); if (!isFinite(v)) v = 0;
        if (v < 0) v = 0;
        var max = this.prefMax, self = this;
        if (v > max) { v = max; this.capHit = field; clearTimeout(this._capT); this._capT = setTimeout(function () { self.capHit = ''; }, 1600); }
        this.order[field] = v;
      },
      dialValueAt: function (e) {
        var r = e.currentTarget.getBoundingClientRect(), rowH = r.height / 11;
        return Math.max(0, Math.min(10, Math.floor((r.bottom - e.clientY) / rowH)));
      },
      dialDown: function (field, e) {
        this.activeDial = field;
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) { /* noop */ }
        this.setDial(field, this.dialValueAt(e));
      },
      dialMove: function (field, e) { if (this.activeDial === field) this.setDial(field, this.dialValueAt(e)); },
      dialUp: function () { this.activeDial = ''; },
      dialKey: function (field, e) {
        var k = e.key, cur = this.order[field], v = null;
        if (k === 'ArrowUp' || k === 'ArrowRight') v = cur + 1;
        else if (k === 'ArrowDown' || k === 'ArrowLeft') v = cur - 1;
        else if (k === 'PageUp') v = cur + 3; else if (k === 'PageDown') v = cur - 3;
        else if (k === 'Home') v = 0; else if (k === 'End') v = this.prefMax;
        if (v === null) return;
        e.preventDefault(); this.setDial(field, v);
      },
      switchToDark: function () { this.go(1); },

      toggleCat: function (i) {
        var self = this;
        this.openCat = this.openCat === i ? -1 : i;
        if (this.openCat === i) this.$nextTick(function () {
          var el = document.getElementById('cathead-' + i);
          if (el && self.$refs.stage) self.$refs.stage.scrollTo({ top: el.offsetTop - 64, behavior: reduced() ? 'auto' : 'smooth' });
        });
      },

      /* small UI helpers */
      say: function (msg) { var self = this; this.toast = msg; clearTimeout(this._toastT); this._toastT = setTimeout(function () { self.toast = ''; }, 2600); },
      copy: function (text, key) {
        var self = this;
        var done = function () { self.copied = key; clearTimeout(self._copyT); self._copyT = setTimeout(function () { self.copied = ''; }, 1600); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { legacy(); });
        else legacy();
        function legacy() {
          try { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); } catch (x) { /* noop */ }
          done();
        }
      },
      chooseTable: function (t) { this.order.table = t; },
      confirmTable: function () { if (this.order.table) { this.tableConfirmed = true; this.step = 0; this.persistState(); } },

      /* Local, display-only list of what this table has already sent (shown on Welcome). Not a status system. */
      orderLogTitle: function () {
        return this.shishaDisplay + (this.bowlObj ? ', ' + this.bowlObj.short : '') + (this.flavorLabel ? ', ' + this.flavorLabel : '');
      },
      logSent: function (kind, ref, title, total) { this.sentLog.push({ ref: ref, kind: kind, title: title, total: total }); }
    },

    mounted: function () {
      var self = this;
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') self.sheet = ''; });
    }
  };

  window.HansumOrderUI = { template: `
<div class="shell" :data-step="step" :data-dir="dir">
    <div class="pline" aria-hidden="true"><i :style="{width:progress+'%'}"></i></div>

    <header class="top" :class="{'top--clear':clearTop}">
      <button class="mono" @click="sheet='lounge'" aria-label="Open table info: Wi-Fi and links"><span class="mono__g"></span></button>
      <div class="top__mid" aria-live="polite">
        <span class="top__name" v-if="stepName">{{stepName}}</span>
        <span class="top__count" v-if="stepCount">{{stepCount}}</span>
      </div>
      <button class="tab-chip" @click="sheet='lounge'" :aria-label="(order.table?'Table '+order.table:'No table chosen yet')+', Hansum '+L.name">
        <span class="tab-chip__dot" :class="{qr:tableLocked}"></span>
        <span>Table {{order.table||'–'}}</span>
      </button>
    </header>

    <main id="main" class="stage" ref="stage" tabindex="-1">

      <!-- 0a. Saigon table chooser (no QR) -->
      <section v-if="needsTable" class="scr scr--table" :key="'table'">
        <div class="table__num" :class="{empty:!order.table}" aria-hidden="true">{{order.table||'00'}}</div>
        <div class="table__body">
          <h1 class="h1" tabindex="-1" data-focus>Where are you sitting?</h1>
          <p class="sub">Pick your table number so the team knows where to bring your order.</p>
          <div class="table__grid" role="group" aria-label="Table number">
            <button v-for="t in tables" :key="t" class="tnum" :class="{on:order.table===t}" :aria-pressed="order.table===t" @click="chooseTable(t)">{{t}}</button>
          </div>
          <button class="btn btn--gold btn--block" :disabled="!order.table" @click="confirmTable">{{order.table?'This is table '+order.table:'Choose a table'}}<svg class="ic"><use href="#i-arrow"/></svg></button>
        </div>
      </section>

      <!-- 0b. Welcome -->
      <section v-else-if="step===0 && (tableLocked||L.chooser)" class="scr scr--welcome" :key="'welcome'">
        <div class="welcome__photo" role="img" aria-label="Guest exhaling smoke under pink neon at Hansum"></div>
        <div class="welcome__shade"></div>
        <div class="welcome__body">
          <p class="where"><span class="where__dot"></span>Hansum {{L.name}}, table {{order.table}}</p>
          <h1 class="display" tabindex="-1" data-focus>Take a<br><em>breath.</em></h1>
          <p class="lede">Shisha, cocktails and coffee, ordered from your table.</p>

          <div class="onyours" v-if="sentLog.length" aria-label="Orders sent from this table">
            <p class="onyours__t">Sent from your table</p>
            <ul>
              <li v-for="s in sentLog" :key="s.ref"><span class="onyours__ref">{{s.ref}}</span><span class="onyours__k">{{s.kind}}</span></li>
            </ul>
          </div>

          <div class="acts">
            <button class="btn btn--gold btn--block" @click="startMoreShisha">{{shishaSent?'Order another shisha':'Start with shisha'}}<svg class="ic"><use href="#i-arrow"/></svg></button>
            <button class="btn btn--line btn--block" @click="startMoreOrder">{{shishaSent||sentLog.length?'Order drinks':'Just drinks'}}</button>
          </div>
          <button class="link link--center" @click="sheet='lounge'">Wi-Fi, Instagram and map</button>
        </div>
      </section>

      <!-- 1. Shisha: what experience am I buying? -->
      <section v-else-if="step===1" class="scr scr--shisha" :key="'shisha'">
        <div class="ph">
          <h1 class="h1" tabindex="-1" data-focus>{{COPY.headingLeaf}}</h1>
          <div class="seg" role="group" aria-label="Session type">
            <button :class="{on:shishaMode==='new'}" :aria-pressed="shishaMode==='new'" @click="setShishaMode('new')">New session</button>
            <button :class="{on:shishaMode==='refill'}" :aria-pressed="shishaMode==='refill'" @click="setShishaMode('refill')">Refill</button>
          </div>
          <p class="sub sub--tight" v-if="shishaMode==='refill'">Continue your session with fresh tobacco.</p>
        </div>
        <div class="bands bands--tap" role="group" aria-label="Shisha options">
          <button v-for="s in bandList" :key="s.type" class="band" :class="{on:order.shishaType===s.type}" :aria-pressed="order.shishaType===s.type" @click="tapShisha(s)">
            <span class="band__img" :style="{backgroundImage:'url('+s.img+')',backgroundPosition:s.pos}"></span>
            <span class="band__shade"></span>
            <span class="band__in">
              <span class="band__tier">{{s.tier}}</span>
              <span class="band__head">
                <span class="band__name">{{s.label}}</span>
                <span class="band__price"><b>{{formatPrice(s.price)}}</b> VND</span>
              </span>
              <span class="band__more">
                <span class="band__notes">{{s.notes}}</span>
                <span class="gauge" :aria-label="'Intensity up to '+(s.type==='Classic'?5:10)+' out of 10'">
                  <span class="gauge__t">Intensity up to {{s.type==='Classic'?5:10}}</span>
                  <span class="gauge__b"><i v-for="n in 10" :key="n" :class="{on:n<=(s.type==='Classic'?5:10)}"></i></span>
                </span>
                <span class="band__path" v-if="s.fruit">Served in fresh fruit. No bowl to choose.</span>
                <span class="band__path" v-else-if="s.tier==='Refill'">Straight to flavor.</span>
              </span>
            </span>
            <span class="band__tick" aria-hidden="true"><svg class="ic"><use href="#i-check"/></svg></span>
          </button>
        </div>
      </section>

      <!-- 2. Bowl: which style? -->
      <section v-else-if="step===2" class="scr scr--bowl" :key="'bowl'">
        <div class="ph">
          <h1 class="h1" tabindex="-1" data-focus>Which bowl?</h1>
          <p class="sub">Different style, different experience.</p>
        </div>
        <div class="bowls" :class="{pick:order.bowl}" role="group" aria-label="Bowl style">
          <button v-for="b in BOWLS" :key="b.value" class="bowl" :class="[b.cls,{on:order.bowl===b.value}]" :aria-pressed="order.bowl===b.value" @click="tapBowl(b)">
            <span class="bowl__img" role="img" :aria-label="b.label"></span>
            <span class="bowl__shade"></span>
            <span class="bowl__cap">
              <span class="bowl__name">{{b.label}}</span>
              <span class="bowl__line">{{b.line}}</span>
            </span>
            <span class="bowl__tick" aria-hidden="true"><svg class="ic"><use href="#i-check"/></svg></span>
          </button>
        </div>
      </section>

      <!-- 3. Flavor: explore, blend -->
      <section v-else-if="step===3" class="scr scr--flavor" :key="'flavor'">
        <div class="ph">
          <h1 class="h1" tabindex="-1" data-focus>What do you feel like?</h1>
          <p class="sub sub--one">Blend up to three, or leave it to us.</p>
        </div>

        <div class="blend" role="group" aria-label="Your flavor blend">
          <template v-if="blend.mode==='dir'">
            <div v-for="(sl,i) in blend.slots" :key="i" class="slot">
              <button v-if="sl" class="slot__disc filled" :style="{backgroundImage:'url('+sl.img+')'}" @click="toggleDirection(sl.key)" :aria-label="'Remove '+sl.label"><span class="slot__x" aria-hidden="true"><svg class="ic"><use href="#i-close"/></svg></span></button>
              <span v-else class="slot__disc" aria-hidden="true">{{i+1}}</span>
              <span class="slot__name" :class="{dim:!sl}">{{sl?sl.label:['First','Second','Third'][i]}}</span>
            </div>
          </template>
          <template v-else>
            <div class="slot slot--one">
              <button class="slot__disc filled" :style="{backgroundImage:'url('+blend.slots[0].img+')'}" @click="clearFlavor" :aria-label="'Clear '+blend.slots[0].label"><span class="slot__x" aria-hidden="true"><svg class="ic"><use href="#i-close"/></svg></span></button>
              <span class="slot__txt"><span class="slot__name">{{blend.slots[0].label}}</span><span class="slot__note">{{blend.slots[0].note}}</span></span>
            </div>
          </template>
        </div>

        <h2 class="h2">Directions</h2>
        <div class="menu" role="group" aria-label="Flavor directions">
          <button v-for="f in directionItems" :key="f.name" class="frow" :class="{on:isDirSel(f.name)}" :aria-pressed="isDirSel(f.name)" @click="toggleDirection(f.name)">
            <span class="frow__img" :style="{backgroundImage:'url('+f.img+')','--s':f.s}"></span>
            <span class="frow__txt"><span class="frow__name">{{f.label}}</span><span class="frow__desc">{{f.desc}}</span></span>
            <span class="frow__mark" aria-hidden="true"><b v-if="isDirSel(f.name)">{{dirRank(f.name)}}</b><svg v-else class="ic"><use href="#i-plus"/></svg></span>
          </button>
        </div>

        <template v-if="showSpecific">
          <h2 class="h2">House signatures <small>Pick one instead</small></h2>
          <div class="menu" role="radiogroup" aria-label="House signatures">
            <button v-for="f in specificItems" :key="f.name" class="frow frow--radio frow--tight" :class="{on:order.flavorType==='Specific'&&order.specific===f.name}" role="radio" :aria-checked="order.flavorType==='Specific'&&order.specific===f.name" @click="selectSpecific(f.name)">
              <span class="frow__img" :style="{backgroundImage:'url('+f.img+')','--s':f.s}"></span>
              <span class="frow__txt"><span class="frow__name">{{f.label}}</span></span>
              <span class="frow__mark" aria-hidden="true"><svg v-if="order.flavorType==='Specific'&&order.specific===f.name" class="ic"><use href="#i-check"/></svg><i v-else class="ring"></i></span>
            </button>
          </div>
        </template>

        <h2 class="h2">Or leave it to us</h2>
        <div class="menu" role="radiogroup" aria-label="Chef's choice or your own">
          <button class="frow frow--radio" :class="{on:order.flavorType==='Omakase'}" role="radio" :aria-checked="order.flavorType==='Omakase'" @click="selectOmakase">
            <span class="frow__img" :style="{backgroundImage:'url('+OMAKASE_IMG.img+')','--s':OMAKASE_IMG.s}"></span>
            <span class="frow__txt"><span class="frow__name">Hansum Omakase</span><span class="frow__desc">Let our shisha chef decide.</span></span>
            <span class="frow__mark" aria-hidden="true"><svg v-if="order.flavorType==='Omakase'" class="ic"><use href="#i-check"/></svg><i v-else class="ring"></i></span>
          </button>
          <button class="frow frow--radio" :class="{on:order.flavorType==='Other'}" role="radio" :aria-checked="order.flavorType==='Other'" @click="pickOther">
            <span class="frow__img" :style="{backgroundImage:'url('+OTHER_IMG.img+')','--s':OTHER_IMG.s}"></span>
            <span class="frow__txt"><span class="frow__name">Something else</span><span class="frow__desc">Tell us what you have in mind.</span></span>
            <span class="frow__mark" aria-hidden="true"><svg v-if="order.flavorType==='Other'" class="ic"><use href="#i-check"/></svg><i v-else class="ring"></i></span>
          </button>
          <div class="reveal" :class="{open:order.flavorType==='Other'}">
            <div class="reveal__in">
              <textarea ref="otherText" v-model="order.other" class="field" rows="3" placeholder="Tell us your preferred flavor…" aria-label="Preferred flavor" :tabindex="order.flavorType==='Other'?0:-1"></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Feel: three faders -->
      <section v-else-if="step===4" class="scr scr--feel" :key="'feel'">
        <div class="ph">
          <h1 class="h1" tabindex="-1" data-focus>How should it feel?</h1>
          <p class="voice" aria-live="polite">{{feelSentence}}</p>
        </div>
        <div class="dials" :class="{'dials--two':dials.length===2}">
          <div v-for="d in dials" :key="d.field" class="dial" :class="['tone-'+d.tone,{active:activeDial===d.field}]">
            <div class="dial__val" aria-hidden="true"><span :key="d.val">{{d.val}}</span></div>
            <div class="dial__track" role="slider" tabindex="0" aria-orientation="vertical"
                 :aria-label="d.name" aria-valuemin="0" :aria-valuemax="prefMax" :aria-valuenow="d.val" :aria-valuetext="d.val+' of '+prefMax+', '+d.band"
                 @pointerdown.prevent="dialDown(d.field,$event)" @pointermove="dialMove(d.field,$event)" @pointerup="dialUp" @pointercancel="dialUp" @keydown="dialKey(d.field,$event)">
              <i v-for="lv in levels" :key="lv" class="lv" :class="{on:lv>0&&lv<=d.val,tip:lv>0&&lv===d.val,zero:lv===0,sel:lv===d.val,lock:lv>prefMax}"><span>{{lv}}</span></i>
            </div>
            <div class="dial__name">{{d.name}}</div>
            <div class="dial__band">{{d.band}}</div>
          </div>
        </div>
        <p class="capnote" :class="{hit:capHit}" v-if="prefMax===5" role="note">
          <svg class="ic"><use href="#i-lock"/></svg>
          <span>Maximum intensity is 5. For stronger intensity, please select <button class="link link--inline" @click="switchToDark">Dark Leaf</button>.</span>
        </p>
      </section>

      <!-- 6. Extras: optional, light -->
      <section v-else-if="step===6" class="scr scr--extras" :key="'extras'">
        <div class="ph">
          <h1 class="h1" tabindex="-1" data-focus>Make it yours</h1>
          <p class="sub">Optional. Skip if you are happy as it is.</p>
        </div>
        <div class="chips" role="group" aria-label="Add-ons">
          <button v-for="a in addonOptions" :key="a.name" class="chip" :class="{on:isAddonSelected(a.name)}" :aria-pressed="isAddonSelected(a.name)" @click="toggleAddon(a)">
            <span class="chip__mark" aria-hidden="true"><svg class="ic"><use href="#i-check"/></svg></span>
            <span class="chip__txt"><span class="chip__name">{{addonName(a)}}</span><span class="chip__price">+{{formatPrice(a.price)}}<template v-if="addonNote(a)"> · {{addonNote(a)}}</template></span></span>
          </button>
          <button class="chip chip--other" :class="{on:otherAddonEnabled}" :aria-pressed="otherAddonEnabled" @click="pickOtherAddon">
            <span class="chip__mark" aria-hidden="true"><svg class="ic"><use href="#i-check"/></svg></span>
            <span class="chip__txt"><span class="chip__name">Something else</span><span class="chip__price">Custom request</span></span>
          </button>
        </div>
        <div class="reveal" :class="{open:otherAddonEnabled}">
          <div class="reveal__in">
            <input ref="otherAddon" v-model="order.otherAddon" class="field" placeholder="Please specify…" aria-label="Other add-on" :tabindex="otherAddonEnabled?0:-1">
          </div>
        </div>
        <p class="fine fine--pad">{{addonTotal?'Extras add '+formatPrice(addonTotal)+' VND. ':''}}{{t('vatSentence')}}</p>
      </section>

      <!-- 7. Review: my Hansum order -->
      <section v-else-if="step===7" class="scr scr--review" :key="'review'">
        <article class="card" aria-labelledby="rv-title">
          <div class="card__photo" :style="{backgroundImage:'url('+(currentMeta?currentMeta.img:'')+')',backgroundPosition:currentMeta?currentMeta.pos:'50% 50%'}">
            <span class="card__stamp">Table {{order.table}}</span>
          </div>
          <div class="card__body">
            <h1 id="rv-title" class="card__title" tabindex="-1" data-focus>Your Hansum</h1>
            <p class="card__on"><template v-if="bowlObj">{{shishaDisplay}} on {{bowlArticle}} {{bowlObj.label}}</template><template v-else-if="order.shishaType==='Fruit Head'">Fruit Head, served in fresh fruit</template><template v-else>{{shishaDisplay}}</template></p>

            <dl class="lines">
              <div class="line">
                <dt>Flavor</dt>
                <dd>{{flavorLabel}}</dd>
                <button class="edit" @click="go(3)" aria-label="Edit flavor"><svg class="ic"><use href="#i-edit"/></svg></button>
              </div>
              <div class="line line--feel">
                <dt>Feel</dt>
                <dd>
                  <span class="mini" v-for="d in dials" :key="d.field" :class="'tone-'+d.tone">
                    <span class="mini__k">{{d.name}}</span>
                    <span class="mini__bar"><i v-for="n in 10" :key="n" :class="{on:n<=d.val}"></i></span>
                    <span class="mini__v">{{d.val}}</span>
                  </span>
                </dd>
                <button class="edit" @click="go(4)" aria-label="Edit feel"><svg class="ic"><use href="#i-edit"/></svg></button>
              </div>
              <div class="line" v-if="order.addons.length||order.otherAddon.trim()">
                <dt>Extras</dt>
                <dd>
                  <span class="xline" v-for="a in order.addons" :key="a.name"><span>{{a.name}}</span><span class="num">+{{formatPrice(a.price)}}</span></span>
                  <span class="xline" v-if="order.otherAddon.trim()"><span>{{order.otherAddon}}</span><span class="num">Custom</span></span>
                </dd>
                <button class="edit" @click="go(6)" aria-label="Edit extras"><svg class="ic"><use href="#i-edit"/></svg></button>
              </div>
            </dl>

            <div class="total">
              <span>Total</span>
              <span class="total__n"><b>{{formatPrice(totalPrice)}}</b> VND</span>
            </div>
            <p class="fine">{{t('vatSentence')}}</p>
          </div>
        </article>
        <div class="alert" role="alert" v-if="sendMessage"><svg class="ic"><use href="#i-alert"/></svg><span>{{sendMessage}}</span></div>
      </section>

      <!-- 8 / 11. Sent + Order more -->
      <section v-else-if="step===8||step===11" class="scr scr--sent" :key="'sent'+step">
        <div class="sent__photo"></div>
        <div class="sent__shade"></div>
        <div class="sent__body">
          <svg class="tickring" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="36"/><path d="M25 41.5l10 10L56 30"/></svg>
          <h1 class="display display--m" tabindex="-1" data-focus>{{sentTitle}}</h1>
          <p class="lede">{{sentText}}</p>

          <div class="stub">
            <div class="stub__main">
              <span class="stub__k">Order reference</span>
              <span class="stub__ref">{{refShown}}</span>
            </div>
            <button class="stub__copy" @click="copy(refShown,'ref')" :aria-label="'Copy order reference '+refShown"><svg class="ic"><use :href="copied==='ref'?'#i-check':'#i-copy'"/></svg><span>{{copied==='ref'?'Copied':'Copy'}}</span></button>
          </div>

          <section class="more" aria-labelledby="more-h">
            <h2 id="more-h" class="h2 h2--flush">The menu is still open.</h2>
            <p class="sub sub--tight">Order more shisha or drinks whenever you like. Each new order is sent separately.</p>
            <button class="btn btn--gold btn--block" @click="startMoreOrder">Order drinks<svg class="ic"><use href="#i-arrow"/></svg></button>
            <button class="btn btn--line btn--block" @click="startMoreShisha">Another shisha</button>
            <button class="btn btn--ghost btn--block" @click="go(0)">Keep browsing</button>
          </section>
          <button class="link link--center link--dim" @click="finish">I’m done for tonight</button>
        </div>
      </section>

      <!-- 9. Drinks (independent of shisha) -->
      <section v-else-if="step===9" class="scr scr--drinks" :key="'drinks'">
        <header class="dhead">
          <div class="dhead__photo" :style="{backgroundImage:'url('+L.drinkPhoto+')',backgroundPosition:L.drinkPos}"></div>
          <div class="dhead__shade"></div>
          <div class="dhead__in">
            <h1 class="h1 h1--l" tabindex="-1" data-focus>Drinks</h1>
            <p class="sub sub--tight">{{shishaSent?'Your shisha order has already been sent. ':''}}{{tx('vat','Prices in VND. 8/10% VAT not included.')}}</p>
          </div>
        </header>
        <div class="cats">
          <div v-for="(cat,ci) in moreCategories" :key="cat.label+cat.name" class="cat" :class="{open:openCat===ci}">
            <h2 class="cat__h">
              <button :id="'cathead-'+ci" class="cat__btn" @click="toggleCat(ci)" :aria-expanded="openCat===ci" :aria-controls="'cat-'+ci">
                <span class="cat__title">{{catTitle(cat)}}</span>
                <span class="cat__meta">from {{formatPrice(catFrom(cat))}}</span>
                <svg class="ic cat__chev"><use href="#i-down"/></svg>
              </button>
            </h2>
            <div class="cat__body" :id="'cat-'+ci" role="region" :aria-labelledby="'cathead-'+ci" :inert="openCat!==ci">
              <div class="cat__in">
                <div class="item" v-for="it in cat.items" :key="it.name" :class="{has:itemQty(it.name)}">
                  <div class="item__txt">
                    <span class="item__name">{{it.name}}</span>
                    <span class="item__note" v-if="it.note">{{it.note}}</span>
                    <span class="item__price num">{{formatPrice(it.price)}}</span>
                  </div>
                  <div class="qty" v-if="itemQty(it.name)">
                    <button @click="changeQty(it,-1)" :aria-label="'Remove one '+it.name"><svg class="ic"><use href="#i-minus"/></svg></button>
                    <span class="qty__n" aria-live="polite">{{itemQty(it.name)}}</span>
                    <button @click="changeQty(it,1)" :aria-label="'Add one more '+it.name"><svg class="ic"><use href="#i-plus"/></svg></button>
                  </div>
                  <button v-else class="add" @click="addMoreItem(it)" :aria-label="'Add '+it.name"><svg class="ic"><use href="#i-plus"/></svg></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 10. Drinks review -->
      <section v-else-if="step===10" class="scr scr--round" :key="'round'">
        <article class="card card--slim">
          <div class="card__body">
            <h1 class="card__title" tabindex="-1" data-focus>Your round</h1>
            <p class="card__on">Table {{order.table}}. Sent as its own order, separate from your shisha.</p>
            <ul class="round">
              <li v-for="it in basket" :key="it.name">
                <div class="round__t"><span class="round__name">{{it.name}}</span><span class="round__sum num">{{formatPrice(it.price*it.qty)}}</span></div>
                <div class="qty qty--s">
                  <button @click="changeQty(it,-1)" :aria-label="'Remove one '+it.name"><svg class="ic"><use href="#i-minus"/></svg></button>
                  <span class="qty__n">{{it.qty}}</span>
                  <button @click="changeQty(it,1)" :aria-label="'Add one more '+it.name"><svg class="ic"><use href="#i-plus"/></svg></button>
                </div>
              </li>
              <li v-if="!basket.length" class="round__empty">Nothing here yet. <button class="link link--inline" @click="go(9)">Choose drinks</button></li>
            </ul>
            <div class="total"><span>{{tx('subtotal','Subtotal')}}</span><span class="total__n"><b>{{formatPrice(basketTotal)}}</b> VND</span></div>
            <p class="fine">Drinks per person: 1 drink minimum.<br>{{t('vatSentence')}}</p>
          </div>
        </article>
        <div class="alert" role="alert" v-if="sendMessage"><svg class="ic"><use href="#i-alert"/></svg><span>{{sendMessage}}</span></div>
        <button class="link link--center" @click="go(9)">Add more drinks</button>
      </section>
    </main>

    <!-- ===== Dock: one place for the primary action ===== -->
    <footer class="dock" v-if="dock.show">
      <button class="dock__sum" v-if="dock.summary" @click="sheet='order'" :aria-label="'Order so far: '+dock.summary+'. Open details'">
        <span class="dock__txt">{{dock.text}}</span>
        <span class="dock__price num" v-if="dock.price"><b>{{formatPrice(dock.price)}}</b> VND</span>
        <svg class="ic"><use href="#i-up"/></svg>
      </button>
      <p class="dock__note" v-else-if="dock.note">{{dock.note}}</p>
      <div class="dock__row">
        <button class="dock__back" v-if="dock.back" @click="back" :aria-label="tx('back','Back')"><svg class="ic"><use href="#i-left"/></svg></button>
        <p class="dock__hint" v-if="dock.hint">{{dock.hint}}</p>
        <button v-else class="btn btn--gold btn--grow" :class="{busy:sending}" :disabled="dock.disabled" :aria-busy="sending" @click="dockAct">
          <span>{{sending?tx('sending','Sending…'):dock.label}}</span><svg class="ic" v-if="!sending&&!dock.disabled"><use href="#i-arrow"/></svg>
        </button>
      </div>
    </footer>

    <!-- ===== Sheets ===== -->
    <div class="scrim" v-if="sheet" @click="sheet=''"></div>
    <section class="sheet" :class="{open:sheet}" role="dialog" aria-modal="true" :aria-label="sheet==='order'?'Order so far':'Table information'" :inert="!sheet">
      <div class="sheet__grab"><button @click="sheet=''" aria-label="Close"><svg class="ic"><use href="#i-close"/></svg></button></div>

      <div v-if="sheet==='order'" class="sheet__in">
        <template v-if="inShishaFlow">
          <h2 class="sheet__h">Your order so far</h2>
          <ul class="rows">
            <li v-for="r in orderRows" :key="r.k">
              <span class="rows__k">{{r.k}}</span><span class="rows__v">{{r.v}}</span>
              <button class="edit edit--txt" @click="go(r.step)" :aria-label="'Change '+r.k">Change</button>
            </li>
          </ul>
          <div class="total"><span>Total</span><span class="total__n"><b>{{formatPrice(totalPrice)}}</b> VND</span></div>
          <p class="fine">{{t('vatSentence')}}</p>
        </template>
        <template v-else>
          <h2 class="sheet__h">Your round</h2>
          <ul class="round">
            <li v-for="it in basket" :key="it.name">
              <div class="round__t"><span class="round__name">{{it.name}}</span><span class="round__sum num">{{formatPrice(it.price*it.qty)}}</span></div>
              <div class="qty qty--s"><button @click="changeQty(it,-1)" :aria-label="'Remove one '+it.name"><svg class="ic"><use href="#i-minus"/></svg></button><span class="qty__n">{{it.qty}}</span><button @click="changeQty(it,1)" :aria-label="'Add one more '+it.name"><svg class="ic"><use href="#i-plus"/></svg></button></div>
            </li>
            <li v-if="!basket.length" class="round__empty">Nothing here yet.</li>
          </ul>
          <div class="total"><span>{{tx('subtotal','Subtotal')}}</span><span class="total__n"><b>{{formatPrice(basketTotal)}}</b> VND</span></div>
          <p class="fine">{{t('vatSentence')}}</p>
        </template>
      </div>

      <div v-if="sheet==='lounge'" class="sheet__in">
        <h2 class="sheet__h">Hansum {{L.name}}</h2>
        <p class="sheet__sub">Table {{order.table||'–'}}<template v-if="tableLocked"> · from your table’s QR</template></p>
        <div class="wifi">
          <div><span class="wifi__k">Wi-Fi</span><span class="wifi__v">{{L.wifi.ssid}}</span></div>
          <div><span class="wifi__k">Password</span><span class="wifi__v">{{L.wifi.pass}}</span></div>
          <button class="btn btn--line btn--sm" @click="copy(L.wifi.pass,'wifi')"><svg class="ic"><use :href="copied==='wifi'?'#i-check':'#i-copy'"/></svg>{{copied==='wifi'?'Copied':'Copy password'}}</button>
        </div>
        <div class="seg seg--3" role="group" aria-label="Language"><button v-for="lg in languages" :key="lg.code" :class="{on:locale===lg.code}" :aria-pressed="locale===lg.code" @click="setLocale(lg.code)">{{lg.label}}</button></div>
        <div class="links">
          <a :href="L.ig" target="_blank" rel="noopener"><img :src="L.qrIg" alt="" width="52" height="52"><span>Instagram<small>{{L.handle}}</small></span><svg class="ic"><use href="#i-out"/></svg></a>
          <a :href="L.map" target="_blank" rel="noopener"><img :src="L.qrMap" alt="" width="52" height="52"><span>Google Maps<small>{{L.city}}</small></span><svg class="ic"><use href="#i-out"/></svg></a>
          <a href="https://hansumshisha.com/" target="_blank" rel="noopener"><span class="links__web">hansumshisha.com</span><svg class="ic"><use href="#i-out"/></svg></a>
        </div>
      </div>
    </section>

    <!-- ===== Confirm: sending moment ===== -->
    <div class="sending" v-if="sending" role="alertdialog" aria-live="assertive" aria-label="Sending your order">
      <div class="sending__in">
        <p class="sending__k">Sending to our team</p>
        <p class="sending__t">{{sendingLine}}</p>
        <div class="sending__bar"><i></i></div>
        <p class="sending__s">Keep this screen open for a moment.</p>
      </div>
    </div>

    <div class="toast" v-if="toast" role="status">{{toast}}</div>
  </div>
`, mixin: mixin };
})();
