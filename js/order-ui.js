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
     data:    L, order, selectedDirections, flavorDirections, specificFlavors, signatureFlavors, addonOptions,
              otherAddonEnabled, basket, moreCategories, shishaOptions, refillOptions, tables,
              sending, sendMessage, shishaSent, drinkSent, shishaOrderRef, drinkOrderRef, locale, languages
     computed: tableLocked, prefMax, bowlLabel, flavorSummary, canContinueFlavor, showSpecific,
               totalPrice, addonTotal, basketTotal, basketCount
     methods: selectShisha, selectRefill, selectBowl, toggleDirection, selectSpecific, selectOther,
              selectOmakase, selectSignature, nextFromFlavor, nextFromPreferences, toggleAddon, toggleOtherAddon,
              isAddonSelected, itemQty, changeQty, addMoreItem, confirmOrder, sendFinalOrder,
              startMoreOrder, startMoreShisha, finish, back, formatPrice, persistState, t, setLocale,
              categoryTitle, clampPreferences */
(function () {
  'use strict';
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var reduced = function () { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); };
  var NB = String.fromCharCode(160);

  /* Customer-facing wording per language lives in js/order-i18n.js (window.HANSUM_I18N). Display only:
     the order payload keeps its production values. English falls back for any missing key. */
  var I18N = window.HANSUM_I18N || { langs: [{ code: 'en', label: 'English', short: 'EN', html: 'en' }], en: {} };
  var fill = function (s, vars) { return vars ? s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }) : s; };

  /* Customer-facing presentation of each production shishaType. Prices are NOT here.
     label / tier are product names and stay the same in every language; noteKey / refillOf are translated. */
  var CATALOG = {
    'Classic': { label: 'Blonde Leaf', tier: 'Classic', img: 'images/select-leaf/blonde-leaf.png', pos: '72% 50%', notes: 'Al Fakher · Adalya · Jam', ceiling: 5 },
    'Premium': { label: 'Dark Leaf', tier: 'Premium', img: 'images/select-leaf/dark-leaf.png', pos: '72% 50%', notes: 'Darkside · MustHave · Element · Spectrum · Kismet · etc.', ceiling: 10 },
    'Fruit Head': { label: 'Fruit Head', tier: 'Signature', img: 'images/select-leaf/fruit-head.png', pos: '74% 45%', notes: 'Dragon Fruit · Pineapple · Apple etc.', noteKey: 'note_fruit', ceiling: 10, fruit: true },
    'Signature': { label: 'Hansum Signature', tier: 'Signature', img: 'images/signature/black-temple.webp', pos: '72% 50%', notes: '8 exclusive house blends', noteKey: 'note_sig', ceiling: 10, signature: true },
    'Refill Blonde': { label: 'Blonde Leaf refill', refillOf: 'Blonde Leaf', tier: 'Refill', img: 'images/select-leaf/blonde-leaf.png', pos: '72% 50%', notes: 'Al Fakher · Adalya · Jam', ceiling: 10 },
    'Refill Dark': { label: 'Dark Leaf refill', refillOf: 'Dark Leaf', tier: 'Refill', img: 'images/select-leaf/dark-leaf.png', pos: '72% 50%', notes: 'Darkside · MustHave · Element · Spectrum · Kismet · etc.', ceiling: 10 }
  };

  /* Bowls: `value` is the unchanged internal production value passed to selectBowl(). Never shown to customers. */
  var BOWLS = [
    { value: 'Egyptian Bowl — Cosmo', label: 'Egyptian Bowl', short: 'Egyptian', cls: 'egy', line: 'Classic · Smooth', lineKey: 'bowl_line_egy' },
    { value: 'Phunnel Bowl — Oblako', label: 'Phunnel Bowl', short: 'Phunnel', cls: 'phu', line: 'Rich · Smoky', lineKey: 'bowl_line_phu' }
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

  var STEP_NAMES = { 1: 'step_leaf', 2: 'step_bowl', 3: 'step_flavor', 4: 'step_feel', 6: 'step_extras', 7: 'step_review', 9: 'step_drinks', 10: 'step_round' };

  /* bandInt / bandCool / bandMint return these English band names; BAND_KEY turns them into i18n keys */
  var BAND_KEY = { 'Light': 'light', 'Balanced': 'balanced', 'Strong': 'strong', 'Soft': 'soft', 'Medium': 'medium', 'Icy': 'icy', 'Extreme icy': 'extreme', 'Extreme strong': 'extreme' };

  var mixin = {
    data: function () {
      return {
        levels: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
        sheet: '', openCat: 0, toast: '', copied: '', dir: 'fwd',
        shishaMode: 'new', drinksFrom: 0, capHit: '', activeDial: '',
        tableConfirmed: false, sentLog: [],
        /* Signature cards 3-8 get their src only after card 1 has loaded, so the first visible photo is not
           sharing bandwidth with the whole list (Chrome's lazy-load distance covers all 8 cards). */
        sigFirstDone: false,
        BOWLS: BOWLS, OMAKASE_IMG: OMAKASE_IMG, OTHER_IMG: OTHER_IMG, LANGS: I18N.langs
      };
    },

    computed: {
      needsTable: function () { return !!(this.L.chooser && !this.tableLocked && !this.tableConfirmed && this.step === 0); },
      isRefill: function () { var t = this.order.shishaType; return t === 'Refill Blonde' || t === 'Refill Dark'; },
      bandList: function () {
        var src = this.shishaMode === 'refill' ? this.refillOptions : this.shishaOptions;
        var self = this;
        return src.map(function (o) {
          var m = CATALOG[o.type];
          return Object.assign({}, o, m, { label: self.leafLabel(o.type), notes: m.noteKey ? self.tr(m.noteKey) : m.notes, tierText: m.tier === 'Refill' ? self.tr('tier_Refill') : m.tier });
        });
      },
      currentMeta: function () { return CATALOG[this.order.shishaType] || null; },
      shishaDisplay: function () { return this.currentMeta ? this.leafLabel(this.order.shishaType) : ''; },
      langNow: function () { var c = this.locale; return I18N.langs.find(function (l) { return l.code === c; }) || I18N.langs[0]; },
      hasBowl: function () { var t = this.order.shishaType; return t === 'Classic' || t === 'Premium'; },
      hasMint: function () { var t = this.order.shishaType; return t === 'Classic' || t === 'Premium'; },
      bowlObj: function () { var v = this.order.bowl; return BOWLS.find(function (b) { return b.value === v; }) || null; },
      /* the chosen Hansum Signature blend (display only; order keeps id + name) */
      sigObj: function () { var id = this.order.signatureFlavorId; return id ? (this.signatureFlavors || []).find(function (f) { return f.id === id; }) || null : null; },
      isSignature: function () { return this.order.shishaType === 'Signature'; },
      bowlArticle: function () { return /^[aeiou]/i.test(this.bowlLabel) ? 'an' : 'a'; },

      directionItems: function () {
        var self = this;
        return this.flavorDirections.map(function (f) { return Object.assign({}, FLAVOR_META[f.name], { name: f.name, label: self.flavorName(f.name), desc: self.trOr('dir_' + f.name, f.description) }); });
      },
      specificItems: function () {
        var self = this;
        return this.specificFlavors.map(function (f) { return Object.assign({}, FLAVOR_META[f.name], { name: f.name, label: self.flavorName(f.name) }); });
      },
      flavorLabel: function () {
        var t = this.order.flavorType;
        if (!t) return '';
        if (t === 'Other') return this.flavorSummary.trim();
        if (this.locale !== 'en') {
          /* same content as the English line, built from translated names (the order itself is not touched) */
          if (t === 'Direction') return this.selectedDirections.map(this.flavorName).join(', ');
          if (t === 'Specific') return this.flavorName(this.order.specific);
          if (t === 'Omakase') return 'Hansum Omakase';
          if (t === 'Signature') return this.order.signatureFlavorName;
        }
        return this.flavorSummary.toLowerCase().replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }).split(' · ').join(', ');
      },
      /* Compact phrase for the running summary. Never a list of names, so it can not truncate mid-word. */
      flavorBrief: function () {
        var t = this.order.flavorType, n = this.selectedDirections.length;
        if (t === 'Direction') {
          if (!n) return '';
          return n === 1 ? this.flavorName(this.selectedDirections[0]) : this.trn('n_flavors', n);
        }
        if (t === 'Specific') { var d = FLAVOR_META[this.order.specific]; return d ? this.flavorName(this.order.specific) : ''; }
        if (t === 'Omakase') return 'Omakase';
        if (t === 'Other') return this.tr('custom_flavor');
        if (t === 'Signature') return this.order.signatureFlavorName;
        return '';
      },
      /* What the customer has composed so far, shown above the flavor list. */
      blend: function () {
        var t = this.order.flavorType, sel = this.selectedDirections, self = this;
        if (t === 'Direction' || !t) {
          var slots = [0, 1, 2].map(function (i) {
            var m = FLAVOR_META[sel[i]];
            return m ? { key: sel[i], label: self.flavorName(sel[i]), img: m.img } : null;
          });
          return { mode: 'dir', slots: slots };
        }
        if (t === 'Specific') { var d = FLAVOR_META[this.order.specific]; return { mode: 'one', slots: [{ key: this.order.specific, label: this.flavorName(this.order.specific), img: d.img, note: this.tr('note_house') }] }; }
        if (t === 'Omakase') return { mode: 'one', slots: [{ key: 'OM', label: 'Hansum Omakase', img: OMAKASE_IMG.img, note: this.tr('note_chef') }] };
        return { mode: 'one', slots: [{ key: 'OT', label: this.order.other.trim() || this.tr('your_own'), img: OTHER_IMG.img, note: this.tr('note_words') }] };
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
      stepName: function () { return this.step === 3 && this.isSignature ? this.tr('step_signature') : STEP_NAMES[this.step] ? this.tr(STEP_NAMES[this.step]) : ''; },
      stepCount: function () { return this.journeyIndex >= 0 ? this.tr('stepOf', { i: this.journeyIndex + 1, n: this.journey.length }) : ''; },
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
            if (!this.currentMeta) return Object.assign(base, { hint: this.tr('hint_leaf') });
            return Object.assign(base, { label: this.tr('cont_with', { x: this.shishaDisplay }), disabled: false, act: 'fromShisha' });
          }
          if (s === 2) {
            if (!this.bowlObj) return Object.assign(base, { hint: this.tr('hint_bowl') });
            return Object.assign(base, { label: this.tr('cont_with', { x: this.bowlObj.short }), disabled: false, act: 'fromBowl' });
          }
          if (s === 3 && this.isSignature && !this.sigObj) return Object.assign(base, { hint: this.tr('hint_sig') });
          if (s === 3) return Object.assign(base, { label: this.tr('continue'), disabled: !this.canContinueFlavor, act: 'nextFromFlavor' });
          if (s === 4) return Object.assign(base, { label: this.tr('continue'), disabled: false, act: 'nextFromPreferences' });
          if (s === 6) return Object.assign(base, { label: o.addons.length || o.otherAddon.trim() ? this.tr('review_order') : this.tr('skip_review'), disabled: false, act: 'toReview' });
          if (s === 7) return Object.assign(base, { label: this.tr('confirm_send'), disabled: this.sending, act: 'confirmOrder', note: this.tr('note_team', { n: o.table }), summary: '', parts: [] });
        }
        if (s === 9) {
          var n = this.basketCount, w = this.trn('items', n);
          return { show: true, back: true, summary: n ? w : '', text: n ? w.split(' ').join(NB) : '', price: this.basketTotal, label: n ? this.tr('review_round') : this.tr('choose_something'), disabled: !n, act: 'toRound' };
        }
        if (s === 10) return { show: true, back: true, summary: '', price: 0, label: this.tr('confirm_send'), disabled: this.sending || !this.basketCount, act: 'sendFinalOrder', note: this.tr('note_separate', { n: o.table }) };
        return { show: false };
      },
      refShown: function () { return this.step === 11 ? this.drinkOrderRef : this.shishaOrderRef; },
      sentTitle: function () { return this.step === 8 ? this.tr('sent_title') : this.tr('sent_title_more'); },
      sentText: function () { return this.tr(this.step === 8 ? 'sent_text' : 'sent_text_more', { n: this.order.table }); },
      sendingLine: function () {
        if (this.step === 10) return this.tr('tableN', { n: this.order.table }) + ', ' + this.trn('items', this.basketCount) + ', ' + this.formatPrice(this.basketTotal) + ' VND';
        return [this.tr('tableN', { n: this.order.table }), this.shishaDisplay, this.bowlObj ? this.bowlObj.short : '', this.flavorLabel].filter(Boolean).join(', ');
      },

      /* Feel: descriptive wording only. Ranges, defaults and caps are production rules (order.*, prefMax). */
      feelSentence: function () {
        var o = this.order, i = o.intensity, c = o.mint, m = o.mintiness;
        var s = i === 0 ? this.tr('fs_barely') : this.tr('fs_int_' + BAND_KEY[this.bandInt(i)]);
        var coolTxt = c === 0 ? '' : this.tr('fs_cool_' + BAND_KEY[this.bandCool(c)]);
        var mintTxt = !this.hasMint || m === 0 ? '' : this.tr('fs_mint_' + BAND_KEY[this.bandMint(m)]);
        var extra = [coolTxt, mintTxt].filter(Boolean);
        return extra.length ? this.tr('fs_with', { base: s, list: extra.join(this.tr('fs_and')) }) : this.tr('fs_nocool', { base: s });
      },
      dials: function () {
        var o = this.order;
        var d = [
          { field: 'intensity', name: this.tr('d_int'), val: o.intensity, band: this.bandText('int', this.bandInt(o.intensity)), tone: 'gold' },
          { field: 'mint', name: this.tr('d_cool'), val: o.mint, band: this.bandText('cool', this.bandCool(o.mint)), tone: 'cyan' }
        ];
        if (this.hasMint) d.push({ field: 'mintiness', name: this.tr('d_mint'), val: o.mintiness, band: this.bandText('mint', this.bandMint(o.mintiness)), tone: 'mint' });
        return d;
      },
      feelShort: function () {
        var o = this.order, t = this.tr('d_int') + ' ' + o.intensity + ' · ' + this.tr('d_cool') + ' ' + o.mint;
        if (this.hasMint) t += ' · ' + this.tr('d_mint') + ' ' + o.mintiness;
        return t;
      },
      orderRows: function () {
        var o = this.order, rows = [], self = this;
        rows.push({ k: this.tr('k_shisha'), v: this.shishaDisplay, step: 1 });
        if (this.hasBowl && o.bowl) rows.push({ k: this.tr('k_bowl'), v: this.bowlLabel, step: 2 });
        rows.push({ k: this.isSignature ? this.tr('k_signature') : this.tr('k_flavor'), v: this.flavorLabel || this.tr('not_chosen'), step: 3 });
        rows.push({ k: this.tr('k_feel'), v: this.feelShort, step: 4 });
        var ex = o.addons.map(function (a) { return self.locale === 'en' ? a.name : self.addonText(a.name); }).concat(o.otherAddon.trim() ? [o.otherAddon.trim()] : []);
        rows.push({ k: this.tr('k_extras'), v: ex.length ? ex.join(', ') : this.tr('none'), step: 6 });
        return rows;
      }
    },

    watch: {
      /* <html lang> follows the chosen language (screen readers, line breaking, fonts in css/order.css) */
      locale: { immediate: true, handler: function (c) {
        var l = I18N.langs.find(function (x) { return x.code === c; });
        document.documentElement.lang = l ? l.html : 'en';
        var skip = document.querySelector('a[href="#main"]'); if (skip) skip.textContent = this.tr('skip');   /* the page's static skip link */
      } },
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
      /* i18n (js/order-i18n.js). tr: key -> text in the chosen language, English when missing; {name} filled from vars. */
      tr: function (key, vars) {
        var d = I18N[this.locale] || {}, s = d[key];
        if (s == null) s = I18N.en[key];
        return s == null ? key : fill(s, vars);
      },
      /* trOr: like tr, but `fallback` (a page / POS value) when no language has the key */
      trOr: function (key, fallback, vars) {
        var d = I18N[this.locale] || {};
        if (d[key] != null) return fill(d[key], vars);
        if (I18N.en[key] != null) return fill(I18N.en[key], vars);
        return fallback;
      },
      /* plurals: key_one / key_few / key_many / key_other, chosen by Intl.PluralRules for the language */
      trn: function (key, n) {
        var d = I18N[this.locale] || {}, cat = 'other';
        try { cat = new Intl.PluralRules(this.locale).select(n); } catch (x) { /* very old browser */ }
        var s = d[key + '_' + cat] || d[key + '_other'] || I18N.en[key + '_' + (n === 1 ? 'one' : 'other')] || I18N.en[key + '_other'] || key;
        return fill(s, { n: n });
      },
      /* page / POS messages arrive in English: show the translation when it is a known message */
      trMsg: function (text) {
        if (!text || this.locale === 'en') return text;
        var en = I18N.en, k = Object.keys(en).find(function (x) { return (x.indexOf('err_') === 0 || x.indexOf('msg_') === 0) && en[x] === text; });
        return k ? this.tr(k) : text;
      },
      leafLabel: function (type) { var m = CATALOG[type]; if (!m) return ''; return m.refillOf ? this.tr('refill_of', { leaf: m.refillOf }) : m.label; },
      flavorName: function (key) { var m = FLAVOR_META[key]; return this.trOr('flavor_' + key, m ? m.label : key); },
      sigText: function (f, part) { return this.trOr('sig_' + f.id + '_' + part, part === 'd' ? f.description : f.tasting); },
      bandText: function (kind, band) { return band === 'None' ? this.tr('band_none') : this.tr(kind + '_' + BAND_KEY[band]); },
      addonText: function (name) { return this.trOr('addon_' + name, name); },
      kindText: function (k) { return this.trOr('kind_' + k, k); },
      pickLang: function (code) { this.setLocale(code); this.sheet = ''; },
      bandInt: function (v) { return v === 0 ? 'None' : v <= 3 ? 'Light' : v <= 6 ? 'Balanced' : 'Strong'; },
      bandCool: function (v) { return v === 0 ? 'None' : v <= 3 ? 'Soft' : v <= 6 ? 'Medium' : v <= 9 ? 'Icy' : 'Extreme icy'; },
      bandMint: function (v) { return v === 0 ? 'None' : v <= 3 ? 'Soft' : v <= 6 ? 'Medium' : v <= 9 ? 'Strong' : 'Extreme strong'; },
      addonName: function (a) { return this.trOr('addon_' + a.name, cap(a.name.replace(/\s*\(.*\)\s*$/, '').toLowerCase())); },
      addonNote: function (a) { return a.note ? this.trOr('addon_note_' + a.note, a.note) : ''; },
      catTitle: function (cat) {
        if (this.locale === 'en') return cat.name === 'Cocktails' ? cap(cat.label.toLowerCase()) + ' cocktails' : cat.name;
        return this.trOr(cat.name === 'Cocktails' ? 'cat_' + cat.label + '_Cocktails' : 'cat_' + cat.name, this.categoryTitle(cat));
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
        Object.assign(this.order, { shishaType: '', shishaName: '', price: 0, bowl: '', flavorType: '', specific: '', other: '', signatureFlavorId: '', signatureFlavorName: '' });
        this.selectedDirections = [];
        this.clampPreferences();
      },
      clearFlavor: function () { this.order.flavorType = ''; this.order.specific = ''; this.order.other = ''; this.order.signatureFlavorId = ''; this.order.signatureFlavorName = ''; this.selectedDirections = []; },
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

      /* Opening a category scrolls its header to just under the top bar. The target is where the header will
         END UP: a category open above it collapses at the same time, so its body height is subtracted; the
         top bar height is measured (it includes the iPhone safe-area inset). */
      toggleCat: function (i) {
        var self = this, prev = this.openCat, shift = 0;
        if (prev > -1 && prev < i) { var pb = document.getElementById('cat-' + prev); if (pb) shift = pb.offsetHeight; }
        this.openCat = this.openCat === i ? -1 : i;
        if (this.openCat === i) this.$nextTick(function () {
          var el = document.getElementById('cathead-' + i), st = self.$refs.stage, bar = document.querySelector('.top');
          if (!el || !st) return;
          var y = el.getBoundingClientRect().top - st.getBoundingClientRect().top + st.scrollTop - shift - (bar ? bar.offsetHeight : 64) - 8;
          st.scrollTo({ top: Math.max(0, y), behavior: reduced() ? 'auto' : 'smooth' });
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

    /* a saved vi / ru choice is restored here too (the page itself restores only the languages it lists) */
    created: function () {
      try { var saved = localStorage.getItem('hansumLocale'); if (saved && I18N.langs.some(function (l) { return l.code === saved; })) this.locale = saved; } catch (x) { /* storage blocked */ }
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
      <button class="mono" @click="sheet='lounge'" :aria-label="tr('tableInfoAria')"><span class="mono__g"></span></button>
      <div class="top__mid" aria-live="polite">
        <span class="top__name" v-if="stepName">{{stepName}}</span>
        <span class="top__count" v-if="stepCount">{{stepCount}}</span>
      </div>
      <div class="top__end">
        <button class="lang-chip" @click="sheet='lang'" :aria-label="tr('language')+': '+langNow.label" :lang="langNow.html"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3z"/></svg><span>{{langNow.short}}</span></button>
        <button class="tab-chip" @click="sheet='lounge'" :aria-label="tr('tableChipAria',{table:order.table?tr('tableN',{n:order.table}):tr('noTable'),name:L.name})">
          <span class="tab-chip__dot" :class="{qr:tableLocked}"></span>
          <span>{{tr('tableN',{n:order.table||'–'})}}</span>
        </button>
      </div>
    </header>

    <main id="main" class="stage" ref="stage" tabindex="-1">

      <!-- 0a. Saigon table chooser (no QR) -->
      <section v-if="needsTable" class="scr scr--table" :key="'table'">
        <div class="table__num" :class="{empty:!order.table}" aria-hidden="true">{{order.table||'00'}}</div>
        <div class="table__body">
          <h1 class="h1" tabindex="-1" data-focus>{{tr('tbl_h')}}</h1>
          <p class="sub">{{tr('tbl_sub')}}</p>
          <div class="table__grid" role="group" :aria-label="tr('tbl_grid')">
            <button v-for="t in tables" :key="t" class="tnum" :class="{on:order.table===t}" :aria-pressed="order.table===t" @click="chooseTable(t)">{{t}}</button>
          </div>
          <button class="btn btn--gold btn--block" :disabled="!order.table" @click="confirmTable">{{order.table?tr('tbl_confirm',{n:order.table}):tr('tbl_choose')}}<svg class="ic"><use href="#i-arrow"/></svg></button>
        </div>
      </section>

      <!-- 0b. Welcome -->
      <section v-else-if="step===0 && (tableLocked||L.chooser)" class="scr scr--welcome" :key="'welcome'">
        <div class="welcome__photo" role="img" :aria-label="tr('wel_photo')"></div>
        <div class="welcome__shade"></div>
        <div class="welcome__body">
          <p class="where"><span class="where__dot"></span>{{tr('wel_where',{name:L.name,n:order.table})}}</p>
          <h1 class="display" tabindex="-1" data-focus>{{tr('wel_h1a')}}<br><em>{{tr('wel_h1b')}}</em></h1>
          <p class="lede">{{tr('wel_lede')}}</p>

          <div class="onyours" v-if="sentLog.length" :aria-label="tr('wel_sentAria')">
            <p class="onyours__t">{{tr('wel_sent')}}</p>
            <ul>
              <li v-for="s in sentLog" :key="s.ref"><span class="onyours__ref">{{s.ref}}</span><span class="onyours__k">{{kindText(s.kind)}}</span></li>
            </ul>
          </div>

          <div class="acts">
            <button class="btn btn--gold btn--block" @click="startMoreShisha">{{shishaSent?tr('wel_another'):tr('wel_start')}}<svg class="ic"><use href="#i-arrow"/></svg></button>
            <button class="btn btn--line btn--block" @click="startMoreOrder">{{shishaSent||sentLog.length?tr('wel_drinks'):tr('wel_justDrinks')}}</button>
          </div>
          <button class="link link--center" @click="sheet='lounge'">{{tr('wel_links')}}</button>
        </div>
      </section>

      <!-- 1. Shisha: what experience am I buying? -->
      <section v-else-if="step===1" class="scr scr--shisha" :key="'shisha'">
        <div class="ph">
          <h1 class="h1" tabindex="-1" data-focus>{{tr('leaf_h')}}</h1>
          <div class="seg" role="group" :aria-label="tr('mode_aria')">
            <button :class="{on:shishaMode==='new'}" :aria-pressed="shishaMode==='new'" @click="setShishaMode('new')">{{tr('mode_new')}}</button>
            <button :class="{on:shishaMode==='refill'}" :aria-pressed="shishaMode==='refill'" @click="setShishaMode('refill')">{{tr('mode_refill')}}</button>
          </div>
          <p class="sub sub--tight" v-if="shishaMode==='refill'">{{tr('refill_sub')}}</p>
        </div>
        <div class="bands bands--tap" role="group" :aria-label="tr('shisha_aria')">
          <button v-for="s in bandList" :key="s.type" class="band" :class="{on:order.shishaType===s.type,'band--sig':s.signature}" :aria-pressed="order.shishaType===s.type" @click="tapShisha(s)">
            <span class="band__img" :style="{backgroundImage:'url('+s.img+')',backgroundPosition:s.pos}"></span>
            <span class="band__shade"></span>
            <span class="band__in">
              <span class="band__tier">{{s.tierText}}</span>
              <span class="band__head">
                <span class="band__name">{{s.label}}</span>
                <span class="band__price"><b>{{formatPrice(s.price)}}</b> VND</span>
              </span>
              <span class="band__more">
                <span class="band__notes">{{s.notes}}</span>
                <span class="gauge" :aria-label="tr('int_upto_aria',{n:s.type==='Classic'?5:10})">
                  <span class="gauge__t">{{tr('int_upto',{n:s.type==='Classic'?5:10})}}</span>
                  <span class="gauge__b"><i v-for="n in 10" :key="n" :class="{on:n<=(s.type==='Classic'?5:10)}"></i></span>
                </span>
                <span class="band__path" v-if="s.fruit">{{tr('path_fruit')}}</span>
                <span class="band__path" v-else-if="s.tier==='Refill'">{{tr('path_refill')}}</span>
                <span class="band__path" v-else-if="s.signature">{{tr('path_sig')}}</span>
              </span>
            </span>
            <span class="band__tick" aria-hidden="true"><svg class="ic"><use href="#i-check"/></svg></span>
          </button>
        </div>
      </section>

      <!-- 2. Bowl: which style? -->
      <section v-else-if="step===2" class="scr scr--bowl" :key="'bowl'">
        <div class="ph">
          <h1 class="h1" tabindex="-1" data-focus>{{tr('bowl_h')}}</h1>
          <p class="sub">{{tr('bowl_sub')}}</p>
        </div>
        <div class="bowls" :class="{pick:order.bowl}" role="group" :aria-label="tr('bowl_aria')">
          <button v-for="b in BOWLS" :key="b.value" class="bowl" :class="[b.cls,{on:order.bowl===b.value}]" :aria-pressed="order.bowl===b.value" @click="tapBowl(b)">
            <span class="bowl__img" role="img" :aria-label="b.label"></span>
            <span class="bowl__shade"></span>
            <span class="bowl__cap">
              <span class="bowl__name">{{b.label}}</span>
              <span class="bowl__line">{{tr(b.lineKey)}}</span>
            </span>
            <span class="bowl__tick" aria-hidden="true"><svg class="ic"><use href="#i-check"/></svg></span>
          </button>
        </div>
      </section>

      <!-- 3s. Hansum Signature: one of the 8 house blends (no bowl, no blending) -->
      <section v-else-if="step===3 && isSignature" class="scr scr--sig" :key="'signature'">
        <div class="ph">
          <h1 class="h1" tabindex="-1" data-focus>{{tr('sig_h')}}</h1>
          <p class="sub">{{tr('sig_sub')}}</p>
        </div>
        <div class="sigs" :class="{pick:sigObj}" role="radiogroup" :aria-label="tr('sig_aria')">
          <button v-for="(f,i) in signatureFlavors" :key="f.id" class="sig" :class="{on:order.signatureFlavorId===f.id}" role="radio" :aria-checked="order.signatureFlavorId===f.id" @click="selectSignature(f)">
            <img class="sig__img" :src="i<2||sigFirstDone?f.image:null" alt="" :loading="i<2?'eager':'lazy'" :fetchpriority="i<2?'high':'low'" decoding="async" @load="i===0&&(sigFirstDone=true)" @error="i===0&&(sigFirstDone=true)">
            <span class="sig__shade"></span>
            <span class="sig__cap">
              <span class="sig__name">{{f.name}}</span>
              <span class="sig__rule" aria-hidden="true"></span>
              <span class="sig__desc">{{sigText(f,'d')}}</span>
              <span v-if="f.tasting" class="sig__note">{{sigText(f,'t')}}</span>
            </span>
            <span class="sig__tick" aria-hidden="true"><svg class="ic"><use href="#i-check"/></svg></span>
          </button>
        </div>
      </section>

      <!-- 3. Flavor: explore, blend -->
      <section v-else-if="step===3" class="scr scr--flavor" :key="'flavor'">
        <div class="ph">
          <h1 class="h1" tabindex="-1" data-focus>{{tr('fl_h')}}</h1>
          <p class="sub sub--one">{{tr('fl_sub')}}</p>
        </div>

        <div class="blend" role="group" :aria-label="tr('blend_aria')">
          <template v-if="blend.mode==='dir'">
            <div v-for="(sl,i) in blend.slots" :key="i" class="slot">
              <button v-if="sl" class="slot__disc filled" :style="{backgroundImage:'url('+sl.img+')'}" @click="toggleDirection(sl.key)" :aria-label="tr('remove_x',{x:sl.label})"><span class="slot__x" aria-hidden="true"><svg class="ic"><use href="#i-close"/></svg></span></button>
              <span v-else class="slot__disc" aria-hidden="true">{{i+1}}</span>
              <span class="slot__name" :class="{dim:!sl}">{{sl?sl.label:tr('slot_'+(i+1))}}</span>
            </div>
          </template>
          <template v-else>
            <div class="slot slot--one">
              <button class="slot__disc filled" :style="{backgroundImage:'url('+blend.slots[0].img+')'}" @click="clearFlavor" :aria-label="tr('clear_x',{x:blend.slots[0].label})"><span class="slot__x" aria-hidden="true"><svg class="ic"><use href="#i-close"/></svg></span></button>
              <span class="slot__txt"><span class="slot__name">{{blend.slots[0].label}}</span><span class="slot__note">{{blend.slots[0].note}}</span></span>
            </div>
          </template>
        </div>

        <h2 class="h2">{{tr('fl_dirs')}}</h2>
        <div class="menu" role="group" :aria-label="tr('fl_dirs_aria')">
          <button v-for="f in directionItems" :key="f.name" class="frow" :class="{on:isDirSel(f.name)}" :aria-pressed="isDirSel(f.name)" @click="toggleDirection(f.name)">
            <span class="frow__img" :style="{backgroundImage:'url('+f.img+')','--s':f.s}"></span>
            <span class="frow__txt"><span class="frow__name">{{f.label}}</span><span class="frow__desc">{{f.desc}}</span></span>
            <span class="frow__mark" aria-hidden="true"><b v-if="isDirSel(f.name)">{{dirRank(f.name)}}</b><svg v-else class="ic"><use href="#i-plus"/></svg></span>
          </button>
        </div>

        <template v-if="showSpecific">
          <h2 class="h2">{{tr('house_h')}} <small>{{tr('house_small')}}</small></h2>
          <div class="menu" role="radiogroup" :aria-label="tr('house_h')">
            <button v-for="f in specificItems" :key="f.name" class="frow frow--radio frow--tight" :class="{on:order.flavorType==='Specific'&&order.specific===f.name}" role="radio" :aria-checked="order.flavorType==='Specific'&&order.specific===f.name" @click="selectSpecific(f.name)">
              <span class="frow__img" :style="{backgroundImage:'url('+f.img+')','--s':f.s}"></span>
              <span class="frow__txt"><span class="frow__name">{{f.label}}</span></span>
              <span class="frow__mark" aria-hidden="true"><svg v-if="order.flavorType==='Specific'&&order.specific===f.name" class="ic"><use href="#i-check"/></svg><i v-else class="ring"></i></span>
            </button>
          </div>
        </template>

        <h2 class="h2">{{tr('leave_h')}}</h2>
        <div class="menu" role="radiogroup" :aria-label="tr('leave_aria')">
          <button class="frow frow--radio" :class="{on:order.flavorType==='Omakase'}" role="radio" :aria-checked="order.flavorType==='Omakase'" @click="selectOmakase">
            <span class="frow__img" :style="{backgroundImage:'url('+OMAKASE_IMG.img+')','--s':OMAKASE_IMG.s}"></span>
            <span class="frow__txt"><span class="frow__name">Hansum Omakase</span><span class="frow__desc">{{tr('omakase_desc')}}</span></span>
            <span class="frow__mark" aria-hidden="true"><svg v-if="order.flavorType==='Omakase'" class="ic"><use href="#i-check"/></svg><i v-else class="ring"></i></span>
          </button>
          <button class="frow frow--radio" :class="{on:order.flavorType==='Other'}" role="radio" :aria-checked="order.flavorType==='Other'" @click="pickOther">
            <span class="frow__img" :style="{backgroundImage:'url('+OTHER_IMG.img+')','--s':OTHER_IMG.s}"></span>
            <span class="frow__txt"><span class="frow__name">{{tr('other')}}</span><span class="frow__desc">{{tr('other_desc')}}</span></span>
            <span class="frow__mark" aria-hidden="true"><svg v-if="order.flavorType==='Other'" class="ic"><use href="#i-check"/></svg><i v-else class="ring"></i></span>
          </button>
          <div class="reveal" :class="{open:order.flavorType==='Other'}">
            <div class="reveal__in">
              <textarea ref="otherText" v-model="order.other" class="field" rows="3" :placeholder="tr('other_ph')" :aria-label="tr('other_aria')" :tabindex="order.flavorType==='Other'?0:-1"></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Feel: three faders -->
      <section v-else-if="step===4" class="scr scr--feel" :key="'feel'">
        <div class="ph">
          <h1 class="h1" tabindex="-1" data-focus>{{tr('feel_h')}}</h1>
          <p class="voice" aria-live="polite">{{feelSentence}}</p>
        </div>
        <div class="dials" :class="{'dials--two':dials.length===2}">
          <div v-for="d in dials" :key="d.field" class="dial" :class="['tone-'+d.tone,{active:activeDial===d.field}]">
            <div class="dial__val" aria-hidden="true"><span :key="d.val">{{d.val}}</span></div>
            <div class="dial__track" role="slider" tabindex="0" aria-orientation="vertical"
                 :aria-label="d.name" aria-valuemin="0" :aria-valuemax="prefMax" :aria-valuenow="d.val" :aria-valuetext="tr('dial_valuetext',{v:d.val,max:prefMax,band:d.band})"
                 @pointerdown.prevent="dialDown(d.field,$event)" @pointermove="dialMove(d.field,$event)" @pointerup="dialUp" @pointercancel="dialUp" @keydown="dialKey(d.field,$event)">
              <i v-for="lv in levels" :key="lv" class="lv" :class="{on:lv>0&&lv<=d.val,tip:lv>0&&lv===d.val,zero:lv===0,sel:lv===d.val,lock:lv>prefMax}"><span>{{lv}}</span></i>
            </div>
            <div class="dial__name">{{d.name}}</div>
            <div class="dial__band">{{d.band}}</div>
          </div>
        </div>
        <p class="capnote" :class="{hit:capHit}" v-if="prefMax===5" role="note">
          <svg class="ic"><use href="#i-lock"/></svg>
          <span>{{tr('cap_a')}}<button class="link link--inline" @click="switchToDark">Dark Leaf</button>{{tr('cap_b')}}</span>
        </p>
      </section>

      <!-- 6. Extras: optional, light -->
      <section v-else-if="step===6" class="scr scr--extras" :key="'extras'">
        <div class="ph">
          <h1 class="h1" tabindex="-1" data-focus>{{tr('ex_h')}}</h1>
          <p class="sub">{{tr('ex_sub')}}</p>
        </div>
        <div class="chips" role="group" :aria-label="tr('ex_aria')">
          <button v-for="a in addonOptions" :key="a.name" class="chip" :class="{on:isAddonSelected(a.name)}" :aria-pressed="isAddonSelected(a.name)" @click="toggleAddon(a)">
            <span class="chip__mark" aria-hidden="true"><svg class="ic"><use href="#i-check"/></svg></span>
            <span class="chip__txt"><span class="chip__name">{{addonName(a)}}</span><span class="chip__price">+{{formatPrice(a.price)}}<template v-if="addonNote(a)"> · {{addonNote(a)}}</template></span></span>
          </button>
          <button class="chip chip--other" :class="{on:otherAddonEnabled}" :aria-pressed="otherAddonEnabled" @click="pickOtherAddon">
            <span class="chip__mark" aria-hidden="true"><svg class="ic"><use href="#i-check"/></svg></span>
            <span class="chip__txt"><span class="chip__name">{{tr('ex_other')}}</span><span class="chip__price">{{tr('ex_custom')}}</span></span>
          </button>
        </div>
        <div class="reveal" :class="{open:otherAddonEnabled}">
          <div class="reveal__in">
            <input ref="otherAddon" v-model="order.otherAddon" class="field" :placeholder="tr('ex_ph')" :aria-label="tr('ex_other_aria')" :tabindex="otherAddonEnabled?0:-1">
          </div>
        </div>
        <p class="fine fine--pad">{{addonTotal?tr('ex_adds',{p:formatPrice(addonTotal)}):''}}{{tr('vatSentence')}}</p>
      </section>

      <!-- 7. Review: my Hansum order -->
      <section v-else-if="step===7" class="scr scr--review" :key="'review'">
        <article class="card" aria-labelledby="rv-title">
          <div class="card__photo" :style="{backgroundImage:'url('+(sigObj?sigObj.image:currentMeta?currentMeta.img:'')+')',backgroundPosition:sigObj?'72% 50%':currentMeta?currentMeta.pos:'50% 50%'}">
            <span class="card__stamp">{{tr('tableN',{n:order.table})}}</span>
          </div>
          <div class="card__body">
            <h1 id="rv-title" class="card__title" tabindex="-1" data-focus>{{tr('rv_h')}}</h1>
            <p class="card__on"><template v-if="bowlObj">{{tr(bowlArticle==='an'?'rv_on_an':'rv_on_a',{shisha:shishaDisplay,bowl:bowlObj.label})}}</template><template v-else-if="order.shishaType==='Fruit Head'">{{tr('rv_fruit')}}</template><template v-else>{{shishaDisplay}}</template></p>

            <dl class="lines">
              <div class="line">
                <dt>{{isSignature?tr('k_signature'):tr('k_flavor')}}</dt>
                <dd>{{flavorLabel}}</dd>
                <button class="edit" @click="go(3)" :aria-label="tr('edit_x',{x:isSignature?tr('k_signature'):tr('k_flavor')})"><svg class="ic"><use href="#i-edit"/></svg></button>
              </div>
              <div class="line line--feel">
                <dt>{{tr('k_feel')}}</dt>
                <dd>
                  <span class="mini" v-for="d in dials" :key="d.field" :class="'tone-'+d.tone">
                    <span class="mini__k">{{d.name}}</span>
                    <span class="mini__bar"><i v-for="n in 10" :key="n" :class="{on:n<=d.val}"></i></span>
                    <span class="mini__v">{{d.val}}</span>
                  </span>
                </dd>
                <button class="edit" @click="go(4)" :aria-label="tr('edit_x',{x:tr('k_feel')})"><svg class="ic"><use href="#i-edit"/></svg></button>
              </div>
              <div class="line" v-if="order.addons.length||order.otherAddon.trim()">
                <dt>{{tr('k_extras')}}</dt>
                <dd>
                  <span class="xline" v-for="a in order.addons" :key="a.name"><span>{{locale==='en'?a.name:addonText(a.name)}}</span><span class="num">+{{formatPrice(a.price)}}</span></span>
                  <span class="xline" v-if="order.otherAddon.trim()"><span>{{order.otherAddon}}</span><span class="num">{{tr('custom')}}</span></span>
                </dd>
                <button class="edit" @click="go(6)" :aria-label="tr('edit_x',{x:tr('k_extras')})"><svg class="ic"><use href="#i-edit"/></svg></button>
              </div>
            </dl>

            <div class="total">
              <span>{{tr('total')}}</span>
              <span class="total__n"><b>{{formatPrice(totalPrice)}}</b> VND</span>
            </div>
            <p class="fine">{{tr('vatSentence')}}</p>
          </div>
        </article>
        <div class="alert" role="alert" v-if="sendMessage"><svg class="ic"><use href="#i-alert"/></svg><span>{{trMsg(sendMessage)}}</span></div>
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
              <span class="stub__k">{{tr('ref')}}</span>
              <span class="stub__ref">{{refShown}}</span>
            </div>
            <button class="stub__copy" @click="copy(refShown,'ref')" :aria-label="tr('copy_ref_aria',{ref:refShown})"><svg class="ic"><use :href="copied==='ref'?'#i-check':'#i-copy'"/></svg><span>{{copied==='ref'?tr('copied'):tr('copy')}}</span></button>
          </div>

          <section class="more" aria-labelledby="more-h">
            <h2 id="more-h" class="h2 h2--flush">{{tr('more_h')}}</h2>
            <p class="sub sub--tight">{{tr('more_sub')}}</p>
            <button class="btn btn--gold btn--block" @click="startMoreOrder">{{tr('btn_drinks')}}<svg class="ic"><use href="#i-arrow"/></svg></button>
            <button class="btn btn--line btn--block" @click="startMoreShisha">{{tr('btn_another')}}</button>
            <button class="btn btn--ghost btn--block" @click="go(0)">{{tr('btn_browse')}}</button>
          </section>
          <button class="link link--center link--dim" @click="finish">{{tr('btn_done')}}</button>
        </div>
      </section>

      <!-- 9. Drinks (independent of shisha) -->
      <section v-else-if="step===9" class="scr scr--drinks" :key="'drinks'">
        <header class="dhead">
          <div class="dhead__photo" :style="{backgroundImage:'url('+L.drinkPhoto+')',backgroundPosition:L.drinkPos}"></div>
          <div class="dhead__shade"></div>
          <div class="dhead__in">
            <h1 class="h1 h1--l" tabindex="-1" data-focus>{{tr('drinks_h')}}</h1>
            <p class="sub sub--tight">{{shishaSent?tr('drinks_already'):''}}{{tr('vat')}}</p>
            <p class="fine dhead__ref" v-if="moreCategories.some(c=>c.items.some(i=>i.img))">{{tr('pic_ref')}}</p>
          </div>
        </header>
        <div class="cats">
          <div v-for="(cat,ci) in moreCategories" :key="cat.label+cat.name" class="cat" :class="{open:openCat===ci}">
            <h2 class="cat__h">
              <button :id="'cathead-'+ci" class="cat__btn" @click="toggleCat(ci)" :aria-expanded="openCat===ci" :aria-controls="'cat-'+ci">
                <span class="cat__title">{{catTitle(cat)}}</span>
                <span class="cat__meta">{{tr('from_p',{p:formatPrice(catFrom(cat))})}}</span>
                <svg class="ic cat__chev"><use href="#i-down"/></svg>
              </button>
            </h2>
            <div class="cat__body" :id="'cat-'+ci" role="region" :aria-labelledby="'cathead-'+ci" :inert="openCat!==ci">
              <div class="cat__in">
                <div class="item" v-for="it in cat.items" :key="it.name" :class="{has:itemQty(it.name),'item--img':it.img}">
                  <img v-if="it.img" class="item__img" :src="it.img" :style="it.imgPos?{objectPosition:it.imgPos}:null" alt="" width="84" height="84" loading="lazy" decoding="async">
                  <div class="item__txt">
                    <span class="item__name">{{it.name}}</span>
                    <span class="item__note" v-if="it.note">{{it.note}}</span>
                    <span class="item__price num">{{formatPrice(it.price)}}</span>
                  </div>
                  <div class="qty" v-if="itemQty(it.name)">
                    <button @click="changeQty(it,-1)" :aria-label="tr('remove_one',{x:it.name})"><svg class="ic"><use href="#i-minus"/></svg></button>
                    <span class="qty__n" aria-live="polite">{{itemQty(it.name)}}</span>
                    <button @click="changeQty(it,1)" :aria-label="tr('add_one',{x:it.name})"><svg class="ic"><use href="#i-plus"/></svg></button>
                  </div>
                  <button v-else class="add" @click="addMoreItem(it)" :aria-label="tr('add_x',{x:it.name})"><svg class="ic"><use href="#i-plus"/></svg></button>
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
            <h1 class="card__title" tabindex="-1" data-focus>{{tr('round_h')}}</h1>
            <p class="card__on">{{tr('round_on',{n:order.table})}}</p>
            <ul class="round">
              <li v-for="it in basket" :key="it.name">
                <div class="round__t"><span class="round__name">{{it.name}}</span><span class="round__sum num">{{formatPrice(it.price*it.qty)}}</span></div>
                <div class="qty qty--s">
                  <button @click="changeQty(it,-1)" :aria-label="tr('remove_one',{x:it.name})"><svg class="ic"><use href="#i-minus"/></svg></button>
                  <span class="qty__n">{{it.qty}}</span>
                  <button @click="changeQty(it,1)" :aria-label="tr('add_one',{x:it.name})"><svg class="ic"><use href="#i-plus"/></svg></button>
                </div>
              </li>
              <li v-if="!basket.length" class="round__empty">{{tr('empty')}} <button class="link link--inline" @click="go(9)">{{tr('choose_drinks')}}</button></li>
            </ul>
            <div class="total"><span>{{tr('subtotal')}}</span><span class="total__n"><b>{{formatPrice(basketTotal)}}</b> VND</span></div>
            <p class="fine">{{tr('min_drink')}}<br>{{tr('vatSentence')}}</p>
          </div>
        </article>
        <div class="alert" role="alert" v-if="sendMessage"><svg class="ic"><use href="#i-alert"/></svg><span>{{trMsg(sendMessage)}}</span></div>
        <button class="link link--center" @click="go(9)">{{tr('add_more')}}</button>
      </section>
    </main>

    <!-- ===== Dock: one place for the primary action ===== -->
    <footer class="dock" v-if="dock.show">
      <button class="dock__sum" v-if="dock.summary" @click="sheet='order'" :aria-label="tr('sofar_aria',{s:dock.summary})">
        <span class="dock__txt">{{dock.text}}</span>
        <span class="dock__price num" v-if="dock.price"><b>{{formatPrice(dock.price)}}</b> VND</span>
        <svg class="ic"><use href="#i-up"/></svg>
      </button>
      <p class="dock__note" v-else-if="dock.note">{{dock.note}}</p>
      <div class="dock__row">
        <button class="dock__back" v-if="dock.back" @click="back" :aria-label="tr('back')"><svg class="ic"><use href="#i-left"/></svg></button>
        <p class="dock__hint" v-if="dock.hint">{{dock.hint}}</p>
        <button v-else class="btn btn--gold btn--grow" :class="{busy:sending}" :disabled="dock.disabled" :aria-busy="sending" @click="dockAct">
          <span>{{sending?tr('sending'):dock.label}}</span><svg class="ic" v-if="!sending&&!dock.disabled"><use href="#i-arrow"/></svg>
        </button>
      </div>
    </footer>

    <!-- ===== Sheets ===== -->
    <div class="scrim" v-if="sheet" @click="sheet=''"></div>
    <section class="sheet" :class="{open:sheet}" role="dialog" aria-modal="true" :aria-label="sheet==='order'?tr('sheet_order'):sheet==='lang'?tr('language'):tr('sheet_info')" :inert="!sheet">
      <div class="sheet__grab"><button @click="sheet=''" :aria-label="tr('close')"><svg class="ic"><use href="#i-close"/></svg></button></div>

      <div v-if="sheet==='order'" class="sheet__in">
        <template v-if="inShishaFlow">
          <h2 class="sheet__h">{{tr('sofar_h')}}</h2>
          <ul class="rows">
            <li v-for="r in orderRows" :key="r.k">
              <span class="rows__k">{{r.k}}</span><span class="rows__v">{{r.v}}</span>
              <button class="edit edit--txt" @click="go(r.step)" :aria-label="tr('change_x',{x:r.k})">{{tr('change')}}</button>
            </li>
          </ul>
          <div class="total"><span>{{tr('total')}}</span><span class="total__n"><b>{{formatPrice(totalPrice)}}</b> VND</span></div>
          <p class="fine">{{tr('vatSentence')}}</p>
        </template>
        <template v-else>
          <h2 class="sheet__h">{{tr('round_h')}}</h2>
          <ul class="round">
            <li v-for="it in basket" :key="it.name">
              <div class="round__t"><span class="round__name">{{it.name}}</span><span class="round__sum num">{{formatPrice(it.price*it.qty)}}</span></div>
              <div class="qty qty--s"><button @click="changeQty(it,-1)" :aria-label="tr('remove_one',{x:it.name})"><svg class="ic"><use href="#i-minus"/></svg></button><span class="qty__n">{{it.qty}}</span><button @click="changeQty(it,1)" :aria-label="tr('add_one',{x:it.name})"><svg class="ic"><use href="#i-plus"/></svg></button></div>
            </li>
            <li v-if="!basket.length" class="round__empty">{{tr('empty')}}</li>
          </ul>
          <div class="total"><span>{{tr('subtotal')}}</span><span class="total__n"><b>{{formatPrice(basketTotal)}}</b> VND</span></div>
          <p class="fine">{{tr('vatSentence')}}</p>
        </template>
      </div>

      <div v-if="sheet==='lounge'" class="sheet__in">
        <h2 class="sheet__h">Hansum {{L.name}}</h2>
        <p class="sheet__sub">{{tr('tableN',{n:order.table||'–'})}}<template v-if="tableLocked">{{tr('from_qr')}}</template></p>
        <div class="wifi">
          <div><span class="wifi__k">{{tr('wifi')}}</span><span class="wifi__v">{{L.wifi.ssid}}</span></div>
          <div><span class="wifi__k">{{tr('password')}}</span><span class="wifi__v">{{L.wifi.pass}}</span></div>
          <button class="btn btn--line btn--sm" @click="copy(L.wifi.pass,'wifi')"><svg class="ic"><use :href="copied==='wifi'?'#i-check':'#i-copy'"/></svg>{{copied==='wifi'?tr('copied'):tr('copy_pw')}}</button>
        </div>
        <button class="lang-row" @click="sheet='lang'"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3z"/></svg><span class="lang-row__k">{{tr('language')}}</span><span class="lang-row__v" :lang="langNow.html">{{langNow.label}}</span><svg class="ic" aria-hidden="true"><use href="#i-right"/></svg></button>
        <div class="links">
          <a :href="L.ig" target="_blank" rel="noopener"><img :src="L.qrIg" alt="" width="52" height="52"><span>Instagram<small>{{L.handle}}</small></span><svg class="ic"><use href="#i-out"/></svg></a>
          <a :href="L.map" target="_blank" rel="noopener"><img :src="L.qrMap" alt="" width="52" height="52"><span>Google Maps<small>{{L.city}}</small></span><svg class="ic"><use href="#i-out"/></svg></a>
          <a href="https://hansumshisha.com/" target="_blank" rel="noopener"><span class="links__web">hansumshisha.com</span><svg class="ic"><use href="#i-out"/></svg></a>
        </div>
      </div>

      <div v-if="sheet==='lang'" class="sheet__in">
        <h2 class="sheet__h">{{tr('language')}}</h2>
        <div class="langs" role="radiogroup" :aria-label="tr('language')">
          <button v-for="lg in LANGS" :key="lg.code" class="langs__opt" :class="{on:locale===lg.code}" role="radio" :aria-checked="locale===lg.code" :lang="lg.html" @click="pickLang(lg.code)">
            <span>{{lg.label}}</span><svg class="ic" aria-hidden="true" v-if="locale===lg.code"><use href="#i-check"/></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ===== Confirm: sending moment ===== -->
    <div class="sending" v-if="sending" role="alertdialog" aria-live="assertive" :aria-label="tr('sending_aria')">
      <div class="sending__in">
        <p class="sending__k">{{tr('sending_k')}}</p>
        <p class="sending__t">{{sendingLine}}</p>
        <div class="sending__bar"><i></i></div>
        <p class="sending__s">{{tr('sending_s')}}</p>
      </div>
    </div>

    <div class="toast" v-if="toast" role="status">{{trMsg(toast)}}</div>
  </div>
`, mixin: mixin };
})();
