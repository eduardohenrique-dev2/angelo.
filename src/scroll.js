/* ANGELO STUDIO — motion progressivo.
   CDN ausente ou reduced-motion: conteúdo permanece visível e navegação nativa. */
const smallScreen = () => window.matchMedia('(max-width: 767px)').matches;
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const headerOffset = () => (document.querySelector('.topbar')?.getBoundingClientRect().height || 76) + 12;
let engine = null;
let lenisInstance = null;

function nativeScroll(target, offset = -headerOffset()) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  const y = typeof element === 'number'
    ? element
    : element?.getBoundingClientRect().top + window.scrollY + offset;
  if (Number.isFinite(y)) {
    window.scrollTo({ top: Math.max(0, y), behavior: reduce() ? 'instant' : 'smooth' });
  }
}
export function initSmoothScroll() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  window.angeloScrollTo = nativeScroll;
  if (!gsap || !ScrollTrigger) return null;
  gsap.registerPlugin(ScrollTrigger);
  engine = { gsap, ScrollTrigger };
  if (reduce() || smallScreen() || !window.Lenis) return null;
  const lenis = new window.Lenis({
    duration: 1.08,
    smoothWheel: true,
    smoothTouch: false,
    syncTouch: false,
    wheelMultiplier: 1,
    lerp: .12
  });
  lenisInstance = lenis;
  window.angeloLenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.angeloScrollTo = (target, offset = -headerOffset()) => {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    lenis.scrollTo(element || 0, { offset, duration:1.05 });
  };
  return lenis;
}
function withWillChange(target, anim, properties = 'transform,opacity') {
  return Object.assign({
    onStart(){target.style.willChange = properties},
    onComplete(){target.style.willChange = ''}
  },anim);
}
function splitWords(heading) {
  if (heading.dataset.wordsReady) return;
  heading.dataset.wordsReady = 'true';
  const spoken = heading.textContent.replace(/\s+/g,' ').trim();
  heading.setAttribute('aria-label',spoken);
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.nodeValue.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {fragment.append(document.createTextNode(part));continue}
      const mask=document.createElement('span');
      mask.className='word-mask';mask.setAttribute('aria-hidden','true');
      const word=document.createElement('span');
      word.className='word';word.textContent=part;
      mask.append(word);fragment.append(mask);
    }
    node.replaceWith(fragment);
  }
}
function animateText() {
  if (!engine || reduce()) return;
  const {gsap}=engine;
  document.querySelectorAll('h1,.section h2,.contact h2').forEach(heading=>{
    splitWords(heading);
    const words=[...heading.querySelectorAll('.word')];
    const accent=words.filter(word=>word.closest('em') || (word.closest('.hero-highlight')));
    const normal=words.filter(word=>!accent.includes(word));
    const tl=gsap.timeline({scrollTrigger:{trigger:heading,start:'top 90%',once:true}});
    if(normal.length)tl.from(normal,{yPercent:105,opacity:0,duration:.75,ease:'power3.out',stagger:.06,immediateRender:false},0);
    if(accent.length)tl.from(accent,{yPercent:105,opacity:0,duration:.75,ease:'power3.out',stagger:.06,immediateRender:false},Math.max(.18,normal.length*.025));
  });
}
function cascade(selector,triggerSelector) {
  if (!engine || reduce()) return;
  const {gsap}=engine;
  const items=[...document.querySelectorAll(selector)];
  if(!items.length)return;
  const group=triggerSelector?document.querySelector(triggerSelector):items[0];
  if(!group)return;
  gsap.from(items,{
    opacity:0,y:smallScreen()?20:30,duration:.72,stagger:.08,ease:'power3.out',
    immediateRender:false,
    scrollTrigger:{trigger:group,start:'top 90%',once:true}
  });
}
export function initReveals() {
  const targets=[...document.querySelectorAll('.section-intro.reveal,.quote-form.reveal,.quote-aside.reveal,.about-visual.reveal,.about-copy.reveal,.contact-inside.reveal')];
  if(!engine)return;
  const {gsap}=engine;
  if(reduce()){
    // Acessibilidade: somente fade de até 200ms.
    targets.forEach(el=>gsap.fromTo(el,{opacity:.7},{opacity:1,duration:.2,immediateRender:false}));
    return;
  }
  targets.forEach(el=>{
    gsap.fromTo(el,{opacity:0,y:smallScreen()?20:40},{
      ...withWillChange(el,{opacity:1,y:0,duration:.8,ease:'power3.out',immediateRender:false,
        scrollTrigger:{trigger:el,start:'top 90%',once:true}}),
    });
  });
  cascade('.service-grid .service-card','.service-grid');
  cascade('.pain-grid article','.pain-grid');
  cascade('.about-highlights > div','.about-highlights');
  cascade('.quote-form .form-field','.quote-form');
  animateText();
}
export function initHero() {
  if(!engine||reduce())return;
  const {gsap}=engine;
  const hero=document.querySelector('.hero');
  const visual=document.querySelector('.hero-brand-composition');
  const copy=document.querySelector('.hero-copy .lead');
  const actions=document.querySelector('.hero-actions');
  if(!hero)return;
  if(copy)gsap.from(copy,{opacity:0,y:20,duration:.75,delay:.12,ease:'power3.out',immediateRender:false});
  if(actions)gsap.from(actions,{opacity:0,y:20,duration:.75,delay:.2,ease:'power3.out',immediateRender:false});
  const mm=gsap.matchMedia();
  mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)',()=>{
    if(visual)gsap.to(visual,{y:-60,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.7}});
    if(copy)gsap.to(copy,{y:-25,opacity:.68,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.65}});
  });
}
export function initMarquee() {
  if(!engine||reduce())return;
  const {gsap,ScrollTrigger}=engine;
  const row=document.querySelector('.ticker-inner');
  if(!row)return;
  const loop=gsap.to(row,{xPercent:-50,duration:26,ease:'none',repeat:-1});
  let velocityReset;
  ScrollTrigger.create({
    start:0,end:'max',
    onUpdate(self){
      const velocity=Math.min(3,Math.abs(self.getVelocity())/1800);
      const direction=self.direction<0?-1:1;
      gsap.to(loop,{timeScale:direction*(1+velocity),duration:.3,overwrite:true});
      clearTimeout(velocityReset);
      velocityReset=setTimeout(()=>gsap.to(loop,{timeScale:direction,duration:.8,overwrite:true}),160);
    }
  });
}
export function initGallery() {
  const gallery=document.querySelector('#project-grid');
  if(!gallery)return;
  const {gsap,ScrollTrigger}=engine||{};
  let active=[];
  let mediaScope=null;
  function refreshGallery(){
    active.forEach(tween=>tween.kill());
    active=[];
    mediaScope?.revert();
    mediaScope=null;
    if(!gsap||reduce())return;
    const cards=[...gallery.querySelectorAll('.expand-card')];
    if(!cards.length)return;
    const first=gsap.from(cards,{
      scale:.96,opacity:0,duration:.65,stagger:.075,ease:'power3.out',immediateRender:false,
      scrollTrigger:{trigger:gallery,start:'top 90%',once:true}
    });
    active.push(first);
    mediaScope=gsap.matchMedia();
    mediaScope.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)',()=>{
      cards.forEach(card=>{
        const img=card.querySelector('img');
        if(!img)return;
        gsap.fromTo(img,{yPercent:2},{yPercent:-2,ease:'none',immediateRender:false,
          scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:.8}});
      });
    });
    ScrollTrigger.refresh();
  }
  document.addEventListener('portfolio:updated',()=>{
    // Aguarda o DOM e o layout se estabilizarem após a troca de filtro.
    requestAnimationFrame(()=>requestAnimationFrame(refreshGallery));
  });
  gallery.addEventListener('load',()=>{
    if(ScrollTrigger)ScrollTrigger.refresh();
  },true);
  refreshGallery();
}
export function initCTA() {
  if(!engine||reduce())return;
  const {gsap}=engine;
  const contact=document.querySelector('.contact');
  if(!contact)return;
  gsap.fromTo(contact,{clipPath:'inset(3% 3% round 32px)'},{
    clipPath:'inset(0% 0% round 0px)',immediateRender:false,ease:'none',
    scrollTrigger:{trigger:contact,start:'top 95%',end:'top 35%',scrub:true}
  });
}
export function initHeader() {
  const header=document.querySelector('.topbar');
  const progress=document.querySelector('#progress');
  if(!header||!progress)return;
  const apply=(y,direction,max)=>{
    header.classList.toggle('is-condensed',y>90&&direction>0);
    progress.style.transform='scaleX('+(max>0?Math.min(1,y/max):0)+')';
  };
  if(engine&&!reduce()){
    const {ScrollTrigger}=engine;
    ScrollTrigger.create({start:0,end:()=>Math.max(1,document.documentElement.scrollHeight-innerHeight),
      onUpdate:self=>apply(self.scroll(),self.direction,document.documentElement.scrollHeight-innerHeight)});
  }else{
    let last=window.scrollY,frame=0;
    const sync=()=>{
      frame=0;const y=window.scrollY;
      apply(y,y>=last?1:-1,document.documentElement.scrollHeight-innerHeight);
      last=y;
    };
    addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(sync)},{passive:true});
    sync();
  }
}
export function initScrollExperience() {
  document.documentElement.classList.add('js');
  initSmoothScroll();
  initReveals();
  initHero();
  initMarquee();
  initGallery();
  initCTA();
  initHeader();
  if(engine){
    window.addEventListener('load',()=>engine.ScrollTrigger.refresh(),{once:true});
    window.addEventListener('resize',()=>engine.ScrollTrigger.refresh(),{passive:true});
  }
  return {lenis:lenisInstance,ready:Boolean(engine)};
}
