/* HANSUM ORDER — customer-facing wording in every language (shared by hansum.html and hansum-saigon.html).
   ---------------------------------------------------------------------------------------------------------
   Display text ONLY. Nothing here is sent to the team: the order payload keeps its production values
   (shishaType, bowl, flavorType, numbers, add-on names…) exactly as before, in English.

   Rules for translators
   - Keep product / brand / blend names as they are: Blonde Leaf, Dark Leaf, Fruit Head, Hansum Signature,
     Hansum Omakase, Egyptian / Phunnel, Double Apple, Love 66, Ladykiller, drink names, tobacco brands.
   - {name} placeholders are filled in by js/order-ui.js. Keep them, move them freely inside the sentence.
   - Plurals: key_one / key_few / key_many / key_other (Intl.PluralRules categories; ru uses few + many).
   - A missing key falls back to English, so a gap never shows a raw key to a guest.

   Language order = order of the language menu. `html` = value for <html lang>. */
window.HANSUM_I18N = {
  langs: [
    { code: 'en', label: 'English', short: 'EN', html: 'en' },
    { code: 'ko', label: '한국어', short: 'KO', html: 'ko' },
    { code: 'vi', label: 'Tiếng Việt', short: 'VI', html: 'vi' },
    { code: 'ru', label: 'Русский', short: 'RU', html: 'ru' },
    { code: 'zh', label: '中文', short: '中', html: 'zh-Hant' }
  ],

  en: {
    skip: 'Skip to main content', language: 'Language',
    tableN: 'Table {n}', noTable: 'No table chosen yet', tableChipAria: '{table}, Hansum {name}', tableInfoAria: 'Open table info: Wi-Fi and links',
    stepOf: '{i} of {n}',
    step_leaf: 'Leaf', step_bowl: 'Bowl', step_flavor: 'Flavor', step_feel: 'Feel', step_extras: 'Extras', step_review: 'Your order', step_drinks: 'Drinks', step_round: 'Your round', step_signature: 'Signature',

    tbl_h: 'Where are you sitting?', tbl_sub: 'Pick your table number so the team knows where to bring your order.', tbl_grid: 'Table number', tbl_confirm: 'This is table {n}', tbl_choose: 'Choose a table',

    wel_photo: 'Guest exhaling smoke under pink neon at Hansum', wel_where: 'Hansum {name}, table {n}', wel_h1a: 'Take a', wel_h1b: 'breath.',
    wel_lede: 'Shisha, cocktails and coffee, ordered from your table.', wel_sentAria: 'Orders sent from this table', wel_sent: 'Sent from your table',
    wel_start: 'Start with shisha', wel_another: 'Order another shisha', wel_drinks: 'Order drinks', wel_justDrinks: 'Just drinks', wel_links: 'Wi-Fi, Instagram and map',
    kind_Shisha: 'Shisha', 'kind_Additional shisha': 'Additional shisha', kind_Drinks: 'Drinks',

    leaf_h: 'Choose your leaf', mode_aria: 'Session type', mode_new: 'New session', mode_refill: 'Refill', refill_sub: 'Continue your session with fresh tobacco.', shisha_aria: 'Shisha options',
    tier_Refill: 'Refill', refill_of: '{leaf} refill',
    note_fruit: 'Dragon Fruit · Pineapple · Apple etc.', note_sig: '8 exclusive house blends',
    int_upto: 'Intensity up to {n}', int_upto_aria: 'Intensity up to {n} out of 10',
    path_fruit: 'Served in fresh fruit. No bowl to choose.', path_refill: 'Straight to flavor.', path_sig: 'House-crafted flavor combinations.',

    bowl_h: 'Which bowl?', bowl_sub: 'Different style, different experience.', bowl_aria: 'Bowl style', bowl_line_egy: 'Classic · Smooth', bowl_line_phu: 'Rich · Smoky',

    sig_h: 'Choose your signature', sig_sub: 'Eight house blends, one price. Tap to continue.', sig_aria: 'Hansum Signature blends',
    'sig_jade-bean_d': 'Green Bean · Coconut · Vanilla', 'sig_jade-bean_t': 'Creamy, nutty and softly sweet',
    'sig_tropical-bazaar_d': 'Mango · Passion Fruit · Pineapple', 'sig_tropical-bazaar_t': 'Juicy, bright and tropical',
    'sig_golden-citrus_d': 'Orange · Lemon', 'sig_golden-citrus_t': 'Fresh, zesty and uplifting',
    'sig_silk-rose_d': 'Rose · Lychee', 'sig_silk-rose_t': 'Floral, elegant and lightly sweet',
    'sig_jasmine-honey-garden_d': 'Jasmine Tea · Pear · Honey', 'sig_jasmine-honey-garden_t': 'Delicate, fragrant and mellow',
    'sig_saigon-velvet_d': 'Coffee · Coconut · Vanilla · Caramel', 'sig_saigon-velvet_t': 'Rich, creamy and dessert-like',
    'sig_mango-moon_d': 'Mango Sticky Rice', 'sig_mango-moon_t': 'Creamy mango with a soft finish',
    'sig_black-temple_d': 'Sandalwood · Vanilla · Black Tea', 'sig_black-temple_t': 'Deep, woody and sophisticated',

    fl_h: 'What do you feel like?', fl_sub: 'Blend up to three, or leave it to us.', blend_aria: 'Your flavor blend',
    remove_x: 'Remove {x}', clear_x: 'Clear {x}', slot_1: 'First', slot_2: 'Second', slot_3: 'Third',
    fl_dirs: 'Directions', fl_dirs_aria: 'Flavor directions',
    flavor_FRUITY: 'Fruity', flavor_CITRUS: 'Citrus', flavor_CREAMY: 'Creamy', flavor_FLORAL: 'Floral', flavor_TEA: 'Tea', flavor_WOOD: 'Wood', flavor_MINT: 'Mint',
    dir_FRUITY: 'Sweet and easy to enjoy.', dir_CITRUS: 'Bright and zesty.', dir_CREAMY: 'Smooth and dessert-like.', dir_FLORAL: 'Light and elegant.', dir_TEA: 'Aromatic and layered.', dir_WOOD: 'Deep and aromatic.',
    house_h: 'House signatures', house_small: 'Pick one instead', note_house: 'House signature',
    leave_h: 'Or leave it to us', leave_aria: 'Chef’s choice or your own', omakase_desc: 'Let our shisha chef decide.', note_chef: 'Chef’s choice',
    other: 'Something else', other_desc: 'Tell us what you have in mind.', other_ph: 'Tell us your preferred flavor…', other_aria: 'Preferred flavor',
    your_own: 'Your own', note_words: 'In your words', n_flavors_one: '{n} flavor', n_flavors_other: '{n} flavors', custom_flavor: 'Custom flavor',

    feel_h: 'How should it feel?', d_int: 'Intensity', d_cool: 'Cool', d_mint: 'Mint', dial_valuetext: '{v} of {max}, {band}',
    band_none: 'None', int_light: 'Light', int_balanced: 'Balanced', int_strong: 'Strong',
    cool_soft: 'Soft', cool_medium: 'Medium', cool_icy: 'Icy', cool_extreme: 'Extreme icy',
    mint_soft: 'Soft', mint_medium: 'Medium', mint_strong: 'Strong', mint_extreme: 'Extreme strong',
    fs_barely: 'Barely any draw', fs_int_light: 'Light', fs_int_balanced: 'Balanced', fs_int_strong: 'Strong',
    fs_cool_soft: 'a soft chill', fs_cool_medium: 'a medium chill', fs_cool_icy: 'an icy chill', fs_cool_extreme: 'an extreme icy chill',
    fs_mint_soft: 'a touch of mint', fs_mint_medium: 'medium mint', fs_mint_strong: 'strong mint', fs_mint_extreme: 'extreme mint',
    fs_with: '{base}, with {list}.', fs_and: ' and ', fs_nocool: '{base}, no cooling.',
    cap_a: 'Maximum intensity is 5. For stronger intensity, please select ', cap_b: '.',

    ex_h: 'Make it yours', ex_sub: 'Optional. Skip if you are happy as it is.', ex_aria: 'Add-ons',
    'addon_Ice Hose Cooling': 'Ice hose cooling', 'addon_Tea Base': 'Tea base', 'addon_Milk Base': 'Milk base', 'addon_Liquor Base (2 shots)': 'Liquor base', 'addon_Coffee Base': 'Coffee base',
    'addon_note_2 shots': '2 shots', ex_other: 'Something else', ex_custom: 'Custom request', ex_ph: 'Please specify…', ex_other_aria: 'Other add-on', ex_adds: 'Extras add {p} VND. ',
    vatSentence: 'Prices are exclusive of 8/10% VAT.', vat: 'Prices in VND. 8/10% VAT not included.',

    rv_h: 'Your Hansum', rv_on_a: '{shisha} on a {bowl}', rv_on_an: '{shisha} on an {bowl}', rv_fruit: 'Fruit Head, served in fresh fruit',
    k_shisha: 'Shisha', k_bowl: 'Bowl', k_flavor: 'Flavor', k_signature: 'Signature', k_feel: 'Feel', k_extras: 'Extras',
    edit_x: 'Edit {x}', change: 'Change', change_x: 'Change {x}', custom: 'Custom', total: 'Total', not_chosen: 'Not chosen yet', none: 'None',

    sent_title: 'Your order has been sent.', sent_title_more: 'Your additional order has been sent.',
    sent_text: 'Your shisha order for table {n} has been sent to our team.', sent_text_more: 'Your additional order for table {n} has been sent to our team.',
    ref: 'Order reference', copy: 'Copy', copied: 'Copied', copy_ref_aria: 'Copy order reference {ref}',
    more_h: 'The menu is still open.', more_sub: 'Order more shisha or drinks whenever you like. Each new order is sent separately.',
    btn_drinks: 'Order drinks', btn_another: 'Another shisha', btn_browse: 'Keep browsing', btn_done: 'I’m done for tonight',

    drinks_h: 'Drinks', drinks_already: 'Your shisha order has already been sent. ', pic_ref: 'Picture just for reference', from_p: 'from {p}',
    remove_one: 'Remove one {x}', add_one: 'Add one more {x}', add_x: 'Add {x}',
    round_h: 'Your round', round_on: 'Table {n}. Sent as its own order, separate from your shisha.', empty: 'Nothing here yet.', choose_drinks: 'Choose drinks',
    subtotal: 'Subtotal', min_drink: 'Drinks per person: 1 drink minimum.', add_more: 'Add more drinks',
    cat_SIGNATURE_Cocktails: 'Signature cocktails', cat_CLASSIC_Cocktails: 'Classic cocktails', 'cat_Frozen Series': 'Frozen Series', 'cat_-86°C Frozen Coffee': '-86°C Frozen Coffee',
    cat_Coffee: 'Coffee', cat_Tea: 'Tea', cat_Shooters: 'Shooters', 'cat_Mocktails & Soft Drinks': 'Mocktails & Soft Drinks', 'cat_Mocktails · Soft Drinks · Water': 'Mocktails · Soft Drinks · Water',
    'cat_Beer · Soju · Wine': 'Beer · Soju · Wine', 'cat_Wine · Beer · Soju': 'Wine · Beer · Soju', 'cat_Bottle Service': 'Bottle Service',

    sofar_aria: 'Order so far: {s}. Open details', back: 'Back', sending: 'Sending…',
    hint_leaf: 'Tap a leaf to continue', hint_bowl: 'Tap a bowl to continue', hint_sig: 'Tap a blend to continue',
    cont_with: 'Continue with {x}', 'continue': 'Continue', review_order: 'Review order', skip_review: 'Skip and review', confirm_send: 'Confirm and send',
    note_team: 'Goes straight to our team at table {n}.', note_separate: 'Sent as a separate order to table {n}.',
    items_one: '{n} item', items_other: '{n} items', review_round: 'Review your round', choose_something: 'Choose something',

    sheet_order: 'Order so far', sheet_info: 'Table information', close: 'Close', sofar_h: 'Your order so far', from_qr: ' · from your table’s QR',
    wifi: 'Wi-Fi', password: 'Password', copy_pw: 'Copy password',
    sending_aria: 'Sending your order', sending_k: 'Sending to our team', sending_s: 'Keep this screen open for a moment.',

    msg_blend3: 'You can blend up to three. Tap one to swap it out.',
    err_item: 'This item is no longer available. Please refresh the menu.',
    err_table: 'This table could not be found. Please ask our staff for help.',
    err_pos: 'We could not send the order. Please ask our staff for help.',
    err_send: 'We could not send the order to our team. Please try again. Your selection is saved on this device.',
    err_send_more: 'We could not send the additional order to our team. Please try again. Your items are saved on this device.'
  },

  ko: {
    skip: '본문으로 바로가기', language: '언어',
    tableN: '테이블 {n}', noTable: '아직 테이블을 선택하지 않았어요', tableChipAria: '{table}, Hansum {name}', tableInfoAria: '테이블 정보 열기: 와이파이와 링크',
    stepOf: '{i} / {n}',
    step_leaf: '타바코', step_bowl: '보울', step_flavor: '맛', step_feel: '강도', step_extras: '추가', step_review: '주문 확인', step_drinks: '음료', step_round: '음료 주문', step_signature: '시그니처',

    tbl_h: '어느 테이블에 앉아 계세요?', tbl_sub: '테이블 번호를 선택하면 주문을 바로 가져다드려요.', tbl_grid: '테이블 번호', tbl_confirm: '{n}번 테이블이에요', tbl_choose: '테이블을 선택해 주세요',

    wel_photo: 'Hansum의 핑크 네온 아래에서 연기를 내뿜는 손님', wel_where: 'Hansum {name} · {n}번 테이블', wel_h1a: '잠시', wel_h1b: '쉬어 가세요.',
    wel_lede: '시샤, 칵테일, 커피를 테이블에서 바로 주문하세요.', wel_sentAria: '이 테이블에서 보낸 주문', wel_sent: '이 테이블에서 보낸 주문',
    wel_start: '시샤 주문하기', wel_another: '시샤 하나 더 주문하기', wel_drinks: '음료 주문하기', wel_justDrinks: '음료만 주문하기', wel_links: '와이파이 · 인스타그램 · 지도',
    kind_Shisha: '시샤', 'kind_Additional shisha': '추가 시샤', kind_Drinks: '음료',

    leaf_h: '타바코를 골라 주세요', mode_aria: '세션 종류', mode_new: '새 세션', mode_refill: '리필', refill_sub: '새 타바코로 세션을 이어가요.', shisha_aria: '시샤 옵션',
    tier_Refill: '리필', refill_of: '{leaf} 리필',
    note_fruit: '용과 · 파인애플 · 사과 등', note_sig: '하우스 블렌드 8종',
    int_upto: '강도 최대 {n}', int_upto_aria: '강도 최대 {n} (10단계 중)',
    path_fruit: '생과일에 담아 드려요. 보울은 고르지 않아도 돼요.', path_refill: '바로 맛 선택으로 넘어가요.', path_sig: 'Hansum이 직접 만든 플레이버 조합.',

    bowl_h: '보울을 골라 주세요', bowl_sub: '스타일이 다르면 경험도 달라져요.', bowl_aria: '보울 스타일', bowl_line_egy: '클래식 · 부드러움', bowl_line_phu: '진하고 · 연기 풍부',

    sig_h: '시그니처를 골라 주세요', sig_sub: '하우스 블렌드 8종, 가격은 모두 같아요. 누르면 다음으로 넘어가요.', sig_aria: 'Hansum 시그니처 블렌드',
    'sig_jade-bean_d': '녹두 · 코코넛 · 바닐라', 'sig_jade-bean_t': '크리미하고 고소하며 은은하게 달콤해요',
    'sig_tropical-bazaar_d': '망고 · 패션프루트 · 파인애플', 'sig_tropical-bazaar_t': '과즙 가득, 상큼한 트로피컬',
    'sig_golden-citrus_d': '오렌지 · 레몬', 'sig_golden-citrus_t': '상큼하고 기분 좋은 시트러스',
    'sig_silk-rose_d': '장미 · 리치', 'sig_silk-rose_t': '플로럴하고 우아하며 살짝 달콤해요',
    'sig_jasmine-honey-garden_d': '자스민차 · 배 · 꿀', 'sig_jasmine-honey-garden_t': '섬세하고 향긋하며 부드러워요',
    'sig_saigon-velvet_d': '커피 · 코코넛 · 바닐라 · 캐러멜', 'sig_saigon-velvet_t': '진하고 크리미한 디저트 느낌',
    'sig_mango-moon_d': '망고 찹쌀밥', 'sig_mango-moon_t': '크리미한 망고, 부드러운 마무리',
    'sig_black-temple_d': '샌달우드 · 바닐라 · 홍차', 'sig_black-temple_t': '깊고 우디하며 세련된 맛',

    fl_h: '어떤 맛이 끌리세요?', fl_sub: '최대 3가지까지 섞거나, 저희에게 맡겨 주세요.', blend_aria: '나의 플레이버 블렌드',
    remove_x: '{x} 빼기', clear_x: '{x} 지우기', slot_1: '첫 번째', slot_2: '두 번째', slot_3: '세 번째',
    fl_dirs: '맛 계열', fl_dirs_aria: '맛 계열',
    flavor_FRUITY: '과일', flavor_CITRUS: '시트러스', flavor_CREAMY: '크리미', flavor_FLORAL: '플로럴', flavor_TEA: '티', flavor_WOOD: '우디', flavor_MINT: '민트',
    dir_FRUITY: '달콤하고 누구나 즐기기 좋아요.', dir_CITRUS: '산뜻하고 상큼해요.', dir_CREAMY: '부드러운 디저트 같은 맛.', dir_FLORAL: '가볍고 우아해요.', dir_TEA: '향이 풍부하고 깊어요.', dir_WOOD: '깊고 향긋해요.',
    house_h: '하우스 시그니처', house_small: '대신 하나만 고르기', note_house: '하우스 시그니처',
    leave_h: '또는 저희에게 맡겨 주세요', leave_aria: '셰프 추천 또는 직접 입력', omakase_desc: '시샤 셰프가 알아서 골라 드려요.', note_chef: '셰프 추천',
    other: '다른 맛', other_desc: '원하는 맛을 알려 주세요.', other_ph: '원하는 맛을 적어 주세요…', other_aria: '원하는 맛',
    your_own: '직접 입력', note_words: '직접 적은 맛', n_flavors_other: '{n}가지 맛', custom_flavor: '직접 고른 맛',

    feel_h: '어떤 느낌으로 드릴까요?', d_int: '강도', d_cool: '쿨링', d_mint: '민트', dial_valuetext: '{max} 중 {v}, {band}',
    band_none: '없음', int_light: '가볍게', int_balanced: '적당히', int_strong: '강하게',
    cool_soft: '살짝', cool_medium: '보통', cool_icy: '시원하게', cool_extreme: '아주 시원하게',
    mint_soft: '살짝', mint_medium: '보통', mint_strong: '강하게', mint_extreme: '아주 강하게',
    fs_barely: '거의 느껴지지 않게', fs_int_light: '가벼운 강도', fs_int_balanced: '적당한 강도', fs_int_strong: '강한 강도',
    fs_cool_soft: '살짝 시원하게', fs_cool_medium: '적당히 시원하게', fs_cool_icy: '시원하게', fs_cool_extreme: '아주 시원하게',
    fs_mint_soft: '민트 살짝', fs_mint_medium: '민트 보통', fs_mint_strong: '민트 강하게', fs_mint_extreme: '민트 아주 강하게',
    fs_with: '{base}, {list}.', fs_and: ', ', fs_nocool: '{base}, 쿨링 없이.',
    cap_a: '강도는 최대 5까지예요. 더 강하게 원하시면 ', cap_b: '를 선택해 주세요.',

    ex_h: '나만의 스타일로', ex_sub: '선택 사항이에요. 지금 그대로 좋으면 건너뛰세요.', ex_aria: '추가 옵션',
    'addon_Ice Hose Cooling': '아이스 호스', 'addon_Tea Base': '티 베이스', 'addon_Milk Base': '밀크 베이스', 'addon_Liquor Base (2 shots)': '리큐어 베이스', 'addon_Coffee Base': '커피 베이스',
    'addon_note_2 shots': '2샷', ex_other: '다른 요청', ex_custom: '요청 사항 입력', ex_ph: '내용을 적어 주세요…', ex_other_aria: '다른 추가 요청', ex_adds: '추가 옵션 {p} VND. ',
    vatSentence: '가격에는 8/10% VAT가 포함되어 있지 않습니다.', vat: '가격 단위 VND · 8/10% VAT 별도.',

    rv_h: '나의 Hansum', rv_on_a: '{shisha} · {bowl}', rv_on_an: '{shisha} · {bowl}', rv_fruit: 'Fruit Head, 생과일에 담아 드려요',
    k_shisha: '시샤', k_bowl: '보울', k_flavor: '맛', k_signature: '시그니처', k_feel: '강도', k_extras: '추가',
    edit_x: '{x} 수정', change: '변경', change_x: '{x} 변경', custom: '요청', total: '합계', not_chosen: '아직 선택하지 않았어요', none: '없음',

    sent_title: '주문이 전달되었어요.', sent_title_more: '추가 주문이 전달되었어요.',
    sent_text: '{n}번 테이블의 시샤 주문이 저희 팀에 전달되었어요.', sent_text_more: '{n}번 테이블의 추가 주문이 저희 팀에 전달되었어요.',
    ref: '주문 번호', copy: '복사', copied: '복사됨', copy_ref_aria: '주문 번호 {ref} 복사',
    more_h: '메뉴는 계속 열려 있어요.', more_sub: '시샤나 음료를 언제든 더 주문하세요. 새 주문은 따로 전달돼요.',
    btn_drinks: '음료 주문하기', btn_another: '시샤 하나 더', btn_browse: '계속 둘러보기', btn_done: '오늘은 여기까지',

    drinks_h: '음료', drinks_already: '시샤 주문은 이미 전달되었어요. ', pic_ref: '사진은 참고용이에요', from_p: '{p}부터',
    remove_one: '{x} 하나 빼기', add_one: '{x} 하나 더', add_x: '{x} 추가',
    round_h: '음료 주문', round_on: '{n}번 테이블 · 시샤와 별도의 주문으로 전달돼요.', empty: '아직 담은 음료가 없어요.', choose_drinks: '음료 고르기',
    subtotal: '소계', min_drink: '1인 1음료 이상 주문해 주세요.', add_more: '음료 더 담기',
    cat_SIGNATURE_Cocktails: '시그니처 칵테일', cat_CLASSIC_Cocktails: '클래식 칵테일', 'cat_Frozen Series': '프로즌 시리즈', 'cat_-86°C Frozen Coffee': '-86°C 프로즌 커피',
    cat_Coffee: '커피', cat_Tea: '차', cat_Shooters: '샷', 'cat_Mocktails & Soft Drinks': '목테일 & 소프트드링크', 'cat_Mocktails · Soft Drinks · Water': '목테일 · 소프트드링크 · 물',
    'cat_Beer · Soju · Wine': '맥주 · 소주 · 와인', 'cat_Wine · Beer · Soju': '와인 · 맥주 · 소주', 'cat_Bottle Service': '보틀 서비스',

    sofar_aria: '지금까지 주문: {s}. 자세히 보기', back: '뒤로', sending: '보내는 중…',
    hint_leaf: '타바코를 누르면 다음으로 넘어가요', hint_bowl: '보울을 누르면 다음으로 넘어가요', hint_sig: '블렌드를 누르면 다음으로 넘어가요',
    cont_with: '{x}(으)로 계속', 'continue': '계속', review_order: '주문 확인', skip_review: '건너뛰고 확인', confirm_send: '확인하고 주문하기',
    note_team: '{n}번 테이블 담당 팀에 바로 전달돼요.', note_separate: '{n}번 테이블에 별도 주문으로 전달돼요.',
    items_other: '{n}개', review_round: '음료 주문 확인', choose_something: '음료를 골라 주세요',

    sheet_order: '지금까지 주문', sheet_info: '테이블 정보', close: '닫기', sofar_h: '지금까지 주문', from_qr: ' · 테이블 QR로 접속',
    wifi: '와이파이', password: '비밀번호', copy_pw: '비밀번호 복사',
    sending_aria: '주문을 보내는 중', sending_k: '저희 팀에 보내는 중', sending_s: '잠시만 이 화면을 열어 두세요.',

    msg_blend3: '최대 3가지까지 섞을 수 있어요. 하나를 눌러 바꿔 보세요.',
    err_item: '이 메뉴는 현재 주문할 수 없어요. 메뉴를 새로고침해 주세요.',
    err_table: '테이블을 찾을 수 없어요. 직원에게 문의해 주세요.',
    err_pos: '주문을 보내지 못했어요. 직원에게 문의해 주세요.',
    err_send: '주문을 보내지 못했어요. 다시 시도해 주세요. 선택한 내용은 이 기기에 저장되어 있어요.',
    err_send_more: '추가 주문을 보내지 못했어요. 다시 시도해 주세요. 담은 항목은 이 기기에 저장되어 있어요.'
  },

  vi: {
    skip: 'Đến nội dung chính', language: 'Ngôn ngữ',
    tableN: 'Bàn {n}', noTable: 'Chưa chọn bàn', tableChipAria: '{table}, Hansum {name}', tableInfoAria: 'Mở thông tin bàn: Wi-Fi và liên kết',
    stepOf: '{i}/{n}',
    step_leaf: 'Thuốc', step_bowl: 'Bowl', step_flavor: 'Hương vị', step_feel: 'Cảm giác', step_extras: 'Thêm', step_review: 'Đơn của bạn', step_drinks: 'Đồ uống', step_round: 'Đơn đồ uống', step_signature: 'Signature',

    tbl_h: 'Bạn đang ngồi bàn nào?', tbl_sub: 'Chọn số bàn để nhân viên mang món đến đúng chỗ.', tbl_grid: 'Số bàn', tbl_confirm: 'Đây là bàn {n}', tbl_choose: 'Chọn bàn',

    wel_photo: 'Khách nhả khói dưới ánh đèn neon hồng tại Hansum', wel_where: 'Hansum {name}, bàn {n}', wel_h1a: 'Thả lỏng', wel_h1b: 'một chút.',
    wel_lede: 'Gọi shisha, cocktail và cà phê ngay tại bàn.', wel_sentAria: 'Đơn đã gửi từ bàn này', wel_sent: 'Đã gửi từ bàn của bạn',
    wel_start: 'Gọi shisha', wel_another: 'Gọi thêm shisha', wel_drinks: 'Gọi đồ uống', wel_justDrinks: 'Chỉ gọi đồ uống', wel_links: 'Wi-Fi, Instagram và bản đồ',
    kind_Shisha: 'Shisha', 'kind_Additional shisha': 'Shisha thêm', kind_Drinks: 'Đồ uống',

    leaf_h: 'Chọn loại thuốc', mode_aria: 'Loại phiên', mode_new: 'Phiên mới', mode_refill: 'Thay đầu', refill_sub: 'Tiếp tục phiên của bạn với thuốc mới.', shisha_aria: 'Lựa chọn shisha',
    tier_Refill: 'Thay đầu', refill_of: 'Thay đầu {leaf}',
    note_fruit: 'Thanh long · Dứa · Táo và nhiều loại khác', note_sig: '8 công thức độc quyền của Hansum',
    int_upto: 'Độ mạnh tối đa {n}', int_upto_aria: 'Độ mạnh tối đa {n} trên 10',
    path_fruit: 'Phục vụ trong trái cây tươi. Không cần chọn bowl.', path_refill: 'Chọn hương vị ngay.', path_sig: 'Các phối hương do Hansum sáng tạo.',

    bowl_h: 'Chọn bowl nào?', bowl_sub: 'Mỗi kiểu bowl, một trải nghiệm khác.', bowl_aria: 'Kiểu bowl', bowl_line_egy: 'Cổ điển · Êm', bowl_line_phu: 'Đậm · Nhiều khói',

    sig_h: 'Chọn signature của bạn', sig_sub: '8 công thức, cùng một giá. Chạm để tiếp tục.', sig_aria: 'Các công thức Hansum Signature',
    'sig_jade-bean_d': 'Đậu xanh · Dừa · Vani', 'sig_jade-bean_t': 'Béo, bùi và ngọt nhẹ',
    'sig_tropical-bazaar_d': 'Xoài · Chanh dây · Dứa', 'sig_tropical-bazaar_t': 'Mọng nước, tươi sáng, nhiệt đới',
    'sig_golden-citrus_d': 'Cam · Chanh vàng', 'sig_golden-citrus_t': 'Tươi mát, chua nhẹ, sảng khoái',
    'sig_silk-rose_d': 'Hoa hồng · Vải', 'sig_silk-rose_t': 'Hương hoa thanh lịch, ngọt nhẹ',
    'sig_jasmine-honey-garden_d': 'Trà nhài · Lê · Mật ong', 'sig_jasmine-honey-garden_t': 'Thanh tao, thơm và êm dịu',
    'sig_saigon-velvet_d': 'Cà phê · Dừa · Vani · Caramel', 'sig_saigon-velvet_t': 'Đậm, béo như món tráng miệng',
    'sig_mango-moon_d': 'Xôi xoài', 'sig_mango-moon_t': 'Xoài béo ngậy, hậu vị êm',
    'sig_black-temple_d': 'Gỗ đàn hương · Vani · Trà đen', 'sig_black-temple_t': 'Sâu lắng, hương gỗ, tinh tế',

    fl_h: 'Bạn thích vị gì?', fl_sub: 'Phối tối đa 3 vị, hoặc để chúng tôi chọn.', blend_aria: 'Phối vị của bạn',
    remove_x: 'Bỏ {x}', clear_x: 'Xoá {x}', slot_1: 'Vị 1', slot_2: 'Vị 2', slot_3: 'Vị 3',
    fl_dirs: 'Nhóm vị', fl_dirs_aria: 'Nhóm vị',
    flavor_FRUITY: 'Trái cây', flavor_CITRUS: 'Cam chanh', flavor_CREAMY: 'Béo ngậy', flavor_FLORAL: 'Hương hoa', flavor_TEA: 'Trà', flavor_WOOD: 'Hương gỗ', flavor_MINT: 'Bạc hà',
    dir_FRUITY: 'Ngọt, dễ thưởng thức.', dir_CITRUS: 'Tươi sáng, chua nhẹ.', dir_CREAMY: 'Mượt như món tráng miệng.', dir_FLORAL: 'Nhẹ nhàng, thanh lịch.', dir_TEA: 'Thơm, nhiều tầng hương.', dir_WOOD: 'Sâu lắng, thơm.',
    house_h: 'Vị đặc trưng', house_small: 'Hoặc chọn một vị', note_house: 'Vị đặc trưng',
    leave_h: 'Hoặc để chúng tôi chọn', leave_aria: 'Bếp trưởng chọn hoặc tự ghi', omakase_desc: 'Để chuyên gia shisha chọn giúp bạn.', note_chef: 'Chuyên gia chọn',
    other: 'Vị khác', other_desc: 'Cho chúng tôi biết bạn muốn vị gì.', other_ph: 'Ghi vị bạn thích…', other_aria: 'Vị bạn thích',
    your_own: 'Vị của bạn', note_words: 'Theo ý bạn', n_flavors_other: '{n} vị', custom_flavor: 'Vị theo yêu cầu',

    feel_h: 'Bạn muốn cảm giác thế nào?', d_int: 'Độ mạnh', d_cool: 'Độ mát', d_mint: 'Bạc hà', dial_valuetext: '{v} trên {max}, {band}',
    band_none: 'Không', int_light: 'Nhẹ', int_balanced: 'Vừa', int_strong: 'Mạnh',
    cool_soft: 'Nhẹ', cool_medium: 'Vừa', cool_icy: 'Lạnh', cool_extreme: 'Rất lạnh',
    mint_soft: 'Nhẹ', mint_medium: 'Vừa', mint_strong: 'Đậm', mint_extreme: 'Rất đậm',
    fs_barely: 'Gần như không cảm nhận', fs_int_light: 'Nhẹ', fs_int_balanced: 'Vừa', fs_int_strong: 'Mạnh',
    fs_cool_soft: 'mát nhẹ', fs_cool_medium: 'mát vừa', fs_cool_icy: 'mát lạnh', fs_cool_extreme: 'rất lạnh',
    fs_mint_soft: 'chút bạc hà', fs_mint_medium: 'bạc hà vừa', fs_mint_strong: 'bạc hà đậm', fs_mint_extreme: 'bạc hà rất đậm',
    fs_with: '{base}, {list}.', fs_and: ' và ', fs_nocool: '{base}, không mát.',
    cap_a: 'Độ mạnh tối đa là 5. Muốn mạnh hơn, hãy chọn ', cap_b: '.',

    ex_h: 'Tuỳ chỉnh thêm', ex_sub: 'Không bắt buộc. Bỏ qua nếu bạn đã ưng ý.', ex_aria: 'Tuỳ chọn thêm',
    'addon_Ice Hose Cooling': 'Ống hút làm lạnh', 'addon_Tea Base': 'Bình trà', 'addon_Milk Base': 'Bình sữa', 'addon_Liquor Base (2 shots)': 'Bình rượu', 'addon_Coffee Base': 'Bình cà phê',
    'addon_note_2 shots': '2 shot', ex_other: 'Yêu cầu khác', ex_custom: 'Ghi yêu cầu', ex_ph: 'Vui lòng ghi rõ…', ex_other_aria: 'Yêu cầu thêm khác', ex_adds: 'Tuỳ chọn thêm: {p} VND. ',
    vatSentence: 'Giá chưa bao gồm VAT 8/10%.', vat: 'Giá tính bằng VND, chưa gồm VAT 8/10%.',

    rv_h: 'Hansum của bạn', rv_on_a: '{shisha} · {bowl}', rv_on_an: '{shisha} · {bowl}', rv_fruit: 'Fruit Head, phục vụ trong trái cây tươi',
    k_shisha: 'Shisha', k_bowl: 'Bowl', k_flavor: 'Hương vị', k_signature: 'Signature', k_feel: 'Cảm giác', k_extras: 'Thêm',
    edit_x: 'Sửa {x}', change: 'Đổi', change_x: 'Đổi {x}', custom: 'Yêu cầu', total: 'Tổng', not_chosen: 'Chưa chọn', none: 'Không',

    sent_title: 'Đơn đã được gửi.', sent_title_more: 'Đơn gọi thêm đã được gửi.',
    sent_text: 'Đơn shisha của bàn {n} đã được gửi đến nhân viên.', sent_text_more: 'Đơn gọi thêm của bàn {n} đã được gửi đến nhân viên.',
    ref: 'Mã đơn', copy: 'Sao chép', copied: 'Đã sao chép', copy_ref_aria: 'Sao chép mã đơn {ref}',
    more_h: 'Thực đơn vẫn mở.', more_sub: 'Gọi thêm shisha hoặc đồ uống bất cứ lúc nào. Mỗi lần gọi là một đơn riêng.',
    btn_drinks: 'Gọi đồ uống', btn_another: 'Thêm shisha', btn_browse: 'Tiếp tục xem', btn_done: 'Tối nay vậy là đủ',

    drinks_h: 'Đồ uống', drinks_already: 'Đơn shisha của bạn đã được gửi. ', pic_ref: 'Hình ảnh chỉ mang tính minh hoạ', from_p: 'từ {p}',
    remove_one: 'Bớt một {x}', add_one: 'Thêm một {x}', add_x: 'Thêm {x}',
    round_h: 'Đơn đồ uống', round_on: 'Bàn {n}. Gửi thành đơn riêng, tách với shisha.', empty: 'Chưa có món nào.', choose_drinks: 'Chọn đồ uống',
    subtotal: 'Tạm tính', min_drink: 'Mỗi khách tối thiểu 1 đồ uống.', add_more: 'Thêm đồ uống',
    cat_SIGNATURE_Cocktails: 'Cocktail đặc trưng', cat_CLASSIC_Cocktails: 'Cocktail cổ điển', 'cat_Frozen Series': 'Đồ uống đá xay', 'cat_-86°C Frozen Coffee': 'Cà phê đông lạnh -86°C',
    cat_Coffee: 'Cà phê', cat_Tea: 'Trà', cat_Shooters: 'Shot', 'cat_Mocktails & Soft Drinks': 'Mocktail & nước ngọt', 'cat_Mocktails · Soft Drinks · Water': 'Mocktail · Nước ngọt · Nước suối',
    'cat_Beer · Soju · Wine': 'Bia · Soju · Rượu vang', 'cat_Wine · Beer · Soju': 'Rượu vang · Bia · Soju', 'cat_Bottle Service': 'Rượu nguyên chai',

    sofar_aria: 'Đơn hiện tại: {s}. Xem chi tiết', back: 'Quay lại', sending: 'Đang gửi…',
    hint_leaf: 'Chạm vào loại thuốc để tiếp tục', hint_bowl: 'Chạm vào bowl để tiếp tục', hint_sig: 'Chạm vào công thức để tiếp tục',
    cont_with: 'Tiếp tục với {x}', 'continue': 'Tiếp tục', review_order: 'Xem lại đơn', skip_review: 'Bỏ qua và xem lại', confirm_send: 'Xác nhận và gửi',
    note_team: 'Gửi thẳng đến nhân viên phục vụ bàn {n}.', note_separate: 'Gửi thành đơn riêng cho bàn {n}.',
    items_other: '{n} món', review_round: 'Xem lại đơn đồ uống', choose_something: 'Chọn món',

    sheet_order: 'Đơn hiện tại', sheet_info: 'Thông tin bàn', close: 'Đóng', sofar_h: 'Đơn hiện tại', from_qr: ' · từ mã QR tại bàn',
    wifi: 'Wi-Fi', password: 'Mật khẩu', copy_pw: 'Sao chép mật khẩu',
    sending_aria: 'Đang gửi đơn', sending_k: 'Đang gửi đến nhân viên', sending_s: 'Vui lòng giữ màn hình này trong giây lát.',

    msg_blend3: 'Bạn có thể phối tối đa 3 vị. Chạm vào một vị để đổi.',
    err_item: 'Món này hiện không còn. Vui lòng tải lại thực đơn.',
    err_table: 'Không tìm thấy bàn này. Vui lòng hỏi nhân viên.',
    err_pos: 'Chưa gửi được đơn. Vui lòng hỏi nhân viên.',
    err_send: 'Chưa gửi được đơn đến nhân viên. Vui lòng thử lại. Lựa chọn của bạn vẫn được lưu trên máy.',
    err_send_more: 'Chưa gửi được đơn gọi thêm. Vui lòng thử lại. Các món bạn chọn vẫn được lưu trên máy.'
  },

  ru: {
    skip: 'Перейти к основному содержанию', language: 'Язык',
    tableN: 'Стол {n}', noTable: 'Стол ещё не выбран', tableChipAria: '{table}, Hansum {name}', tableInfoAria: 'Информация о столе: Wi-Fi и ссылки',
    stepOf: '{i} из {n}',
    step_leaf: 'Табак', step_bowl: 'Чаша', step_flavor: 'Вкус', step_feel: 'Крепость', step_extras: 'Добавки', step_review: 'Ваш заказ', step_drinks: 'Напитки', step_round: 'Напитки', step_signature: 'Signature',

    tbl_h: 'За каким вы столом?', tbl_sub: 'Выберите номер стола, чтобы мы знали, куда принести заказ.', tbl_grid: 'Номер стола', tbl_confirm: 'Это стол {n}', tbl_choose: 'Выберите стол',

    wel_photo: 'Гость выдыхает дым под розовым неоном в Hansum', wel_where: 'Hansum {name}, стол {n}', wel_h1a: 'Выдохните.', wel_h1b: 'Расслабьтесь.',
    wel_lede: 'Кальян, коктейли и кофе — заказ прямо со стола.', wel_sentAria: 'Заказы с этого стола', wel_sent: 'Отправлено с вашего стола',
    wel_start: 'Заказать кальян', wel_another: 'Ещё один кальян', wel_drinks: 'Заказать напитки', wel_justDrinks: 'Только напитки', wel_links: 'Wi-Fi, Instagram и карта',
    kind_Shisha: 'Кальян', 'kind_Additional shisha': 'Ещё кальян', kind_Drinks: 'Напитки',

    leaf_h: 'Выберите табак', mode_aria: 'Тип сессии', mode_new: 'Новый кальян', mode_refill: 'Перезабивка', refill_sub: 'Продолжите сессию со свежим табаком.', shisha_aria: 'Варианты кальяна',
    tier_Refill: 'Перезабивка', refill_of: 'Перезабивка: {leaf}',
    note_fruit: 'Питайя · ананас · яблоко и другие', note_sig: '8 авторских миксов',
    int_upto: 'Крепость до {n}', int_upto_aria: 'Крепость до {n} из 10',
    path_fruit: 'Подаётся на свежем фрукте. Чашу выбирать не нужно.', path_refill: 'Сразу к выбору вкуса.', path_sig: 'Авторские сочетания вкусов от Hansum.',

    bowl_h: 'Какую чашу?', bowl_sub: 'Разные чаши — разные ощущения.', bowl_aria: 'Тип чаши', bowl_line_egy: 'Классика · мягко', bowl_line_phu: 'Насыщенно · дымно',

    sig_h: 'Выберите микс', sig_sub: '8 авторских миксов, одна цена. Нажмите, чтобы продолжить.', sig_aria: 'Миксы Hansum Signature',
    'sig_jade-bean_d': 'Маш · кокос · ваниль', 'sig_jade-bean_t': 'Сливочный, ореховый, мягко сладкий',
    'sig_tropical-bazaar_d': 'Манго · маракуйя · ананас', 'sig_tropical-bazaar_t': 'Сочный, яркий, тропический',
    'sig_golden-citrus_d': 'Апельсин · лимон', 'sig_golden-citrus_t': 'Свежий, бодрящий цитрус',
    'sig_silk-rose_d': 'Роза · личи', 'sig_silk-rose_t': 'Цветочный, элегантный, слегка сладкий',
    'sig_jasmine-honey-garden_d': 'Жасминовый чай · груша · мёд', 'sig_jasmine-honey-garden_t': 'Нежный, ароматный и мягкий',
    'sig_saigon-velvet_d': 'Кофе · кокос · ваниль · карамель', 'sig_saigon-velvet_t': 'Насыщенный, сливочный, как десерт',
    'sig_mango-moon_d': 'Манго с клейким рисом', 'sig_mango-moon_t': 'Сливочное манго с мягким послевкусием',
    'sig_black-temple_d': 'Сандал · ваниль · чёрный чай', 'sig_black-temple_t': 'Глубокий, древесный, изысканный',

    fl_h: 'Какой вкус хочется?', fl_sub: 'Смешайте до трёх вкусов или доверьтесь нам.', blend_aria: 'Ваш микс',
    remove_x: 'Убрать: {x}', clear_x: 'Очистить: {x}', slot_1: 'Первый', slot_2: 'Второй', slot_3: 'Третий',
    fl_dirs: 'Направления', fl_dirs_aria: 'Вкусовые направления',
    flavor_FRUITY: 'Фруктовый', flavor_CITRUS: 'Цитрус', flavor_CREAMY: 'Сливочный', flavor_FLORAL: 'Цветочный', flavor_TEA: 'Чай', flavor_WOOD: 'Древесный', flavor_MINT: 'Мята',
    dir_FRUITY: 'Сладкий и лёгкий.', dir_CITRUS: 'Яркий и бодрящий.', dir_CREAMY: 'Мягкий, как десерт.', dir_FLORAL: 'Лёгкий и элегантный.', dir_TEA: 'Ароматный и многогранный.', dir_WOOD: 'Глубокий и пряный.',
    house_h: 'Фирменные вкусы', house_small: 'Или выберите один', note_house: 'Фирменный вкус',
    leave_h: 'Или доверьтесь нам', leave_aria: 'Выбор мастера или свой вариант', omakase_desc: 'Кальянный мастер подберёт вкус сам.', note_chef: 'Выбор мастера',
    other: 'Свой вариант', other_desc: 'Расскажите, чего хочется.', other_ph: 'Напишите, какой вкус вы хотите…', other_aria: 'Желаемый вкус',
    your_own: 'Свой вкус', note_words: 'Ваш вариант', n_flavors_one: '{n} вкус', n_flavors_few: '{n} вкуса', n_flavors_many: '{n} вкусов', n_flavors_other: '{n} вкуса', custom_flavor: 'Свой вкус',

    feel_h: 'Какие ощущения?', d_int: 'Крепость', d_cool: 'Холодок', d_mint: 'Мята', dial_valuetext: '{v} из {max}, {band}',
    band_none: 'Нет', int_light: 'Лёгкая', int_balanced: 'Средняя', int_strong: 'Крепкая',
    cool_soft: 'Лёгкий', cool_medium: 'Средний', cool_icy: 'Ледяной', cool_extreme: 'Очень ледяной',
    mint_soft: 'Лёгкая', mint_medium: 'Средняя', mint_strong: 'Сильная', mint_extreme: 'Очень сильная',
    fs_barely: 'Почти не ощущается', fs_int_light: 'Лёгкая крепость', fs_int_balanced: 'Средняя крепость', fs_int_strong: 'Крепкий',
    fs_cool_soft: 'лёгкий холодок', fs_cool_medium: 'средний холодок', fs_cool_icy: 'ледяной холодок', fs_cool_extreme: 'очень ледяной холодок',
    fs_mint_soft: 'немного мяты', fs_mint_medium: 'средняя мята', fs_mint_strong: 'сильная мята', fs_mint_extreme: 'очень много мяты',
    fs_with: '{base}, {list}.', fs_and: ' и ', fs_nocool: '{base}, без холодка.',
    cap_a: 'Максимальная крепость — 5. Для более крепкого кальяна выберите ', cap_b: '.',

    ex_h: 'Под себя', ex_sub: 'Необязательно. Пропустите, если всё нравится.', ex_aria: 'Дополнения',
    'addon_Ice Hose Cooling': 'Ледяной шланг', 'addon_Tea Base': 'Колба с чаем', 'addon_Milk Base': 'Колба с молоком', 'addon_Liquor Base (2 shots)': 'Колба с алкоголем', 'addon_Coffee Base': 'Колба с кофе',
    'addon_note_2 shots': '2 шота', ex_other: 'Другое', ex_custom: 'Свой запрос', ex_ph: 'Уточните, пожалуйста…', ex_other_aria: 'Другое дополнение', ex_adds: 'Дополнения: {p} VND. ',
    vatSentence: 'Цены указаны без НДС 8/10%.', vat: 'Цены в VND, без НДС 8/10%.',

    rv_h: 'Ваш Hansum', rv_on_a: '{shisha} · {bowl}', rv_on_an: '{shisha} · {bowl}', rv_fruit: 'Fruit Head на свежем фрукте',
    k_shisha: 'Кальян', k_bowl: 'Чаша', k_flavor: 'Вкус', k_signature: 'Signature', k_feel: 'Крепость', k_extras: 'Добавки',
    edit_x: 'Изменить: {x}', change: 'Изменить', change_x: 'Изменить: {x}', custom: 'Запрос', total: 'Итого', not_chosen: 'Ещё не выбрано', none: 'Нет',

    sent_title: 'Заказ отправлен.', sent_title_more: 'Дополнительный заказ отправлен.',
    sent_text: 'Заказ кальяна для стола {n} отправлен нашей команде.', sent_text_more: 'Дополнительный заказ для стола {n} отправлен нашей команде.',
    ref: 'Номер заказа', copy: 'Копировать', copied: 'Скопировано', copy_ref_aria: 'Скопировать номер заказа {ref}',
    more_h: 'Меню всё ещё открыто.', more_sub: 'Заказывайте ещё кальян или напитки в любое время. Каждый заказ отправляется отдельно.',
    btn_drinks: 'Заказать напитки', btn_another: 'Ещё кальян', btn_browse: 'Посмотреть меню', btn_done: 'На сегодня всё',

    drinks_h: 'Напитки', drinks_already: 'Заказ кальяна уже отправлен. ', pic_ref: 'Фото для примера', from_p: 'от {p}',
    remove_one: 'Убрать один: {x}', add_one: 'Ещё один: {x}', add_x: 'Добавить: {x}',
    round_h: 'Ваши напитки', round_on: 'Стол {n}. Отдельный заказ, не вместе с кальяном.', empty: 'Пока ничего нет.', choose_drinks: 'Выбрать напитки',
    subtotal: 'Сумма', min_drink: 'Минимум 1 напиток на гостя.', add_more: 'Добавить напитки',
    cat_SIGNATURE_Cocktails: 'Авторские коктейли', cat_CLASSIC_Cocktails: 'Классические коктейли', 'cat_Frozen Series': 'Фроузен-напитки', 'cat_-86°C Frozen Coffee': 'Замороженный кофе -86°C',
    cat_Coffee: 'Кофе', cat_Tea: 'Чай', cat_Shooters: 'Шоты', 'cat_Mocktails & Soft Drinks': 'Моктейли и безалкогольные напитки', 'cat_Mocktails · Soft Drinks · Water': 'Моктейли · безалкогольные напитки · вода',
    'cat_Beer · Soju · Wine': 'Пиво · соджу · вино', 'cat_Wine · Beer · Soju': 'Вино · пиво · соджу', 'cat_Bottle Service': 'Бутылки',

    sofar_aria: 'Ваш заказ: {s}. Открыть детали', back: 'Назад', sending: 'Отправляем…',
    hint_leaf: 'Выберите табак, чтобы продолжить', hint_bowl: 'Выберите чашу, чтобы продолжить', hint_sig: 'Выберите микс, чтобы продолжить',
    cont_with: 'Продолжить: {x}', 'continue': 'Продолжить', review_order: 'Проверить заказ', skip_review: 'Пропустить и проверить', confirm_send: 'Подтвердить и отправить',
    note_team: 'Заказ сразу уйдёт команде, стол {n}.', note_separate: 'Отдельный заказ для стола {n}.',
    items_one: '{n} позиция', items_few: '{n} позиции', items_many: '{n} позиций', items_other: '{n} позиции', review_round: 'Проверить напитки', choose_something: 'Выберите напиток',

    sheet_order: 'Ваш заказ', sheet_info: 'Информация о столе', close: 'Закрыть', sofar_h: 'Ваш заказ', from_qr: ' · по QR-коду стола',
    wifi: 'Wi-Fi', password: 'Пароль', copy_pw: 'Скопировать пароль',
    sending_aria: 'Отправляем заказ', sending_k: 'Отправляем команде', sending_s: 'Не закрывайте эту страницу пару секунд.',

    msg_blend3: 'Можно смешать до трёх вкусов. Нажмите на один, чтобы заменить.',
    err_item: 'Эта позиция больше недоступна. Обновите меню.',
    err_table: 'Стол не найден. Пожалуйста, обратитесь к персоналу.',
    err_pos: 'Не удалось отправить заказ. Пожалуйста, обратитесь к персоналу.',
    err_send: 'Не удалось отправить заказ. Попробуйте ещё раз. Ваш выбор сохранён на этом устройстве.',
    err_send_more: 'Не удалось отправить дополнительный заказ. Попробуйте ещё раз. Выбранные позиции сохранены на этом устройстве.'
  },

  zh: {
    skip: '跳至主要內容', language: '語言',
    tableN: '{n} 號枱', noTable: '尚未選擇枱號', tableChipAria: '{table}，Hansum {name}', tableInfoAria: '查看枱號資料：Wi-Fi 及連結',
    stepOf: '{i} / {n}',
    step_leaf: '煙草', step_bowl: '煙碗', step_flavor: '口味', step_feel: '濃度', step_extras: '加配', step_review: '您的訂單', step_drinks: '飲品', step_round: '飲品訂單', step_signature: 'Signature',

    tbl_h: '您坐在哪一枱？', tbl_sub: '選擇枱號，我們便知道把訂單送到哪裡。', tbl_grid: '枱號', tbl_confirm: '這是 {n} 號枱', tbl_choose: '選擇枱號',

    wel_photo: '客人在 Hansum 粉紅霓虹燈下吐出煙霧', wel_where: 'Hansum {name}，{n} 號枱', wel_h1a: '放鬆', wel_h1b: '一下。',
    wel_lede: '在枱上即可點水煙、雞尾酒和咖啡。', wel_sentAria: '此枱已送出的訂單', wel_sent: '此枱已送出',
    wel_start: '點水煙', wel_another: '再點一支水煙', wel_drinks: '點飲品', wel_justDrinks: '只點飲品', wel_links: 'Wi-Fi、Instagram 及地圖',
    kind_Shisha: '水煙', 'kind_Additional shisha': '加點水煙', kind_Drinks: '飲品',

    leaf_h: '選擇煙草', mode_aria: '類型', mode_new: '新水煙', mode_refill: '續煙', refill_sub: '用新煙草繼續您的水煙。', shisha_aria: '水煙選項',
    tier_Refill: '續煙', refill_of: '{leaf} 續煙',
    note_fruit: '火龍果 · 菠蘿 · 蘋果等', note_sig: '8 款獨家招牌配方',
    int_upto: '濃度最高 {n}', int_upto_aria: '濃度最高 {n}（滿分 10）',
    path_fruit: '以新鮮水果盛載，無需選擇煙碗。', path_refill: '直接選擇口味。', path_sig: 'Hansum 自家調配的口味組合。',

    bowl_h: '選擇煙碗', bowl_sub: '不同煙碗，不同體驗。', bowl_aria: '煙碗款式', bowl_line_egy: '經典 · 順滑', bowl_line_phu: '濃郁 · 煙量足',

    sig_h: '選擇招牌配方', sig_sub: '8 款招牌配方，同一價錢。點選即可繼續。', sig_aria: 'Hansum Signature 配方',
    'sig_jade-bean_d': '綠豆 · 椰子 · 雲呢拿', 'sig_jade-bean_t': '香滑、帶果仁香、微甜',
    'sig_tropical-bazaar_d': '芒果 · 熱情果 · 菠蘿', 'sig_tropical-bazaar_t': '多汁、明亮、熱帶風情',
    'sig_golden-citrus_d': '橙 · 檸檬', 'sig_golden-citrus_t': '清新、酸爽、提神',
    'sig_silk-rose_d': '玫瑰 · 荔枝', 'sig_silk-rose_t': '花香、優雅、淡淡甜味',
    'sig_jasmine-honey-garden_d': '茉莉茶 · 梨 · 蜜糖', 'sig_jasmine-honey-garden_t': '細緻、芬芳、柔和',
    'sig_saigon-velvet_d': '咖啡 · 椰子 · 雲呢拿 · 焦糖', 'sig_saigon-velvet_t': '濃郁香滑，似甜品',
    'sig_mango-moon_d': '芒果糯米飯', 'sig_mango-moon_t': '香滑芒果，餘韻柔和',
    'sig_black-temple_d': '檀香 · 雲呢拿 · 紅茶', 'sig_black-temple_t': '深沉、木香、有格調',

    fl_h: '想要甚麼口味？', fl_sub: '最多混合三款，或交給我們。', blend_aria: '您的口味組合',
    remove_x: '移除 {x}', clear_x: '清除 {x}', slot_1: '第一款', slot_2: '第二款', slot_3: '第三款',
    fl_dirs: '口味方向', fl_dirs_aria: '口味方向',
    flavor_FRUITY: '果味', flavor_CITRUS: '柑橘', flavor_CREAMY: '香滑', flavor_FLORAL: '花香', flavor_TEA: '茶香', flavor_WOOD: '木香', flavor_MINT: '薄荷',
    dir_FRUITY: '香甜易入口。', dir_CITRUS: '清新酸爽。', dir_CREAMY: '香滑似甜品。', dir_FLORAL: '輕盈優雅。', dir_TEA: '芳香有層次。', dir_WOOD: '深沉芳香。',
    house_h: '招牌口味', house_small: '或單選一款', note_house: '招牌口味',
    leave_h: '或交給我們', leave_aria: '主理人推薦或自訂', omakase_desc: '由我們的水煙師為您決定。', note_chef: '主理人推薦',
    other: '其他口味', other_desc: '告訴我們您想要的。', other_ph: '請寫下您喜歡的口味…', other_aria: '喜歡的口味',
    your_own: '自訂', note_words: '您的描述', n_flavors_other: '{n} 款口味', custom_flavor: '自訂口味',

    feel_h: '想要怎樣的感覺？', d_int: '濃度', d_cool: '冰涼', d_mint: '薄荷', dial_valuetext: '{max} 之 {v}，{band}',
    band_none: '無', int_light: '輕', int_balanced: '適中', int_strong: '濃',
    cool_soft: '微涼', cool_medium: '適中', cool_icy: '冰涼', cool_extreme: '極冰',
    mint_soft: '少量', mint_medium: '適中', mint_strong: '濃', mint_extreme: '極濃',
    fs_barely: '幾乎沒有感覺', fs_int_light: '濃度輕', fs_int_balanced: '濃度適中', fs_int_strong: '濃度高',
    fs_cool_soft: '微涼', fs_cool_medium: '適中冰涼', fs_cool_icy: '冰涼', fs_cool_extreme: '極冰',
    fs_mint_soft: '少許薄荷', fs_mint_medium: '適中薄荷', fs_mint_strong: '濃薄荷', fs_mint_extreme: '極濃薄荷',
    fs_with: '{base}，{list}。', fs_and: '、', fs_nocool: '{base}，不加冰涼。',
    cap_a: '最高濃度為 5。想要更濃，請選擇 ', cap_b: '。',

    ex_h: '按您喜好', ex_sub: '可選。滿意的話可直接略過。', ex_aria: '加配',
    'addon_Ice Hose Cooling': '冰喉管', 'addon_Tea Base': '茶底', 'addon_Milk Base': '奶底', 'addon_Liquor Base (2 shots)': '酒底', 'addon_Coffee Base': '咖啡底',
    'addon_note_2 shots': '2 shots', ex_other: '其他要求', ex_custom: '自訂要求', ex_ph: '請註明…', ex_other_aria: '其他加配', ex_adds: '加配 {p} VND。',
    vatSentence: '價格未包括 8/10% VAT。', vat: '價格以 VND 計，未含 8/10% VAT。',

    rv_h: '您的 Hansum', rv_on_a: '{shisha} · {bowl}', rv_on_an: '{shisha} · {bowl}', rv_fruit: 'Fruit Head，以新鮮水果盛載',
    k_shisha: '水煙', k_bowl: '煙碗', k_flavor: '口味', k_signature: 'Signature', k_feel: '濃度', k_extras: '加配',
    edit_x: '修改{x}', change: '更改', change_x: '更改{x}', custom: '自訂', total: '合計', not_chosen: '尚未選擇', none: '無',

    sent_title: '訂單已送出。', sent_title_more: '加點訂單已送出。',
    sent_text: '{n} 號枱的水煙訂單已送到我們的團隊。', sent_text_more: '{n} 號枱的加點訂單已送到我們的團隊。',
    ref: '訂單編號', copy: '複製', copied: '已複製', copy_ref_aria: '複製訂單編號 {ref}',
    more_h: '餐牌仍然開放。', more_sub: '隨時可加點水煙或飲品，每張新訂單會分開送出。',
    btn_drinks: '點飲品', btn_another: '再點水煙', btn_browse: '繼續瀏覽', btn_done: '今晚到此為止',

    drinks_h: '飲品', drinks_already: '您的水煙訂單已送出。', pic_ref: '圖片僅供參考', from_p: '{p} 起',
    remove_one: '減少一份 {x}', add_one: '多加一份 {x}', add_x: '加入 {x}',
    round_h: '飲品訂單', round_on: '{n} 號枱。會作為獨立訂單送出，與水煙分開。', empty: '尚未加入任何飲品。', choose_drinks: '選擇飲品',
    subtotal: '小計', min_drink: '每位最少一杯飲品。', add_more: '加點飲品',
    cat_SIGNATURE_Cocktails: '招牌雞尾酒', cat_CLASSIC_Cocktails: '經典雞尾酒', 'cat_Frozen Series': '冰沙系列', 'cat_-86°C Frozen Coffee': '-86°C 急凍咖啡',
    cat_Coffee: '咖啡', cat_Tea: '茶', cat_Shooters: 'Shots', 'cat_Mocktails & Soft Drinks': '無酒精雞尾酒及汽水', 'cat_Mocktails · Soft Drinks · Water': '無酒精雞尾酒 · 汽水 · 水',
    'cat_Beer · Soju · Wine': '啤酒 · 燒酒 · 葡萄酒', 'cat_Wine · Beer · Soju': '葡萄酒 · 啤酒 · 燒酒', 'cat_Bottle Service': '原支酒',

    sofar_aria: '目前訂單：{s}。查看詳情', back: '返回', sending: '送出中…',
    hint_leaf: '點選煙草即可繼續', hint_bowl: '點選煙碗即可繼續', hint_sig: '點選配方即可繼續',
    cont_with: '以 {x} 繼續', 'continue': '繼續', review_order: '檢查訂單', skip_review: '略過並檢查', confirm_send: '確認並送出',
    note_team: '直接送到 {n} 號枱的服務團隊。', note_separate: '作為獨立訂單送到 {n} 號枱。',
    items_other: '{n} 項', review_round: '檢查飲品訂單', choose_something: '選擇飲品',

    sheet_order: '目前訂單', sheet_info: '枱號資料', close: '關閉', sofar_h: '目前訂單', from_qr: ' · 經枱上 QR',
    wifi: 'Wi-Fi', password: '密碼', copy_pw: '複製密碼',
    sending_aria: '正在送出訂單', sending_k: '正在送到我們的團隊', sending_s: '請保持此畫面開啟片刻。',

    msg_blend3: '最多可混合三款。點選其中一款即可替換。',
    err_item: '此項目暫時無法供應，請重新整理餐牌。',
    err_table: '找不到此枱號，請向職員查詢。',
    err_pos: '未能送出訂單，請向職員查詢。',
    err_send: '未能把訂單送到我們的團隊，請再試一次。您的選擇已儲存在此裝置。',
    err_send_more: '未能送出加點訂單，請再試一次。您的項目已儲存在此裝置。'
  }
};
