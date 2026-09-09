
const {createApp}=Vue;
const urlParams=new URLSearchParams(window.location.search);
const rawQrTable=(urlParams.get('table')||'').trim().toUpperCase();
const normalizeTable=(value)=>{
  if(/^\d+$/.test(value)){
    const n=Number(value);
    if(n>=1&&n<=12)return String(n).padStart(2,'0');
  }
  return value;
};
const qrTable=normalizeTable(rawQrTable);
const allowedTables=['01','02','03','04','05','06','07','08','09','10','11','12'];
const hasQrTable=allowedTables.includes(qrTable);
createApp({
data(){return{
stepNames:{1:'SHISHA',2:'BOWL',3:'FLAVOR',4:'STRENGTH',5:'COOLING',6:'ADD-ONS',7:'REVIEW'},
step:hasQrTable?1:0,
tables:['01','02','03','04','05','06','07','08','09','10','11','12'],
locale:'en',languages:[{code:'en',label:'EN'},{code:'zh',label:'中文'},{code:'ko',label:'한국어'}],showStaffHelp:false,
translations:{
en:{back:'BACK',table:'TABLE',qrTable:'SAIGON · QR TABLE',step:'STEP',needHelp:'NEED HELP',welcome:'WELCOME TO HANSUM',chooseTable:'Choose your table',chooseTableHint:'Select your table to begin your Hansum experience.',continue:'CONTINUE',shishaSelection:'Shisha Selection',shishaHint:'Choose your leaf experience.',addons:'ADD-ONS',reviewOrder:'REVIEW ORDER',subtotal:'Subtotal',vat:'8/10% VAT NOT INCLUDED',vatSentence:'Prices are exclusive of 8/10% VAT.',sending:'SENDING…',confirmShisha:'CONFIRM SHISHA ORDER',shishaSent:'SHISHA ORDER SENT',thankYou:'Thank You',shishaSentHint:'Your shisha order has been confirmed and sent to our team.',orderMore:'ORDER DRINKS & MORE',finish:'FINISH',addToOrder:'Add to your order',addToOrderHint:'Add drinks and other items. Your shisha order has already been sent to our team.',drinkCategories:'Drink categories',add:'ADD',reviewDrinkOrder:'REVIEW DRINK ORDER',additionalOrder:'ADDITIONAL ORDER',staffTitle:'Need assistance?',staffMessage:'Please raise your hand and a Hansum team member will be with you shortly.',close:'CLOSE',cat_Cocktails:'Cocktails',cat_FrozenSeries:'Frozen Series',cat_86:'-86°C Frozen Coffee',cat_Coffee:'Coffee',cat_Shooters:'Shooters',cat_Mocktails:'Mocktails & Soft Drinks',cat_Beer:'Beer · Soju · Wine',cat_Bottle:'Bottle Service'},
zh:{back:'返回',table:'枱號',qrTable:'QR 枱號',step:'步驟',needHelp:'需要協助',welcome:'歡迎來到 HANSUM',chooseTable:'選擇您的枱號',chooseTableHint:'選擇枱號後，即可開始您的 Hansum 體驗。',continue:'繼續',shishaSelection:'水煙選擇',shishaHint:'選擇您喜歡的煙葉體驗。',addons:'附加選項',reviewOrder:'查看訂單',subtotal:'小計',vat:'未含 8/10% VAT',vatSentence:'價格未包括 8/10% VAT。',sending:'正在傳送…',confirmShisha:'確認水煙訂單',shishaSent:'水煙訂單已傳送',thankYou:'謝謝您',shishaSentHint:'您的水煙訂單已確認並傳送給我們的團隊。',orderMore:'加點飲品及其他項目',finish:'完成',addToOrder:'加入您的訂單',addToOrderHint:'加入飲品及其他項目；水煙訂單已經傳送給團隊。',drinkCategories:'飲品分類',add:'加入',reviewDrinkOrder:'查看飲品訂單',additionalOrder:'加點訂單',staffTitle:'需要協助？',staffMessage:'請舉手示意，Hansum 團隊成員將很快為您服務。',close:'關閉',cat_Cocktails:'雞尾酒',cat_FrozenSeries:'冰沙系列',cat_86:'-86°C 冰凍咖啡',cat_Coffee:'咖啡',cat_Shooters:'Shot 酒',cat_Mocktails:'無酒精雞尾酒及軟飲',cat_Beer:'啤酒 · 燒酒 · 葡萄酒',cat_Bottle:'整瓶酒服務'},
ko:{back:'뒤로',table:'테이블',qrTable:'QR 테이블',step:'단계',needHelp:'도움이 필요하신가요',welcome:'HANSUM에 오신 것을 환영합니다',chooseTable:'테이블을 선택하세요',chooseTableHint:'테이블을 선택하고 Hansum 경험을 시작하세요.',continue:'계속',shishaSelection:'시샤 선택',shishaHint:'원하시는 리프 경험을 선택하세요.',addons:'추가 옵션',reviewOrder:'주문 확인',subtotal:'소계',vat:'8/10% VAT 별도',vatSentence:'가격에는 8/10% VAT가 포함되어 있지 않습니다.',sending:'전송 중…',confirmShisha:'시샤 주문 확정',shishaSent:'시샤 주문 전송 완료',thankYou:'감사합니다',shishaSentHint:'시샤 주문이 확인되어 팀에 전송되었습니다.',orderMore:'음료 및 추가 메뉴 주문',finish:'완료',addToOrder:'주문에 추가',addToOrderHint:'음료와 추가 메뉴를 선택하세요. 시샤 주문은 이미 팀에 전송되었습니다.',drinkCategories:'음료 카테고리',add:'추가',reviewDrinkOrder:'음료 주문 확인',additionalOrder:'추가 주문',staffTitle:'도움이 필요하신가요?',staffMessage:'손을 들어 주시면 Hansum 팀원이 곧 도와드리겠습니다.',close:'닫기',cat_Cocktails:'칵테일',cat_FrozenSeries:'프로즌 시리즈',cat_86:'-86°C 프로즌 커피',cat_Coffee:'커피',cat_Shooters:'슈터',cat_Mocktails:'목테일 & 소프트 드링크',cat_Beer:'맥주 · 소주 · 와인',cat_Bottle:'보틀 서비스'}
},
order:{table:hasQrTable?qrTable:'',shishaType:'',shishaName:'',price:0,bowl:'',flavorType:'',specific:'',other:'',intensity:5,mint:0,addons:[],otherAddon:''},
selectedDirections:[],
flavorDirections:[],
specificFlavors:[
{icon:'🍏',name:'DOUBLE APPLE'},{icon:'🌿',name:'MINT'},{icon:'💕',name:'LOVE 66'},{icon:'🍓',name:'LADYKILLER'}
],
addonOptions:[
{icon:'🧊',name:'Ice Hose Cooling',price:100000},
{icon:'🍵',name:'Tea Base',price:50000},
{icon:'🥛',name:'Milk Base',price:50000},
{icon:'🥃',name:'Liquor Base (2 shots)',price:150000,note:'2 shots'},
{icon:'☕',name:'Coffee Base',price:50000}
],
otherAddonEnabled:false,
basket:[],sending:false,sendMessage:'',shishaSent:false,drinkSent:false,sessionRef:'',shishaOrderRef:'',drinkOrderRef:'',
moreCategories:[
 {label:'SIGNATURE',name:'Cocktails',items:[
  {name:'Tokyo by Night (Jupiter)',price:248000,note:'Gin · Luxardo Maraschino Liqueur · Chocolate Liqueur'},
  {name:'Fly to the Moon',price:248000,note:'Butterfly Pea-Infused Gin · Rosemary · Honey · Lime · Coconut Juice'},
  {name:'Cocotini (Mercury)',price:248000,note:'Rum · Coconut · Lime · Cream'},
  {name:'Old But Gold (Mars)',price:248000,note:'Gin · Disaronno Liqueur · Umeshu · Ginger Ale'},
  {name:'Yummy (Earth)',price:248000,note:'Rum · Tamarind · Tabasco · Lime · Craft Beer · Bacon'},
  {name:'Sunny Sour (Venus)',price:248000,note:'Whiskey · Jägermeister · Orangecello · Passion Fruit · Lime · Egg White'},
  {name:'California Gold (Sun)',price:248000,note:'Chamomile-Infused Gin · Pineapple · Coconut · Lime'},
  {name:'Umamamia (Saturn)',price:248000,note:'Whiskey · Olive · Cherry Brandy · Bénédictine D.O.M. · Angostura'},
  {name:'Diamond Blossom (Uranus)',price:248000,note:'Butterfly Pea-Infused Gin · Limoncello · Honey · Lime'},
  {name:"Bartender's Choice",price:248000,note:'Feel free to ask our bartender'}]},
 {label:'CLASSIC',name:'Cocktails',items:[
  {name:'Dry Martini',price:188000},{name:'Negroni',price:188000},{name:'Gimlet',price:188000},{name:"Bee's Knees",price:188000},
  {name:'Mojito',price:188000},{name:'Boulevardier',price:188000},{name:'Daiquiri',price:188000},{name:'Old Fashioned',price:188000},
  {name:'Piña Colada',price:188000},{name:'Whiskey Sour',price:188000},{name:'Espresso Martini',price:188000},{name:'Manhattan',price:188000},
  {name:'Blue Hawaii',price:188000},{name:'White Russian',price:188000},{name:'Tequila Sunrise',price:188000},{name:'Cosmopolitan',price:188000},
  {name:'Singapore Sling',price:188000},{name:'Margarita',price:188000},{name:'Long Island Iced Tea',price:188000},{name:'Adios Motherfucker (AMF)',price:188000}]},
 {label:'TEA',name:'Tea',items:[
  {name:'Earl Grey',price:98000},{name:'Jasmine',price:98000},{name:'Oolong Peach',price:98000},{name:'Chamomile',price:98000},
  {name:'Dehydrated Rose',price:98000},{name:'Peppermint',price:98000}]},
 {label:'COFFEE',name:'Coffee',items:[
  {name:'Espresso',price:88000},{name:'Double Espresso',price:98000},{name:'Americano',price:88000},
  {name:'Latte',price:88000},{name:'Vietnamese Iced Milk Coffee',price:98000},{name:'Hand Drip Coffee',price:98000}]},
 {label:'SHOTS',name:'Shooters',items:[
  {name:'Baby Guinness',price:118000,note:'Kahlúa · Baileys'},{name:'B52',price:138000,note:'Kahlúa · Baileys · Cointreau'},
  {name:'B55',price:158000,note:'Kahlúa · Baileys · Absinthe'},{name:'Duck Fart',price:148000,note:'Kahlúa · Baileys · Whiskey'},
  {name:'Jelly Fish',price:158000,note:'Cacao Liqueur · Amaretto · Baileys'},{name:'Rainbow 6 Shots',price:500000}]},
 {label:'REFRESH',name:'Mocktails · Soft Drinks · Water',items:[
  {name:'Mocktail',price:108000},{name:'Red Bull',price:65000},{name:'Coke Original / Zero',price:65000},{name:'Sprite',price:65000},
  {name:'Tonic Water',price:65000},{name:'Soda Water',price:65000},{name:'Ginger Ale',price:65000},
  {name:'Juice — Orange / Pineapple / Apple',price:65000},{name:'La Vie Water — Still / Sparkling',price:78000}]},
 {label:'WINE',name:'Wine · Beer · Soju',items:[
  {name:'Nu Comme un Verre — Bordeaux AOC',price:980000,note:'Bottle · Merlot (Vegan)'},
  {name:'Le Cancre — Bordeaux AOP',price:880000,note:'Bottle · Merlot · Cabernet Sauvignon · Cabernet Franc'},
  {name:'Domaine UBY N°7 — IGP Côtes de Gascogne',price:160000,note:'Glass · Merlot · Tannat'},
  {name:"L'Exalté — Bordeaux AOP",price:180000,note:'Glass · Sauvignon Blanc'},
  {name:'Domaine UBY N°3 — IGP Côtes de Gascogne',price:180000,note:'Glass · Colombard · Sauvignon Blanc'},
  {name:'Le Hardi — Bordeaux Rosé',price:980000,note:'Bottle · Cabernet Franc · Cabernet Sauvignon'},
  {name:'Tiger (Draft Beer)',price:88000},{name:'Kronenbourg 1664 Blanc',price:98000},{name:'Carlsberg Pilsner',price:98000},{name:'Tuborg',price:98000},
  {name:'Soju — Chamisul Original',price:168000},{name:'Makgeolli',price:188000}]},
 {label:'PREMIUM',name:'Bottle Service',items:[
  {name:'Safiro Classic',price:1800000},{name:'Bombay Sapphire',price:2000000},{name:'Tanqueray',price:2200000},{name:'Roku',price:2400000},{name:"Hendrick's",price:3400000},
  {name:'Jose Cuervo Silver',price:1800000},{name:'Jose Cuervo Reposado',price:1800000},{name:'Patron Silver',price:4100000},
  {name:'Absolut',price:1800000},{name:'Grey Goose',price:3000000},
  {name:'Jim Beam White',price:1800000},{name:'Jack Daniels',price:2200000},{name:"Dewar's 12 Years",price:2200000},{name:'Tenjaku Blended Malt',price:2500000},
  {name:"Maker's Mark",price:2500000},{name:'Monkey Shoulder',price:2900000},{name:"The Glenlivet Founder's Reserve",price:3600000},
  {name:'Bacardi White Rum',price:1800000},{name:'Captain Morgan',price:2000000},{name:'Zacapa Ambar 12',price:2600000},
  {name:'Alfonso X.O',price:1800000},{name:'Hennessy V.S.O.P',price:3400000}]}
]
}},
watch:{
  order:{deep:true,handler(){this.persistState()}},
  basket:{deep:true,handler(){this.persistState()}},
  step(){this.persistState()}
},
computed:{
showSpecific(){return this.order.shishaType==='Classic'||this.order.shishaType==='Refill Blonde'},
canContinueFlavor(){
if(this.order.flavorType==='Other')return this.order.other.trim().length>0;
if(this.order.flavorType==='Omakase'||this.order.flavorType==='Specific')return true;
return this.selectedDirections.length>0
},
flavorSummary(){
if(this.order.flavorType==='Specific')return this.order.specific;
if(this.order.flavorType==='Other')return this.order.other;
if(this.order.flavorType==='Omakase')return 'HANSUM OMAKASE';
return this.selectedDirections.join(' · ')
},
addonTotal(){return this.order.addons.reduce((s,a)=>s+a.price,0)},
totalPrice(){return this.order.price+this.addonTotal},
grandTotal(){return this.order.price+this.addonTotal+this.basket.reduce((s,i)=>s+i.price*i.qty,0)},
basketTotal(){return this.basket.reduce((s,i)=>s+i.price*i.qty,0)},
basketCount(){return this.basket.reduce((s,i)=>s+i.qty,0)},
  tableLocked(){return hasQrTable},
  vatLabel(){return this.t('vat')},
  localizedStepNames(){
    const labels={en:{1:'SHISHA',2:'BOWL',3:'FLAVOR',4:'STRENGTH',5:'COOLING',6:'ADD-ONS',7:'REVIEW'},zh:{1:'水煙',2:'煙碗',3:'風味',4:'濃度',5:'涼感',6:'附加選項',7:'確認'},ko:{1:'시샤',2:'보울',3:'향',4:'강도',5:'쿨링',6:'추가 옵션',7:'확인'}};
    return labels[this.locale]||labels.en
  }
},
methods:{
  t(key){return (this.translations[this.locale]&&this.translations[this.locale][key])||this.translations.en[key]||key},
  setLocale(locale){this.locale=locale;try{localStorage.setItem('hansumLocale',locale)}catch(e){}},
  categoryTitle(cat){const keys={'Cocktails':'cat_Cocktails','Frozen Series':'cat_FrozenSeries','-86°C Frozen Coffee':'cat_86','Coffee':'cat_Coffee','Shooters':'cat_Shooters','Mocktails & Soft Drinks':'cat_Mocktails','Beer · Soju · Wine':'cat_Beer','Bottle Service':'cat_Bottle'};return this.t(keys[cat.name]||cat.name)},
  scrollToCategory(index){const target=document.getElementById('category-'+index);if(target)target.scrollIntoView({behavior:'smooth',block:'start'})},
  next(){if(this.step<8)this.step++},
setDirections(dark){
this.flavorDirections=dark?[
{icon:'🍓',name:'FRUITY',description:'Sweet and easy to enjoy.'},
{icon:'🍋',name:'CITRUS',description:'Bright and zesty.'},
{icon:'🍦',name:'CREAMY',description:'Smooth and dessert-like.'},
{icon:'🌸',name:'FLORAL',description:'Light and elegant.'},
{icon:'🍵',name:'TEA',description:'Aromatic and layered.'},
{icon:'🪵',name:'WOOD',description:'Deep and aromatic.'}
]:[
{icon:'🍓',name:'FRUITY',description:'Sweet and easy to enjoy.'},
{icon:'🍋',name:'CITRUS',description:'Bright and zesty.'},
{icon:'🍦',name:'CREAMY',description:'Smooth and dessert-like.'}
]},
selectShisha(type,name,price,fruitHead){
Object.assign(this.order,{shishaType:type,shishaName:name,price,bowl:'',flavorType:'',specific:'',other:''});
this.selectedDirections=[];
this.setDirections(type!=='Classic');
this.step=fruitHead?3:2
},
selectRefill(name,price,leaf){
Object.assign(this.order,{shishaType:leaf==='Blonde Leaf'?'Refill Blonde':'Refill Dark',shishaName:name,price,bowl:'',flavorType:'',specific:'',other:''});
this.selectedDirections=[];
this.setDirections(leaf!=='Blonde Leaf');
this.step=3
},
selectBowl(bowl){this.order.bowl=bowl;this.step=3},
toggleDirection(d){
this.order.flavorType='Direction';this.order.specific='';
const i=this.selectedDirections.indexOf(d);
if(i>-1)this.selectedDirections.splice(i,1);
else if(this.selectedDirections.length<3)this.selectedDirections.push(d)
},
selectSpecific(f){this.order.flavorType='Specific';this.order.specific=f;this.order.other='';this.selectedDirections=[]},
selectOther(){this.order.flavorType='Other';this.order.specific='';this.selectedDirections=[]},
selectOmakase(){this.order.flavorType='Omakase';this.order.specific='';this.order.other='';this.selectedDirections=[]},
nextFromFlavor(){if(this.canContinueFlavor)this.step=4},
toggleAddon(a){
const i=this.order.addons.findIndex(x=>x.name===a.name);
if(i>-1)this.order.addons.splice(i,1);else this.order.addons.push({name:a.name,price:a.price})
},
isAddonSelected(n){return this.order.addons.some(a=>a.name===n)},
toggleOtherAddon(){this.otherAddonEnabled=!this.otherAddonEnabled;if(!this.otherAddonEnabled)this.order.otherAddon=''},
itemQty(name){const item=this.basket.find(x=>x.name===name);return item?item.qty:0},
changeQty(item,delta){
  const i=this.basket.findIndex(x=>x.name===item.name);
  if(i<0 && delta>0){this.basket.push({...item,qty:1});return}
  if(i<0)return;
  this.basket[i].qty+=delta;
  if(this.basket[i].qty<=0)this.basket.splice(i,1);
},
generateRef(prefix){
  if(this.sessionRef)return `${prefix}-${this.sessionRef}`;
  const d=new Date();
  const stamp=`${String(d.getFullYear()).slice(-2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  this.sessionRef=`${stamp}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  this.persistState();
  return `${prefix}-${this.sessionRef}`;
},
persistState(){
  try{localStorage.setItem('hansumOrderV55',JSON.stringify({step:this.step,order:this.order,selectedDirections:this.selectedDirections,basket:this.basket,shishaSent:this.shishaSent,drinkSent:this.drinkSent,sessionRef:this.sessionRef,shishaOrderRef:this.shishaOrderRef,drinkOrderRef:this.drinkOrderRef,otherAddonEnabled:this.otherAddonEnabled}));}catch(e){}
},
restoreState(){
  try{
    const raw=localStorage.getItem('hansumOrderV55') || localStorage.getItem('hansumOrderV53'); if(!raw)return;
    const saved=JSON.parse(raw);
    if(saved.order)Object.assign(this.order,saved.order);
    if(Array.isArray(saved.selectedDirections))this.selectedDirections=saved.selectedDirections;
    if(Array.isArray(saved.basket))this.basket=saved.basket;
    this.shishaSent=!!saved.shishaSent; this.drinkSent=!!saved.drinkSent;
    this.sessionRef=saved.sessionRef||''; this.shishaOrderRef=saved.shishaOrderRef||''; this.drinkOrderRef=saved.drinkOrderRef||'';
    this.otherAddonEnabled=!!saved.otherAddonEnabled;
    if(this.shishaSent && !this.drinkSent && Number(saved.step)>=8)this.step=8;
    else if(this.drinkSent)this.step=11;
    else if(Number.isInteger(saved.step))this.step=Math.min(saved.step,10);
    if(this.order.shishaType)this.setDirections(this.order.shishaType!=='Classic');
  }catch(e){console.warn('Could not restore order',e)}
},
clearSavedOrder(){try{localStorage.removeItem('hansumOrderV55')}catch(e){}},
formatPrice(n){return Number(n).toLocaleString('en-US')},
back(){
if(this.step<=0)return;
if(this.tableLocked && this.step===1)return;
if(this.step===3&&(this.order.shishaType==='Fruit Head'||this.order.shishaType==='Refill Blonde'||this.order.shishaType==='Refill Dark')){this.step=1;return}
this.step--
},
async confirmOrder(){
  if(this.shishaSent)return;
  this.sending=true; this.sendMessage='';
  this.shishaOrderRef=this.generateRef('SH');
  const payload={type:'shisha',orderRef:this.shishaOrderRef,table:this.order.table,order:{...this.order,flavorType:this.flavorSummary},subtotal:this.totalPrice,total:this.totalPrice,vatNote:'Prices are exclusive of 8/10% VAT.',createdAt:new Date().toISOString()};
  try{
    await this.sendToTelegram(payload);
    this.shishaSent=true;this.sendMessage='';this.step=8;this.persistState();
  }catch(e){
    console.error(e);this.sendMessage='We could not send the order to our team. Please try again. Your selection is saved on this device.';
  }finally{this.sending=false}
},
startMoreOrder(){this.sendMessage='';this.step=9},
addMoreItem(item){
  const existing=this.basket.find(x=>x.name===item.name);
  if(existing)existing.qty++;else this.basket.push({...item,qty:1});
},
async sendFinalOrder(){
  if(!this.basketCount || this.drinkSent)return;
  this.sending=true;this.sendMessage='';
  this.drinkOrderRef=this.generateRef('AD');
  const payload={type:'additional-order',orderRef:this.drinkOrderRef,parentOrderRef:this.shishaOrderRef,table:this.order.table,basket:this.basket,subtotal:this.basketTotal,total:this.basketTotal,vatNote:'Prices are exclusive of 8/10% VAT.',createdAt:new Date().toISOString()};
  try{
    await this.sendToTelegram(payload);
    this.drinkSent=true;this.sendMessage='';this.step=11;this.persistState();
  }catch(e){
    console.error(e);this.sendMessage='We could not send the additional order to our team. Please try again. Your items are saved on this device.';
  }finally{this.sending=false}
},
async sendToTelegram(payload){
  const TELEGRAM_ENDPOINT=window.HANSUM_SAIGON_TELEGRAM_ENDPOINT||'';
  if(!TELEGRAM_ENDPOINT) throw new Error('Telegram endpoint is not configured');
  const res=await fetch(TELEGRAM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  if(!res.ok)throw new Error('Telegram endpoint error');
},
finish(){this.clearSavedOrder();window.location.href='index.html'},
initializeQrTable(){
  if(!hasQrTable)return;
  try{
    const raw=localStorage.getItem('hansumOrderV55');
    if(raw){
      const saved=JSON.parse(raw);
      if(saved.order && saved.order.table && String(saved.order.table).toUpperCase()!==qrTable){
        localStorage.removeItem('hansumOrderV55');
        this.order={table:qrTable,shishaType:'',shishaName:'',price:0,bowl:'',flavorType:'',specific:'',other:'',intensity:5,mint:0,addons:[],otherAddon:''};
        this.basket=[];this.shishaSent=false;this.drinkSent=false;this.sessionRef='';this.shishaOrderRef='';this.drinkOrderRef='';this.selectedDirections=[];this.flavorDirections=[];this.otherAddonEnabled=false;this.step=1;
      } else {
        this.restoreState();
        this.order.table=qrTable;
        if(this.step===0)this.step=1;
      }
    } else {this.order.table=qrTable;this.step=1;}
    this.persistState();
  }catch(e){this.order.table=qrTable;this.step=1;}
}
},
mounted(){
  try{const savedLocale=localStorage.getItem('hansumLocale');if(['en','zh','ko'].includes(savedLocale))this.locale=savedLocale}catch(e){}
  if(hasQrTable)this.initializeQrTable();
  else this.restoreState();
}
}).mount('#app');
