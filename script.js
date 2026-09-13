(function(){
  const slides=[...document.querySelectorAll('.gallery-slide')];
  const dots=[...document.querySelectorAll('.dot')];
  if(!slides.length)return;
  let i=0,timer;
  function show(n){i=(n+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('active',k===i));dots.forEach((d,k)=>d.classList.toggle('active',k===i));}
  document.querySelector('.gallery-prev')?.addEventListener('click',()=>{show(i-1);restart()});
  document.querySelector('.gallery-next')?.addEventListener('click',()=>{show(i+1);restart()});
  dots.forEach((d,k)=>d.addEventListener('click',()=>{show(k);restart()}));
  function restart(){clearInterval(timer);timer=setInterval(()=>show(i+1),4500)}
  restart();
  const menu=document.querySelector('.menu-btn');
  const backdrop=document.querySelector('.mobile-nav-backdrop');
  const nav=document.querySelector('.mobile-nav');
  function setMenu(open){
    document.body.classList.toggle('menu-open',open);
    if(menu){menu.textContent=open?'✕':'☰';menu.setAttribute('aria-expanded',open?'true':'false')}
  }
  if(menu){
    menu.addEventListener('click',()=>{setMenu(!document.body.classList.contains('menu-open'))});
    backdrop?.addEventListener('click',()=>setMenu(false));
    nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape')setMenu(false)});
  }
})();
