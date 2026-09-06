// HANSUM Telegram relay for Cloudflare Workers
// Set secrets in Cloudflare:
// TELEGRAM_BOT_TOKEN = your BotFather token
// TELEGRAM_CHAT_ID   = the staff/group chat ID

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response('', {headers: cors()});
    }
    if (request.method !== 'POST') return json({ok:false, error:'POST only'},405);
    try {
      const p = await request.json();
      const text = formatOrder(p);
      const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      const r = await fetch(url, {
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text,parse_mode:'HTML'})
      });
      const body = await r.text();
      return new Response(body,{status:r.status,headers:{...cors(),'content-type':'application/json'}});
    } catch(e) {
      return json({ok:false,error:String(e)},400);
    }
  }
};
function cors(){return {'access-control-allow-origin':'*','access-control-allow-methods':'POST,OPTIONS','access-control-allow-headers':'content-type'}}
function json(x,status=200){return new Response(JSON.stringify(x),{status,headers:{...cors(),'content-type':'application/json'}})}
function money(n){return Number(n||0).toLocaleString('en-US')+' VND'}
function esc(s){return String(s??'').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}
function formatOrder(p){
  const o=p.order||p.shisha||{};
  const lines=[];
  lines.push(`<b>HANSUM NEW ORDER</b>`);
  lines.push(`Table: <b>${esc(p.table||o.table||'-')}</b>`);
  lines.push(`Time: ${new Date(p.createdAt||Date.now()).toLocaleString('en-GB',{timeZone:'Asia/Ho_Chi_Minh'})}`);
  lines.push('');
  if(o.shishaName){
    lines.push(`<b>SHISHA</b>`);
    lines.push(`${esc(o.shishaName)} — ${money(o.price)}`);
    if(o.bowl) lines.push(`Bowl: ${esc(o.bowl)}`);
    if(o.specific||o.other||o.flavorType) lines.push(`Flavor: ${esc(o.specific||o.other||o.flavorType)}`);
    lines.push(`Strength: ${o.intensity||'-'} / 10 · Cooling: ${o.mint||0} / 10`);
    (o.addons||[]).forEach(a=>lines.push(`+ ${esc(a.name)} — ${money(a.price)}`));
  }
  if((p.basket||[]).length){
    lines.push(''); lines.push('<b>ADDITIONAL ITEMS</b>');
    p.basket.forEach(i=>lines.push(`${esc(i.name)} ×${i.qty} — ${money(i.price*i.qty)}`));
  }
  lines.push(''); lines.push(`<b>TOTAL: ${money(p.total)}</b>`);
  return lines.join('\n');
}
