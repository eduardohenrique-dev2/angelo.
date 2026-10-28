// Angelo Studio — somente os dois atalhos flutuantes.
export function initFloatingActions() {
  const root = document.querySelector('.floating-actions');
  const top = root?.querySelector('.floating-top');
  const progress = root?.querySelector('.floating-progress-value');
  if (!root || !top || !progress) return;

  const circumference = 2 * Math.PI * 27;
  progress.style.strokeDasharray = String(circumference);
  let frame = 0;
  let hideTimer = null;
  let topVisible = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function render() {
    frame = 0;
    const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const ratio = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    progress.style.strokeDashoffset = String(circumference * (1 - ratio));

    const shouldShow = scrollY > 400;
    if (shouldShow === topVisible) return;
    topVisible = shouldShow;
    clearTimeout(hideTimer);
    if (shouldShow) {
      top.classList.remove('is-hiding');
      top.hidden = false;
    } else if (reducedMotion.matches) {
      top.hidden = true;
    } else {
      top.classList.add('is-hiding');
      hideTimer = setTimeout(() => {
        if (!topVisible) {
          top.hidden = true;
          top.classList.remove('is-hiding');
        }
      }, 150);
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }
  addEventListener('scroll', schedule, { passive:true });
  addEventListener('resize', schedule, { passive:true });
  top.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:reducedMotion.matches?'instant':'smooth' });
    const skip = document.querySelector('a.skip');
    const focusTarget = skip || document.body;
    if (focusTarget === document.body && !focusTarget.hasAttribute('tabindex')) {
      focusTarget.setAttribute('tabindex','-1');
    }
    focusTarget.focus({ preventScroll:true });
  });
  render();
}
