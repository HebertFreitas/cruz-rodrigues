import { useEffect } from 'react';

// A soft canvas brush becomes an accumulating alpha mask over the real HTML title.
// The title stays semantic and selectable; only its visual paint is masked.
export default function useCursorReveal(heroRef, titleRef) {
  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const enabled = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context || !window.CSS?.supports('mask-image', 'linear-gradient(black, black)')) return;

    let disposed = false;
    let active = false;
    let previous = null;
    let pending = null;
    let frame = 0;
    let lastPaint = 0;

    const publishMask = () => {
      title.style.setProperty('--title-reveal-mask', `url("${canvas.toDataURL()}")`);
    };
    const resize = () => {
      if (!active) return;
      const bounds = title.getBoundingClientRect();
      const width = Math.max(1, Math.ceil(bounds.width));
      const height = Math.max(1, Math.ceil(bounds.height));
      if (canvas.width !== width || canvas.height !== height) {
        // Preserve revealed regions when fonts load or the desktop viewport resizes.
        const snapshot = document.createElement('canvas');
        snapshot.width = canvas.width;
        snapshot.height = canvas.height;
        snapshot.getContext('2d').drawImage(canvas, 0, 0);
        canvas.width = width;
        canvas.height = height;
        context.drawImage(snapshot, 0, 0, width, height);
        previous = null;
        publishMask();
      }
    };
    const stamp = (x, y, radius) => {
      const brush = context.createRadialGradient(x, y, 0, x, y, radius);
      brush.addColorStop(0, 'rgba(0,0,0,1)');
      brush.addColorStop(0.55, 'rgba(0,0,0,1)');
      brush.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = brush;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };
    const paint = time => {
      frame = 0;
      if (!active || !pending) return;
      // Encoding the mask is limited to 30 fps; React never rerenders on mousemove.
      if (time - lastPaint < 32) {
        frame = requestAnimationFrame(paint);
        return;
      }
      lastPaint = time;
      const bounds = title.getBoundingClientRect();
      const point = { x: pending.x - bounds.left, y: pending.y - bounds.top };
      const radius = Math.max(85, Math.min(150, bounds.width * 0.15));
      const start = previous || point;
      const distance = Math.hypot(point.x - start.x, point.y - start.y);
      const steps = Math.max(1, Math.ceil(distance / (radius * 0.2)));
      for (let step = 0; step <= steps; step++) {
        const t = step / steps;
        const x = start.x + (point.x - start.x) * t;
        const y = start.y + (point.y - start.y) * t;
        if (x + radius >= 0 && x - radius <= bounds.width && y + radius >= 0 && y - radius <= bounds.height) stamp(x, y, radius);
      }
      previous = point;
      pending = null;
      if (point.x + radius >= 0 && point.x - radius <= bounds.width && point.y + radius >= 0 && point.y - radius <= bounds.height || distance > radius) publishMask();
    };
    const onPointerMove = event => {
      if (!active || event.pointerType !== 'mouse') return;
      pending = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onPointerLeave = () => {
      // Already uncovered text stays visible. A new entry starts a new stroke.
      previous = null;
      pending = null;
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const configure = () => {
      if (disposed) return;
      onPointerLeave();
      active = enabled.matches;
      title.classList.remove('is-reveal-ready');
      if (active) {
        resize();
        publishMask();
        title.classList.add('is-reveal-ready');
      } else {
        title.style.removeProperty('--title-reveal-mask');
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(title);
    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', onPointerLeave);
    // Scroll changes the title's screen position, so do not join unrelated strokes.
    window.addEventListener('scroll', onPointerLeave, { passive: true });
    enabled.addEventListener('change', configure);
    // Wait for the display font before measuring and concealing the title.
    (document.fonts?.ready || Promise.resolve()).then(configure);

    return () => {
      disposed = true;
      onPointerLeave();
      observer.disconnect();
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onPointerLeave);
      enabled.removeEventListener('change', configure);
      title.classList.remove('is-reveal-ready');
      title.style.removeProperty('--title-reveal-mask');
    };
  }, [heroRef, titleRef]);
}
