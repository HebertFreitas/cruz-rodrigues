import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function usePageMotion() {
  const smoothScrollRef = useRef(null);
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cards = [...document.querySelectorAll('.practice-card')];
    const observers = [];
    let lenis;
    let animationFrame = 0;
    let cardFrame = 0;

    const updateCards = () => {
      cardFrame = 0;
      const viewport = window.innerHeight;
      const stickyTop = window.innerWidth <= 767 ? 60 : window.innerWidth <= 991 ? 80 : 100;
      cards.forEach(card => {
        const surface = card.querySelector('.card-surface');
        if (reducedMotion.matches) {
          surface.style.transform = '';
          surface.style.opacity = '';
          return;
        }
        const raw = Math.min(1, Math.max(0, (viewport - card.getBoundingClientRect().top) / (viewport - stickyTop)));
        const progress = 1 - Math.pow(1 - raw, 2.5);
        const mobile = window.innerWidth <= 767;
        const rotate = (1 - progress) * (mobile ? 30 : 80);
        const translate = (1 - progress) * (mobile ? 24 : 60);
        const scale = 1 + (1 - progress) * (mobile ? 0.03 : 0.08);
        surface.style.transform = raw >= 1
          ? 'translate3d(0, 0, 0) rotateX(0deg) scale(1)'
          : `translate3d(0, ${translate}px, 0) rotateX(${rotate}deg) scale(${scale})`;
        surface.style.opacity = String(0.4 + progress * 0.6);
      });
    };
    const scheduleUpdate = () => {
      if (!cardFrame) cardFrame = requestAnimationFrame(updateCards);
    };
    const configureMotion = () => {
      cancelAnimationFrame(animationFrame);
      lenis?.destroy();
      lenis = undefined;
      smoothScrollRef.current = null;
      if (!reducedMotion.matches) {
        lenis = new Lenis({
          duration: 1.1,
          easing: time => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          syncTouch: false,
          touchMultiplier: 1.2,
          infinite: false,
        });
        smoothScrollRef.current = lenis;
        lenis.on('scroll', scheduleUpdate);
        const animate = time => {
          lenis.raf(time);
          animationFrame = requestAnimationFrame(animate);
        };
        animationFrame = requestAnimationFrame(animate);
      }
      scheduleUpdate();
    };
    const onAnchorClick = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: target.classList.contains('practice-card') ? -80 : 0 });
      else target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      history.replaceState(null, '', link.hash);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };

    if ('IntersectionObserver' in window) {
      document.body.classList.add('js-motion');
      document.querySelectorAll('.reveal-section').forEach(section => {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            section.classList.toggle('is-visible', entry.isIntersecting);
            if (section.id === 'contato') document.body.classList.toggle('contact-in-view', entry.isIntersecting);
          });
        }, { threshold: section.classList.contains('about') && window.innerWidth <= 700 ? 0.05 : 0.2 });
        observer.observe(section);
        observers.push(observer);
      });
    }
    configureMotion();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    document.addEventListener('click', onAnchorClick);
    reducedMotion.addEventListener('change', configureMotion);

    return () => {
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(cardFrame);
      lenis?.destroy();
      smoothScrollRef.current = null;
      observers.forEach(observer => observer.disconnect());
      document.body.classList.remove('js-motion', 'contact-in-view');
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      document.removeEventListener('click', onAnchorClick);
      reducedMotion.removeEventListener('change', configureMotion);
    };
  }, []);
  return smoothScrollRef;
}
