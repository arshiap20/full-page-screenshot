const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const page = document.getElementById('finder-page');
const readout = document.getElementById('finder-readout');
const label = document.getElementById('finder-label');
const size = document.getElementById('finder-size');
const WIDTH = 1280;
const HEIGHT = 4881;
const SCROLL_MS = 5200;
const HOLD_MS = 1800;
const RESET_MS = 600;

if (page && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
  let start = performance.now();

  function frame(now) {
    const screen = page.parentElement.clientHeight;
    const travel = Math.max(0, page.clientHeight - screen);
    const t = now - start;
    let progress;
    if (t < SCROLL_MS) progress = ease(t / SCROLL_MS);
    else if (t < SCROLL_MS + HOLD_MS) progress = 1;
    else if (t < SCROLL_MS + HOLD_MS + RESET_MS) progress = 1 - ease((t - SCROLL_MS - HOLD_MS) / RESET_MS);
    else { start = now; progress = 0; }

    page.style.transform = `translateY(${-travel * progress}px)`;
    const capturing = t < SCROLL_MS;
    const seen = page.clientHeight ? (screen + travel * progress) / page.clientHeight : 1;
    readout.classList.toggle('saved', !capturing);
    label.textContent = capturing ? 'Capturing' : 'Saved';
    size.textContent = `${WIDTH} × ${capturing ? Math.round(HEIGHT * Math.min(1, seen)) : HEIGHT} px`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
