import { useEffect } from 'react';

// Ported from Advogado Premium.zip: cursor spotlight + reveal before scrolling.
export default function useCursorReveal(heroRef, titleRef, scrollTitleRef, smoothScrollRef) {
  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const revealTargets = [title];
    const probe = document.createElement('canvas');
    if (!probe.getContext('2d') || !window.CSS?.supports('mask-image', 'linear-gradient(black, black)')) return;
    // Touch-only devices get the plain title and native scrolling: the reveal gate needs a mouse.
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const smoothScroll = {
      stop: () => smoothScrollRef.current?.stop(),
      start: () => smoothScrollRef.current?.start(),
      scrollTo: (...args) => smoothScrollRef.current?.scrollTo(...args),
    };
    let disposed = false;
    const cleanups = [];
    const listen = (target, name, handler, options) => {
      target.addEventListener(name, handler, options);
      cleanups.push(() => target.removeEventListener(name, handler, options));
    };
    const isEditable = target => target instanceof Element && Boolean(target.closest('input, textarea, select, button, [contenteditable="true"]'));

  const masks = revealTargets.map(() => document.createElement("canvas"));
  const contexts = masks.map((mask) => mask.getContext("2d"));
  const targetCursor = { x: 0, y: 0 };
  const cursor = { x: 0, y: 0 };
  let frameId = 0;
  let hovering = false;
  let scrollProgress = 0;
  let scrollLocked = false;
  let scrollUnlockTimer = 0;
  let scrollReadyAt = 0;
  let lastTouchY = null;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  const resizeMasks = () => revealTargets.forEach((target, index) => {
    const bounds = target.getBoundingClientRect();
    masks[index].width = Math.ceil(bounds.width);
    masks[index].height = Math.ceil(bounds.height);
  });

  const setMask = (target, mask) => {
    const image = `url("${mask.toDataURL("image/png")}")`;
    target.style.webkitMaskImage = image;
    target.style.maskImage = image;
    target.style.webkitMaskSize = "100% 100%";
    target.style.maskSize = "100% 100%";
  };

  const clearReveal = () => {
    hovering = false;
    cancelAnimationFrame(frameId);
    frameId = 0;
    revealTargets.forEach((target, index) => {
      contexts[index].clearRect(0, 0, masks[index].width, masks[index].height);
      setMask(target, masks[index]);
    });
  };

  const drawReveal = () => revealTargets.forEach((target, index) => {
    const bounds = target.getBoundingClientRect();
    const x = cursor.x - bounds.left;
    const y = cursor.y - bounds.top;
    const radius = Math.max(190, Math.min(260, bounds.width * 0.25));
    const context = contexts[index];
    const mask = masks[index];
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.75)");
    gradient.addColorStop(0.75, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(0.88, "rgba(255, 255, 255, 0.12)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.clearRect(0, 0, mask.width, mask.height);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    setMask(target, mask);
  });

  const animate = () => {
    if (!hovering) return;
    const easing = motionPreference.matches ? 1 : 0.18;
    cursor.x += (targetCursor.x - cursor.x) * easing;
    cursor.y += (targetCursor.y - cursor.y) * easing;
    drawReveal();
    frameId = Math.hypot(targetCursor.x - cursor.x, targetCursor.y - cursor.y) > 0.5 ? requestAnimationFrame(animate) : 0;
  };

  const updatePointer = (event) => {
    if (motionPreference.matches || scrollProgress > 0 || !finePointer || event.pointerType !== "mouse") return;
    targetCursor.x = event.clientX;
    targetCursor.y = event.clientY;
    if (!hovering) { cursor.x = targetCursor.x; cursor.y = targetCursor.y; hovering = true; }
    if (!frameId) frameId = requestAnimationFrame(animate);
  };

  const setScrollReveal = (visible) => {
    const nextProgress = visible ? 1 : 0;
    if (nextProgress === scrollProgress) return;
    if (visible) clearReveal();
    hero.classList.toggle("has-scroll-reveal", visible);
    scrollProgress = nextProgress;

  };

  const keepScrollLocked = () => {
    clearTimeout(scrollUnlockTimer);
    const remaining = Math.max(160, scrollReadyAt - performance.now());
    scrollUnlockTimer = window.setTimeout(() => {
      scrollLocked = false;
      if (smoothScroll) smoothScroll.start();
    }, remaining);
  };

  const revealBeforeScroll = () => {
    if (smoothScroll) {
      smoothScroll.stop();
      smoothScroll.scrollTo(0, { immediate: true, force: true });
    }
    setScrollReveal(true);
    scrollLocked = true;
    scrollReadyAt = performance.now() + 720;
    keepScrollLocked();
  };

  const hideAtTop = () => {
    if (smoothScroll) {
      smoothScroll.stop();
      smoothScroll.scrollTo(0, { immediate: true, force: true });
    }
    setScrollReveal(false);
    scrollLocked = true;
    scrollReadyAt = performance.now() + 720;
    keepScrollLocked();
  };

  const configureMotion = () => {
    clearTimeout(scrollUnlockTimer);
    scrollLocked = false;
    smoothScroll.start();
    resizeMasks();
    clearReveal();
    title.classList.toggle('is-reveal-ready', !motionPreference.matches);
    setScrollReveal(motionPreference.matches || window.scrollY > 2);
  };
  configureMotion();
  listen(motionPreference, 'change', configureMotion);
  listen(hero, "pointerenter", updatePointer);
  listen(hero, "pointermove", updatePointer, { passive: true });
  listen(hero, "pointerleave", clearReveal);
  listen(window, "wheel", (event) => {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (motionPreference.matches || document.querySelector("dialog[open]") || isEditable(event.target)) return;
    const atTop = window.scrollY <= 2;
    if (scrollLocked) {
      event.preventDefault();
      keepScrollLocked();
      return;
    }
    if (atTop && event.deltaY > 0 && scrollProgress < 1) {
      event.preventDefault();
      revealBeforeScroll();
    } else if (atTop && event.deltaY < 0 && scrollProgress > 0) {
      event.preventDefault();
      hideAtTop();
    }
  }, { passive: false, capture: true });
  listen(window, "touchstart", (event) => { lastTouchY = event.touches[0]?.clientY ?? null; }, { passive: true });
  listen(window, "touchmove", (event) => {
    if (event.touches.length !== 1) return;
    const currentY = event.touches[0]?.clientY;
    if (lastTouchY === null || currentY === undefined) return;
    const delta = lastTouchY - currentY;
    if (motionPreference.matches || document.querySelector("dialog[open]") || isEditable(event.target)) return;
    const atTop = window.scrollY <= 2;
    if (scrollLocked) {
      event.preventDefault();
      keepScrollLocked();
    } else if (atTop && delta > 0 && scrollProgress < 1) {
      event.preventDefault();
      revealBeforeScroll();
    } else if (atTop && delta < 0 && scrollProgress > 0) {
      event.preventDefault();
      hideAtTop();
    }
    lastTouchY = currentY;
  }, { passive: false, capture: true });
  listen(window, "touchend", () => { lastTouchY = null; }, { passive: true });
  listen(window, "keydown", (event) => {
    if (motionPreference.matches || document.querySelector("dialog[open]") || isEditable(event.target)) return;
    const atTop = window.scrollY <= 2;
    if (scrollLocked) {
      if (["ArrowDown", "PageDown", " ", "ArrowUp", "PageUp"].includes(event.key)) event.preventDefault();
      return;
    }
    if (atTop && ["ArrowDown", "PageDown", " "].includes(event.key) && scrollProgress < 1) {
      event.preventDefault();
      revealBeforeScroll();
    } else if (atTop && ["ArrowUp", "PageUp"].includes(event.key) && scrollProgress > 0) {
      event.preventDefault();
      hideAtTop();
    }
  });
  listen(window, "resize", () => { resizeMasks(); if (!hovering) clearReveal(); }, { passive: true });
  listen(window, 'touchcancel', () => { lastTouchY = null; }, { passive: true });
  listen(window, 'scroll', () => {
    if (window.scrollY > 2 && !scrollProgress) setScrollReveal(true);
  }, { passive: true });
  const observer = new ResizeObserver(() => { resizeMasks(); if (hovering) drawReveal(); else clearReveal(); });
  observer.observe(title);
  document.fonts?.ready.then(() => { if (!disposed) { resizeMasks(); if (hovering) drawReveal(); else clearReveal(); } });
  return () => {
    disposed = true;
    cancelAnimationFrame(frameId);
    clearTimeout(scrollUnlockTimer);
    observer.disconnect();
    cleanups.forEach(cleanup => cleanup());
    title.classList.remove('is-reveal-ready');
    hero.classList.remove('has-scroll-reveal');
    title.style.removeProperty('mask-image');
    title.style.removeProperty('-webkit-mask-image');
    smoothScroll.start();
  };
  }, [heroRef, titleRef, scrollTitleRef, smoothScrollRef]);
}
