/* Intro da angelo. — independente de CDN, sem armazenamento entre visitas. */
let activeIntro = null;
let savedMarkup = '';
let historyListenerInstalled = false;

function announceDone(skipped) {
  window.__angeloIntroCompleted = true;
  window.dispatchEvent(new CustomEvent('intro:done', {
    detail: { skipped: Boolean(skipped) }
  }));
}

export function finishIntro(skipped = false) {
  const state = activeIntro;
  if (!state || state.finished) return;

  state.finished = true;
  activeIntro = null;

  state.timers.forEach(id => window.clearTimeout(id));
  window.removeEventListener('keydown', state.onKeyDown, true);
  state.button.removeEventListener('click', state.onSkip);

  state.overlay.setAttribute('aria-hidden', 'true');
  delete window.angeloIntroSkip;
  state.overlay.classList.add('is-complete');
  document.documentElement.classList.remove('intro-locked');
  document.body.classList.remove('intro-active');

  for (const [element, wasInert] of state.inerted) {
    element.inert = wasInert;
  }

  const restoreFocus = state.overlay.contains(document.activeElement);
  state.overlay.remove();

  if (restoreFocus) {
    const skipLink = document.querySelector('a.skip');
    if (skipLink) skipLink.focus({ preventScroll: true });
  }

  announceDone(skipped);
}

export function skipIntro() {
  finishIntro(true);
}

export function initIntro() {
  // Os controles precoces do HTML deixam de ser necessários depois do carregamento do módulo.
  window.__angeloIntroBootCleanup?.();
  delete window.__angeloIntroBootCleanup;
  const overlay = document.getElementById('site-intro');
  if (!overlay) {
    if (!window.__angeloIntroCompleted) announceDone(true);
    return;
  }
  window.__angeloIntroCompleted = false;
  window.angeloIntroSkip = skipIntro;
  if (activeIntro) return;

  savedMarkup = overlay.outerHTML;
  const button = overlay.querySelector('.intro-skip');
  const dot = overlay.querySelector('.intro-symbol-dot');

  if (!button || !dot) {
    overlay.remove();
    announceDone(true);
    return;
  }

  const startedAt = Number(window.__angeloIntroStart) || performance.now();
  const elapsed = Math.max(0, performance.now() - startedAt);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state = {
    overlay,
    button,
    finished: false,
    timers: [],
    inerted: [],
    onKeyDown: null,
    onSkip: null
  };
  activeIntro = state;

  // Mantém o foco apenas na intro; preserva os estados inert originais.
  for (const element of document.body.children) {
    if (element === overlay || element.tagName === 'SCRIPT' || element.tagName === 'STYLE') continue;
    state.inerted.push([element, element.inert]);
    element.inert = true;
  }
  document.documentElement.classList.add('intro-locked');
  document.body.classList.add('intro-active');

  // A expansão azul nasce exatamente no centro do ponto do SVG.
  function placeOrigin() {
    if (state.finished) return;
    const dotRect = dot.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    overlay.style.setProperty('--intro-origin-x', (dotRect.left + dotRect.width / 2 - overlayRect.left) + 'px');
    overlay.style.setProperty('--intro-origin-y', (dotRect.top + dotRect.height / 2 - overlayRect.top) + 'px');
  }
  placeOrigin();

  state.onSkip = () => skipIntro();
  state.onKeyDown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      skipIntro();
    }
    if (event.key === 'Tab') {
      // O botão Pular é o único controle interativo durante a intro.
      event.preventDefault();
      button.focus({ preventScroll: true });
    }
  };

  button.addEventListener('click', state.onSkip);
  window.addEventListener('keydown', state.onKeyDown, true);

  function after(ms, callback) {
    state.timers.push(window.setTimeout(callback, Math.max(0, ms - elapsed)));
  }

  if (elapsed >= 3000) {
    // Caso os módulos tenham demorado a carregar, a proteção CSS já liberou a tela.
    finishIntro(true);
  } else if (reducedMotion) {
    after(600, () => overlay.classList.add('intro-leaving'));
    after(800, () => finishIntro());
  } else {
    after(1580, placeOrigin);
    after(2040, () => overlay.classList.add('intro-leaving'));
    after(2200, () => finishIntro());
  }

  // Segurança absoluta: nenhuma dependência de fontes, imagens ou GSAP.
  if (!state.finished) after(4000, () => finishIntro(true));

  // Retorno do histórico (bfcache) conta como uma nova abertura.
  if (!historyListenerInstalled) {
    historyListenerInstalled = true;
    window.addEventListener('pageshow', event => {
      if (!event.persisted || document.getElementById('site-intro')) return;
      document.body.insertAdjacentHTML('afterbegin', savedMarkup);
      window.__angeloIntroStart = performance.now();
      initIntro();
    });
  }
}
