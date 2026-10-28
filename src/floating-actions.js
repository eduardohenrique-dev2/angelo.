// Angelo Studio — atalhos de WhatsApp e voltar ao topo.
// Suporta a posição da rolagem em Safari/iOS, Chrome/Android e desktop.
export function initFloatingActions() {
  const root = document.querySelector('.floating-actions');
  const top = root?.querySelector('.floating-top');
  const progress = root?.querySelector('.floating-progress-value');
  if (!root || !top || !progress) return;

  const SHOW_AFTER = 400;
  const circumference = 2 * Math.PI * 27;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  progress.style.strokeDasharray = String(circumference);

  let frame = 0;
  let hideTimer = 0;
  let visible = false;

  // Em diferentes navegadores mobile, o elemento que contém a
  // rolagem pode ser html, body ou document.scrollingElement.
  function readScrollTop() {
    return Math.max(
      0,
      Number(window.scrollY) || 0,
      Number(window.pageYOffset) || 0,
      Number(document.scrollingElement?.scrollTop) || 0,
      Number(document.documentElement.scrollTop) || 0,
      Number(document.body.scrollTop) || 0
    );
  }

  function updateVisibility(shouldShow) {
    if (shouldShow === visible && top.hidden === !shouldShow) return;
    visible = shouldShow;
    window.clearTimeout(hideTimer);

    if (shouldShow) {
      top.hidden = false;
      top.classList.remove('is-hiding');
      top.setAttribute('aria-hidden', 'false');
    } else if (top.hidden || reducedMotion.matches) {
      top.hidden = true;
      top.classList.remove('is-hiding');
      top.setAttribute('aria-hidden', 'true');
    } else {
      top.classList.add('is-hiding');
      top.setAttribute('aria-hidden', 'true');
      hideTimer = window.setTimeout(() => {
        if (!visible) {
          top.hidden = true;
          top.classList.remove('is-hiding');
        }
      }, 180);
    }
  }

  function render() {
    frame = 0;
    const y = readScrollTop();
    const max = Math.max(
      0,
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    ) - window.innerHeight;
    const ratio = max > 0 ? Math.max(0, Math.min(1, y / max)) : 0;

    progress.style.strokeDashoffset = String(circumference * (1 - ratio));
    updateVisibility(y > SHOW_AFTER);
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(render);
  }

  // scroll em window é suficiente na maioria dos casos; os ouvintes
  // adicionais cobrem rolagem e restauração de página no Safari móvel.
  window.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('scroll', schedule, { passive: true, capture: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('touchmove', schedule, { passive: true });
  window.addEventListener('touchend', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  window.addEventListener('orientationchange', schedule);
  document.addEventListener('visibilitychange', schedule);
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });

  top.addEventListener('click', () => {
    // Aproveita Lenis quando houver; no mobile permanece scroll nativo.
    if (typeof window.angeloScrollTo === 'function') {
      window.angeloScrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
    const skip = document.querySelector('a.skip');
    const focusTarget = skip || document.body;
    if (focusTarget === document.body && !focusTarget.hasAttribute('tabindex')) {
      focusTarget.setAttribute('tabindex', '-1');
    }
    focusTarget.focus({ preventScroll: true });
  });

  // Inicializa corretamente inclusive quando o Safari restaura a página.
  render();
  window.requestAnimationFrame(render);
}
