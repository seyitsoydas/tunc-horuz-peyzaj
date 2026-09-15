'use strict';
const menuButton=document.querySelector('.menu-button');
const mainNav=document.querySelector('#main-nav');
function closeMenu(){menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Menüyü aç');mainNav?.classList.remove('is-open');document.body.classList.remove('menu-open');}
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç');mainNav.classList.toggle('is-open',open);document.body.classList.toggle('menu-open',open);if(open)requestAnimationFrame(()=>mainNav.querySelector('a')?.focus());});
mainNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mainNav?.classList.contains('is-open')){closeMenu();menuButton?.focus();}if(e.key==='Tab'&&mainNav?.classList.contains('is-open')){const focusable=[menuButton,...mainNav.querySelectorAll('a')];const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
window.addEventListener('resize',()=>{if(window.innerWidth>1000)closeMenu();},{passive:true});
const slides=[...document.querySelectorAll('.hero-slide')];
const slideProjects=[['Tunç Horuz','hakkimizda.html'],['Antakya Mimarlık Fakültesi','proje-antakya-mimarlik-fakultesi.html'],['Aegis Seyir Terası','proje-aegis-seyir-terasi.html']];
let currentSlide=0;
function showSlide(index){if(!slides.length)return;currentSlide=(index+slides.length)%slides.length;slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===currentSlide);slide.setAttribute('aria-hidden',String(i!==currentSlide));});const p=document.querySelector('#hero-project');p.textContent=slideProjects[currentSlide][0]+' ↗';p.href=slideProjects[currentSlide][1];document.querySelector('#hero-count').innerHTML=String(currentSlide+1).padStart(2,'0')+' <i>/ 03</i>';}
document.querySelector('[data-slide-prev]')?.addEventListener('click',()=>showSlide(currentSlide-1));
document.querySelector('[data-slide-next]')?.addEventListener('click',()=>showSlide(currentSlide+1));
const hero=document.querySelector('.hero');
const heroFilm=document.querySelector('.hero-film');
heroFilm?.addEventListener('loadeddata',()=>{heroFilm.play().catch(()=>{});});
let heroTouchX=null;
hero?.addEventListener('touchstart',event=>{heroTouchX=event.changedTouches[0].clientX;},{passive:true});
hero?.addEventListener('touchend',event=>{if(heroTouchX===null)return;const distance=event.changedTouches[0].clientX-heroTouchX;heroTouchX=null;if(Math.abs(distance)>50)showSlide(currentSlide+(distance<0?1:-1));},{passive:true});
const filterButtons=[...document.querySelectorAll('[data-filter]')];
filterButtons.forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.filter;filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('.portfolio-grid .project-card').forEach(card=>{card.hidden=key!=='all'&&card.dataset.category!==key;if(!card.hidden)count++;});document.querySelector('#filter-status').textContent=count+' proje gösteriliyor';}));
const gallery=[...document.querySelectorAll('[data-gallery]')];
const lightbox=document.querySelector('.lightbox');
let imageIndex=0;
function showImage(index){imageIndex=(index+gallery.length)%gallery.length;const source=gallery[imageIndex].querySelector('img');const img=lightbox.querySelector('img');img.src=source.currentSrc||source.src;img.alt=source.alt;lightbox.querySelector('figcaption').textContent=gallery[imageIndex].dataset.caption+' · '+(imageIndex+1)+' / '+gallery.length;lightbox.querySelector('.lightbox-prev').disabled=gallery.length<2;lightbox.querySelector('.lightbox-next').disabled=gallery.length<2;}
gallery.forEach((button,i)=>button.addEventListener('click',()=>{showImage(i);lightbox.showModal();document.body.classList.add('modal-open');}));
lightbox?.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
lightbox?.querySelector('.lightbox-prev').addEventListener('click',()=>showImage(imageIndex-1));
lightbox?.querySelector('.lightbox-next').addEventListener('click',()=>showImage(imageIndex+1));
lightbox?.addEventListener('close',()=>document.body.classList.remove('modal-open'));
lightbox?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showImage(imageIndex-1);}if(e.key==='ArrowRight'){e.preventDefault();showImage(imageIndex+1);}});
const briefForm=document.querySelector('#brief-form');
briefForm?.addEventListener('submit',event=>{event.preventDefault();if(!briefForm.reportValidity())return;const data=new FormData(briefForm);const text=['TUNÇ HORUZ — PROJE NOTU','',...Object.entries({name:'Ad soyad',email:'E-posta',type:'Çalışma türü',location:'Konum',area:'Yaklaşık alan',message:'Proje hakkında'}).map(([key,label])=>label+': '+(data.get(key)||'Belirtilmedi')),'','Bu özet cihazınızda oluşturulmuştur; herhangi bir alıcıya gönderilmemiştir.'].join('\n');const url=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='tunc-horuz-proje-notu.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#form-status').textContent='Proje özetiniz hazırlandı ve indirme başlatıldı. Herhangi bir mesaj gönderilmedi.';});

const siteHeader=document.querySelector('.site-header');
function updateHeader(){siteHeader?.classList.toggle('is-scrolled',window.scrollY>70);}
updateHeader();
window.addEventListener('scroll',updateHeader,{passive:true});

const revealTargets=document.querySelectorAll('.home-intro>*,.section-title>*,.project-card,.service-layout>*,.manifesto>div,.editorial>*,.values-grid article,.split-feature>*,.service-detail>*,.process-list article,.project-story>*,.project-support>*,.contact-layout>*');
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.12});
  revealTargets.forEach((target,index)=>{target.classList.add('js-reveal');target.style.transitionDelay=(index%3)*70+'ms';revealObserver.observe(target);});
}

if(slides.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  let autoplay=setInterval(()=>showSlide(currentSlide+1),6500);
  document.querySelector('.hero')?.addEventListener('mouseenter',()=>clearInterval(autoplay));
  document.querySelector('.hero')?.addEventListener('mouseleave',()=>{clearInterval(autoplay);autoplay=setInterval(()=>showSlide(currentSlide+1),6500);});
}
