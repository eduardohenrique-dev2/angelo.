// Angelo Studio — isolated full-screen menu controller (V8)
export function initMenu() {
  const trigger = document.getElementById('menu');
  const dialog = document.getElementById('mobile-nav');
  const closeButton = document.getElementById('menu-close');
  const backdrop = document.getElementById('menu-backdrop');
  const themeButton = document.getElementById('menu-theme');
  const headerTheme = document.getElementById('theme');
  if (![trigger, dialog, closeButton, backdrop, themeButton].every(Boolean)) return;

  const links = [...dialog.querySelectorAll('[data-menu-link]')];
  const allLinks = [...dialog.querySelectorAll('a[href]')];
  const sectionLinks = links.filter(link => link.hash && link.origin === location.origin);
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.topbar');
  let open = false;
  let savedScroll = 0;
  let previousFocus = null;
  let closingTimer = 0;

  function setIcon(button, name) {
    button.innerHTML = '<i class="bi bi-' + name + '" aria-hidden="true"></i>';
  }
  function syncThemeButton() {
    const light = document.body.classList.contains('light');
    themeButton.setAttribute('aria-label', light ? 'Ativar tema escuro' : 'Ativar tema claro');
    setIcon(themeButton, light ? 'moon-stars' : 'sun');
  }
  syncThemeButton();
  themeButton.addEventListener('click', () => {
    headerTheme?.click();
    syncThemeButton();
  });

  function restoreScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo({ top: savedScroll, behavior: 'instant' });
  }

  function closeMenu({ restoreFocus = true, target = null } = {}) {
    if (!open) return;
    open = false;
    dialog.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Abrir menu');
    setIcon(trigger, 'list');

    dialog.inert = true;
    dialog.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
    restoreScroll();

    if (restoreFocus) (previousFocus?.isConnected ? previousFocus : trigger).focus({ preventScroll: true });
    const duration = prefersReducedMotion.matches ? 0 : 260;
    clearTimeout(closingTimer);
    closingTimer = window.setTimeout(() => {
      if (!open) dialog.classList.remove('is-visible');
    }, duration);

    if (target) {
      requestAnimationFrame(() => {
        const offset = (header?.getBoundingClientRect().height || 72) + 10;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: prefersReducedMotion.matches ? 'instant' : 'smooth' });
      });
    }
  }

  function openMenu() {
    if (open) return;
    clearTimeout(closingTimer);
    savedScroll = window.scrollY;
    previousFocus = document.activeElement;
    const rect = trigger.getBoundingClientRect();
    dialog.style.setProperty('--reveal-x', rect.left + rect.width / 2 + 'px');
    dialog.style.setProperty('--reveal-y', rect.top + rect.height / 2 + 'px');
    dialog.style.setProperty('--menu-header-height', (header?.getBoundingClientRect().height || 72) + 'px');
    document.body.style.position = 'fixed';
    document.body.style.top = -savedScroll + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.classList.add('menu-open');

    open = true;
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-label', 'Fechar menu');
    setIcon(trigger, 'x-lg');
    dialog.inert = false;
    dialog.removeAttribute('aria-hidden');
    backdrop.setAttribute('aria-hidden', 'false');
    dialog.classList.add('is-visible');
    syncThemeButton();
    requestAnimationFrame(() => dialog.classList.add('is-open'));
    closeButton.focus({ preventScroll: true });
  }

  trigger.addEventListener('click', () => open ? closeMenu({ restoreFocus: true }) : openMenu());
  closeButton.addEventListener('click', () => closeMenu({ restoreFocus: true }));
  backdrop.addEventListener('click', () => closeMenu({ restoreFocus: true }));
  dialog.addEventListener('click', event => {
    if (event.target === dialog || event.target.classList.contains('menu-shell')) {
      closeMenu({ restoreFocus: true });
    }
  });
  allLinks.forEach(link => link.addEventListener('click', event => {
    if (link.hash && link.origin === location.origin) {
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (target) {
        event.preventDefault();
        history.pushState(null, '', link.hash);
        closeMenu({ restoreFocus: false, target });
        return;
      }
    }
    closeMenu({ restoreFocus: false });
  }));
  dialog.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function setActive(id) {
    for (const link of sectionLinks) {
      const isActive = link.hash === '#' + id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  }
  const sections = sectionLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (open) return;
      const candidates = entries.filter(entry => entry.isIntersecting);
      if (candidates.length) {
        candidates.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        setActive(candidates[0].target.id);
      }
    }, { rootMargin: '-18% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
  setActive(location.hash.slice(1) || 'inicio');
  addEventListener('hashchange', () => {
    if (sectionLinks.some(link => link.hash === location.hash)) setActive(location.hash.slice(1));
  });
  addEventListener('pagehide', () => {
    if (open) closeMenu({ restoreFocus: false });
  });
}
