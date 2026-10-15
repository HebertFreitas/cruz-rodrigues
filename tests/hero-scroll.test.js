import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/hooks/useCursorReveal.js', import.meta.url), 'utf8')
  .replace("import { useEffect } from 'react';", '')
  .replace('export default function', 'function');

function setup({ reduced = false } = {}) {
  let cleanup;
  let now = 0;
  let timerId = 0;
  let stopped = false;
  const timers = new Map();
  const events = new Map();
  const classes = new Set();
  const preference = { matches: reduced, addEventListener() {}, removeEventListener() {} };
  const canvasContext = { clearRect() {}, createRadialGradient: () => ({ addColorStop() {} }), beginPath() {}, arc() {}, fill() {} };
  const title = { getBoundingClientRect: () => ({ left: 100, top: 100, width: 900, height: 200 }), classList: { add() {}, remove() {}, toggle() {} }, style: { removeProperty() {} } };
  const hero = { classList: { toggle: (name, visible) => visible ? classes.add(name) : classes.delete(name), remove: name => classes.delete(name) }, addEventListener() {}, removeEventListener() {} };
  class Element { closest() { return null; } }
  const window = {
    scrollY: 0,
    matchMedia: query => query.includes('reduced-motion') ? preference : { matches: true },
    CSS: { supports: () => true },
    addEventListener: (name, handler) => events.set(name, handler),
    removeEventListener: name => events.delete(name),
    setTimeout: (fn, delay) => { const id = ++timerId; timers.set(id, { fn, at: now + delay }); return id; },
  };
  const document = { createElement: () => ({ getContext: () => canvasContext, toDataURL: () => 'data:image/png;base64,blank' }), querySelector: () => null };
  const context = vm.createContext({ useEffect: fn => { cleanup = fn(); }, window, document, Element, ResizeObserver: class { observe() {} disconnect() {} }, performance: { now: () => now }, clearTimeout: id => timers.delete(id), requestAnimationFrame: () => 1, cancelAnimationFrame() {}, Math });
  vm.runInContext(`${source}\nthis.run = useCursorReveal;`, context);
  context.run({ current: hero }, { current: title }, { current: title }, { current: { stop: () => { stopped = true; }, start: () => { stopped = false; }, scrollTo() {} } });
  const dispatch = (name, extra = {}) => {
    const event = { target: new Element(), deltaX: 0, deltaY: 0, prevented: false, preventDefault() { this.prevented = true; }, ...extra };
    events.get(name)?.(event);
    return event;
  };
  return {
    classes, window, events, timers, dispatch, cleanup,
    editableTarget: Object.assign(new Element(), { closest: () => true }),
    stopped: () => stopped,
    advance(milliseconds) {
      now += milliseconds;
      for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.fn(); }
    },
  };
}

test('first downward scroll reveals the title, holds for 720 ms, then permits scrolling', () => {
  const page = setup();
  assert.equal(page.dispatch('wheel', { deltaY: 40 }).prevented, true);
  assert.ok(page.classes.has('has-scroll-reveal'));
  assert.equal(page.stopped(), true);
  page.advance(719);
  assert.equal(page.stopped(), true);
  page.advance(1);
  assert.equal(page.stopped(), false);
  assert.equal(page.dispatch('wheel', { deltaY: 40 }).prevented, false);
  page.cleanup();
});

test('momentum during reveal stays intercepted and reverse scroll at the top hides the title', () => {
  const page = setup();
  page.dispatch('wheel', { deltaY: 40 });
  page.advance(700);
  assert.equal(page.dispatch('wheel', { deltaY: 10 }).prevented, true);
  page.advance(159);
  assert.equal(page.stopped(), true);
  page.advance(1);
  assert.equal(page.stopped(), false);
  assert.equal(page.dispatch('wheel', { deltaY: -40 }).prevented, true);
  assert.equal(page.classes.has('has-scroll-reveal'), false);
  page.cleanup();
});

test('touch and keyboard use the same reveal gate', () => {
  for (const input of ['touch', 'keyboard']) {
    const page = setup();
    let event;
    if (input === 'touch') {
      page.dispatch('touchstart', { touches: [{ clientY: 500 }] });
      event = page.dispatch('touchmove', { touches: [{ clientY: 450 }] });
    } else event = page.dispatch('keydown', { key: 'PageDown' });
    assert.equal(event.prevented, true);
    assert.ok(page.classes.has('has-scroll-reveal'));
    page.advance(720);
    assert.equal(page.stopped(), false);
    page.cleanup();
  }
});

test('scroll below the hero, zoom, horizontal gestures and editable fields are not intercepted', () => {
  const page = setup();
  assert.equal(page.dispatch('wheel', { deltaY: 30, ctrlKey: true }).prevented, false);
  assert.equal(page.dispatch('wheel', { deltaX: 100, deltaY: 2 }).prevented, false);
  const event = page.dispatch('keydown', { key: ' ', target: page.editableTarget });
  assert.equal(event.prevented, false);
  page.window.scrollY = 100;
  assert.equal(page.dispatch('wheel', { deltaY: 40 }).prevented, false);
  page.cleanup();
});

test('reduced motion bypasses the gate and cleanup cancels pending scroll locks', () => {
  const reduced = setup({ reduced: true });
  assert.equal(reduced.dispatch('wheel', { deltaY: 40 }).prevented, false);
  assert.equal(reduced.stopped(), false);
  reduced.cleanup();
  const page = setup();
  page.dispatch('wheel', { deltaY: 40 });
  page.cleanup();
  assert.equal(page.stopped(), false);
  assert.equal(page.timers.size, 0);
  assert.equal(page.events.size, 0);
});
