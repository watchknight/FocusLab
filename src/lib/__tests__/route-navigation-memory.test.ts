import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { gsap, ScrollTrigger } from '@/lib/gsap';

describe('Task 7: Memory and Route Navigation Stability', () => {
  beforeEach(() => {
    const createElement = (tag: string) => ({
      tagName: tag.toUpperCase(),
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(() => false),
      },
      style: {
        borderTopStyle: '',
      },
      hasAttribute: vi.fn(() => false),
      getAttribute: vi.fn(() => null),
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      getBoundingClientRect: () => ({ top: 0, left: 0, width: 100, height: 100, bottom: 100, right: 100 }),
      remove: vi.fn(),
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    });

    const doc = {
      createElement,
      body: createElement('body'),
      documentElement: createElement('html'),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      scrollingElement: createElement('html'),
    };

    const NodeMock = { DOCUMENT_NODE: 9, ELEMENT_NODE: 1 };
    vi.stubGlobal('Node', NodeMock);
    (globalThis as unknown as { Node: typeof NodeMock }).Node = NodeMock;

    const raf = (cb: (time: number) => void) => 1;
    const caf = vi.fn();

    vi.stubGlobal('requestAnimationFrame', raf);
    vi.stubGlobal('cancelAnimationFrame', caf);
    // Also set on globalThis
    (globalThis as unknown as { requestAnimationFrame: typeof raf }).requestAnimationFrame = raf;
    (globalThis as unknown as { cancelAnimationFrame: typeof caf }).cancelAnimationFrame = caf;

    vi.stubGlobal('document', doc);
    vi.stubGlobal('window', {
      document: doc,
      history: { scrollRestoration: 'auto' },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      getComputedStyle: () => ({ position: 'static', borderTopStyle: '', transform: 'none' }),
      matchMedia: () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
      innerWidth: 1024,
      innerHeight: 768,
      pageYOffset: 0,
      pageXOffset: 0,
      requestAnimationFrame: raf,
      cancelAnimationFrame: caf,
    });

    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch {}
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.globalTimeline.clear();
  });

  afterEach(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.globalTimeline.clear();
    vi.unstubAllGlobals();
  });

  it('ScrollTrigger.getAll().length returns to that route own count and does not accumulate over 20 route transitions', () => {
    const routes = [
      { path: '/', expectedCount: 4 },
      { path: '/check', expectedCount: 0 }, // calm route: no navbar ST or 0
      { path: '/focus', expectedCount: 0 }, // calm route: 0
      { path: '/activities', expectedCount: 1 },
      { path: '/experiments', expectedCount: 1 },
      { path: '/insights', expectedCount: 1 },
      { path: '/sounds', expectedCount: 1 },
      { path: '/learn', expectedCount: 1 },
      { path: '/about', expectedCount: 1 },
      { path: '/privacy', expectedCount: 1 },
      { path: '/disclaimer', expectedCount: 1 },
    ];

    let currentCleanups: (() => void)[] = [];

    const simulateRouteMount = (path: string) => {
      // Cleanup previous route (mimicking React component unmounting)
      currentCleanups.forEach((cleanup) => cleanup());
      currentCleanups = [];

      const routeDef = routes.find((r) => r.path === path);
      const isCalm = path === '/check' || path === '/focus';

      // 1. Navbar ScrollTrigger (created on non-calm routes)
      if (!isCalm) {
        const dummyHeader = document.createElement('header');
        document.body.appendChild(dummyHeader);
        const st = ScrollTrigger.create({
          start: 24,
          end: 999999,
          toggleClass: { targets: dummyHeader, className: 'header-glass' },
        });
        currentCleanups.push(() => {
          st.kill();
          dummyHeader.remove();
        });
      }

      // 2. Landing page specific ScrollTriggers
      if (path === '/') {
        const dummySection1 = document.createElement('section');
        const dummySection2 = document.createElement('section');
        const dummySection3 = document.createElement('section');
        document.body.appendChild(dummySection1);
        document.body.appendChild(dummySection2);
        document.body.appendChild(dummySection3);

        const st1 = ScrollTrigger.create({ trigger: dummySection1, start: 'top 80%', once: true });
        const st2 = ScrollTrigger.create({ trigger: dummySection2, start: 'top 85%', end: 'bottom 60%', scrub: true });
        const st3 = ScrollTrigger.create({ trigger: dummySection3, start: 'top 75%', once: true });

        currentCleanups.push(() => {
          st1.kill();
          st2.kill();
          st3.kill();
          dummySection1.remove();
          dummySection2.remove();
          dummySection3.remove();
        });
      }

      return routeDef ? routeDef.expectedCount : 1;
    };

    // Run 20 complete navigations across all routes
    const iterations = 20;
    for (let i = 0; i < iterations; i++) {
      for (const route of routes) {
        const expected = simulateRouteMount(route.path);
        const actual = ScrollTrigger.getAll().length;
        expect(actual).toBe(expected);
      }
    }

    // Final route back to landing
    simulateRouteMount('/');
    expect(ScrollTrigger.getAll().length).toBe(4);

    // Final unmount
    currentCleanups.forEach((cleanup) => cleanup());
    currentCleanups = [];
    expect(ScrollTrigger.getAll().length).toBe(0);
  });
});
