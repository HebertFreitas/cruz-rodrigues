import { useEffect } from 'react';

// Observe individual pieces so tall sections also reveal naturally on mobile.
const groups = [
  ['.hero-brand, .hero-eyebrow, .hero-portrait, .hero-bottom > p', 100],
  ['.section-label', 0],
  ['.card-body h2, .card-details > p, .card-details .chips, .card-details .text-link', 70],
  ['.highlights-inner > .eyebrow, .highlights-inner > h2, .highlights-rule', 90],
  ['.highlight-card', 100],
  ['.contact-content > :not(address), .contact-content address > div', 70],
  ['.contact-form > .eyebrow, .contact-form > h3, .contact-form > p:not(.form-error), .contact-form-fields > label, .contact-form-submit', 65],
  ['.office-location-heading, .office-map, .map-caption', 90],
  ['.footer-main > *, .legal > *', 80],
];

export default function useSiteReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const targets = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

    groups.forEach(([selector, stagger]) => {
      document.querySelectorAll(selector).forEach((target, index) => {
        target.style.setProperty('--entrance-delay', `${(index % 4) * stagger}ms`);
        observer.observe(target);
        target.classList.add('motion-reveal');
        targets.push(target);
      });
    });

    const revealFocusedSection = event => {
      event.target.closest('section, footer')?.querySelectorAll('.motion-reveal').forEach(target => {
        target.classList.add('is-revealed');
        observer.unobserve(target);
      });
    };
    document.addEventListener('focusin', revealFocusedSection);

    return () => {
      observer.disconnect();
      document.removeEventListener('focusin', revealFocusedSection);
      targets.forEach(target => {
        target.classList.remove('motion-reveal', 'is-revealed');
        target.style.removeProperty('--entrance-delay');
      });
    };
  }, []);
}
