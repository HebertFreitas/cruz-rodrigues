(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const year = document.getElementById('year');
  year.textContent = String(new Date().getFullYear());
  const dialog = document.getElementById('contact-dialog');
  document.querySelectorAll('[data-open-contact]').forEach(button => {
    button.addEventListener('click', () => dialog.showModal());
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => dialog.close()));
  let lenis;
  if (window.Lenis && !reducedMotion.matches) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, anchors: true });
    const animate = time => { lenis.raf(time); requestAnimationFrame(animate); };
    requestAnimationFrame(animate);
  }
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: target.classList.contains('practice-card') ? -80 : 0 });
      else target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      history.replaceState(null, '', link.hash);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.body.classList.add('js-motion');
    document.querySelectorAll('.reveal-section').forEach(section => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => section.classList.toggle('is-visible', entry.isIntersecting));
      }, { threshold: window.innerWidth <= 700 ? 0.05 : 0.2 });
      observer.observe(section);
    });
  }
  const cards = [...document.querySelectorAll('.practice-card')];
  let scheduled = false;
  function updateCards() {
    scheduled = false;
    const viewport = window.innerHeight;
    const stickyTop = window.innerWidth <= 767 ? 60 : window.innerWidth <= 991 ? 80 : 100;
    cards.forEach((card, index) => {
      const surface = card.querySelector('.card-surface');
      if (reducedMotion.matches) { surface.style.transform = ''; surface.style.opacity = ''; return; }
      const raw = Math.min(1, Math.max(0, (viewport - card.getBoundingClientRect().top) / (viewport - stickyTop)));
      const progress = 1 - Math.pow(1 - raw, 2.5);
      const next = cards[index + 1];
      const covered = next ? Math.min(1, Math.max(0, (viewport * 0.65 - next.getBoundingClientRect().top) / (viewport * 0.65 - stickyTop))) : 0;
      surface.style.transform = `translate3d(0,${(1 - progress) * 50}px,0) rotateX(${(1 - progress) * 8}deg) scale(${1 - (1 - progress) * 0.04 - covered * 0.035})`;
      surface.style.opacity = String(0.5 + progress * 0.5 - covered * 0.12);
    });
  }
  const scheduleUpdate = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateCards); } };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && lenis) { lenis.destroy(); lenis = null; }
    scheduleUpdate();
  });
  updateCards();
})();
