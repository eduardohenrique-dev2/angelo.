// Menu minimalista Angelo Studio — preserva tema, âncoras e posição do scroll.
export function initMenu() {
  const button = document.getElementById('menu');
  const dialog = document.getElementById('mobile-nav');
  const header = document.querySelector('.topbar');
  const themeButton = document.getElementById('theme');
  if (!button || !dialog || !header) return;

  const links = [...dialog.querySelectorAll('[data-menu-link]')];
  const sectionLinks = links.filter(a => a.hash && a.origin === location.origin);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const icon = (isOpen) => isOpen
    ? '<svg class="menu-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 18 18M18 6 6 18"/></svg>'
    : '<svg class="menu-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>';
  let isOpen = false;
  let scrollYBeforeOpen = 0;
  let opener = button;
  let closeTimer;

  function setActive(sectionId) {
    sectionLinks.forEach(link => {
      const current = link.hash === '#' + sectionId;
      link.classList.toggle('is-active', current);
      if (current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function scrollUnlock() {
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('left');
    document.body.style.removeProperty('right');
    document.body.style.removeProperty('width');
    window.scrollTo({top:scrollYBeforeOpen, behavior:'instant'});
  }

  function close({target=null, restoreFocus=true}={}) {
    if (!isOpen) return;
    isOpen = false;
    dialog.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-label','Abrir menu');
    button.innerHTML=icon(false);
    dialog.setAttribute('aria-hidden','true');
    dialog.inert=true;
    scrollUnlock();
    if (restoreFocus) opener.focus({preventScroll:true});
    clearTimeout(closeTimer);
    closeTimer=setTimeout(() => dialog.classList.remove('is-visible'),reduceMotion.matches?160:170);
    if (target) {
      requestAnimationFrame(() => {
        const offset=header.getBoundingClientRect().height+8;
        const top=target.getBoundingClientRect().top+window.scrollY-offset;
        window.scrollTo({top,behavior:reduceMotion.matches?'instant':'smooth'});
      });
    }
  }

  function open() {
    if (isOpen) return;
    clearTimeout(closeTimer);
    isOpen=true;
    scrollYBeforeOpen=window.scrollY;
    opener=document.activeElement instanceof HTMLElement?document.activeElement:button;
    dialog.style.setProperty('--menu-header-height',header.getBoundingClientRect().height+'px');
    document.body.style.position='fixed';
    document.body.style.top=-scrollYBeforeOpen+'px';
    document.body.style.left='0';
    document.body.style.right='0';
    document.body.style.width='100%';
    document.body.classList.add('menu-open');
    dialog.inert=false;
    dialog.removeAttribute('aria-hidden');
    dialog.classList.add('is-visible');
    button.setAttribute('aria-expanded','true');
    button.setAttribute('aria-label','Fechar menu');
    button.innerHTML=icon(true);
    requestAnimationFrame(() => dialog.classList.add('is-open'));
    links[0]?.focus({preventScroll:true});
  }

  button.addEventListener('click', () => isOpen?close():open());
  dialog.addEventListener('click', event => {
    if (event.target===dialog || event.target.classList.contains('menu-scroll') && !event.target.closest('a')) close();
  });
  links.forEach((link,index) => {
    link.style.setProperty('--stagger-index',index);
    link.addEventListener('click',event => {
      if (link.hash && link.origin === location.origin) {
        const target=document.getElementById(decodeURIComponent(link.hash.slice(1)));
        if (target) {
          event.preventDefault();
          history.pushState(null,'',link.hash);
          setActive(target.id);
          close({target});
          return;
        }
      }
      close();
    });
  });
  document.addEventListener('keydown',event => {
    if (!isOpen) return;
    if (event.key==='Escape') {
      event.preventDefault();close();return;
    }
    if (event.key!=='Tab') return;
    const focusable=[themeButton,button,...dialog.querySelectorAll('a[href]')].filter(Boolean).filter(el=>!el.disabled);
    const first=focusable[0],last=focusable.at(-1);
    if (event.shiftKey && document.activeElement===first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement===last) {event.preventDefault();first.focus();}
  });

  const sections=sectionLinks.map(link=>document.getElementById(link.hash.slice(1))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>{
      if (isOpen) return;
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>Math.abs(a.boundingClientRect.top)-Math.abs(b.boundingClientRect.top));
      if (visible[0]) setActive(visible[0].target.id);
    },{rootMargin:'-18% 0px -55% 0px',threshold:0});
    sections.forEach(section=>observer.observe(section));
  }
  setActive(sectionLinks.some(link=>link.hash===location.hash)?location.hash.slice(1):'inicio');
  window.addEventListener('hashchange',()=>{if(sectionLinks.some(link=>link.hash===location.hash))setActive(location.hash.slice(1))});
  window.addEventListener('pagehide',()=>{if(isOpen)close({restoreFocus:false})});
}
