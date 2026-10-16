import { useEffect, useRef } from 'react';

const numberFormat = new Intl.NumberFormat('pt-BR');

export default function CountUp({ value }) {
  const numberRef = useRef(null);

  useEffect(() => {
    const element = numberRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return;

    const target = Number(value.replace(/\D/g, ''));
    const prefix = value.startsWith('+') ? '+' : '';
    const minimumDigits = value.startsWith('0') ? value.length : 1;
    const format = number => prefix + numberFormat.format(number).padStart(minimumDigits, '0');
    let frame = 0;
    let startedAt;
    let started = false;

    const animate = timestamp => {
      startedAt ??= timestamp;
      const progress = Math.min(1, (timestamp - startedAt) / 1800);
      element.textContent = format(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(animate);
      else element.textContent = value;
    };

    element.textContent = format(0);
    const observer = new IntersectionObserver(entries => {
      if (started || !entries.some(entry => entry.isIntersecting)) return;
      started = true;
      observer.disconnect();
      frame = requestAnimationFrame(animate);
    }, { threshold: 0.6 });
    observer.observe(element);

    const finishOnReducedMotion = () => {
      if (!preference.matches) return;
      observer.disconnect();
      cancelAnimationFrame(frame);
      element.textContent = value;
    };
    preference.addEventListener('change', finishOnReducedMotion);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      preference.removeEventListener('change', finishOnReducedMotion);
      element.textContent = value;
    };
  }, [value]);

  return <span ref={numberRef} aria-hidden="true">{value}</span>;
}
