import { useEffect, useRef } from 'react';

export default function useTeamReveal() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) return;

    const targets = [...section.querySelectorAll('[data-team-reveal]')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(target => observer.observe(target));
    section.classList.add('team-motion');

    // Keyboard navigation should expose the whole profile immediately.
    const revealFocusedProfile = event => {
      const profile = event.target.closest('.lawyer-profile');
      profile?.querySelectorAll('[data-team-reveal]').forEach(target => {
        target.classList.add('is-revealed');
        observer.unobserve(target);
      });
    };
    section.addEventListener('focusin', revealFocusedProfile);

    return () => {
      observer.disconnect();
      section.removeEventListener('focusin', revealFocusedProfile);
      section.classList.remove('team-motion');
      targets.forEach(target => target.classList.remove('is-revealed'));
    };
  }, []);

  return sectionRef;
}
