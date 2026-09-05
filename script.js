document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const el=document.querySelector(a.getAttribute("href"));if(el){e.preventDefault();el.scrollIntoView({behavior:"smooth"})}}));

// HANSUM hero crossfade
(function(){
  const groups=[document.querySelectorAll('.hero-left-slides .hero-slide'),document.querySelectorAll('.hero-right-slides .hero-slide')];
  if(groups[0].length || groups[1].length){
    let i=0;
    setInterval(()=>{i=(i+1)%2;groups.forEach(g=>g.forEach((el,n)=>el.classList.toggle('active',n===i)));},6500);
  }
})();

// HANSUM gallery: one photo at a time, auto fade + manual arrows
(function(){
  const slides=[...document.querySelectorAll('.gallery-slide')], dots=[...document.querySelectorAll('.gallery-dots .dot')];
  if(!slides.length)return;
  let i=0, timer;
  function show(n){i=(n+slides.length)%slides.length;slides.forEach((s,k)=>s.classList.toggle('active',k===i));dots.forEach((d,k)=>d.classList.toggle('active',k===i));}
  function restart(){clearInterval(timer);timer=setInterval(()=>show(i+1),5000)}
  document.querySelector('.gallery-prev')?.addEventListener('click',()=>{show(i-1);restart()});
  document.querySelector('.gallery-next')?.addEventListener('click',()=>{show(i+1);restart()});
  dots.forEach((d,k)=>d.addEventListener('click',()=>{show(k);restart()}));
  restart();
})();
