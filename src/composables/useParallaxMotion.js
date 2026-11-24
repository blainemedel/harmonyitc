// Gene - Nov, 23, 2026: Per-view scroll-reveal and pointer/scroll parallax with zero tilt lag and full unmount cleanup
import { onMounted, onBeforeUnmount } from 'vue';

/**
 * Attaches IntersectionObserver scroll reveals (below the fold) and depth parallax
 * inside the active view, clearing reveal delays once settled so card hover tilt stays snappy.
 */
export function useParallaxMotion(rootRef) {
  let revealObserver = null;
  let rafId = 0;
  let onMouseMove = null;
  let onScrollOrResize = null;
  const settleTimers = [];
  const magneticCleanups = [];

  function markRevealedAndSettle(el, immediate = false) {
    el.classList.add('is-revealed');
    if (immediate) {
      el.style.removeProperty('--reveal-delay');
      el.classList.add('is-settled');
      return;
    }

    if (el.classList.contains('is-settled')) return;

    const handleTransitionEnd = (event) => {
      if (event.target !== el || event.propertyName !== 'transform') return;
      el.removeEventListener('transitionend', handleTransitionEnd);
      el.style.removeProperty('--reveal-delay');
      el.classList.add('is-settled');
    };
    el.addEventListener('transitionend', handleTransitionEnd);

    // Fallback in case transitionend doesn't fire (e.g., hidden/tab switch)
    const fallbackTimer = setTimeout(() => {
      el.removeEventListener('transitionend', handleTransitionEnd);
      el.style.removeProperty('--reveal-delay');
      el.classList.add('is-settled');
    }, 1250);
    settleTimers.push(fallbackTimer);
  }

  onMounted(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const root = rootRef?.value || document;
    document.documentElement.classList.add('js-parallax-ready');

    // Gene - Nov, 24, 2026: Updated scroll-reveal targets for HeroWorkPreview, UnifiedCtaStrip, and Contact Hub
    /*
    const revealConfigs = [
      { selector: '.home-pillars-section .page-eyebrow, .home-comparison-section .page-eyebrow, .kinetic-section .page-eyebrow, .content-section .page-eyebrow', variant: 'reveal-up', delay: 0 },
      { selector: '.home-pillars-section h2, .home-comparison-section h2, .team-heading, .content-section > .section-inner > h2', variant: 'reveal-up', delay: 60 },
      { selector: '.frosted-panel', variant: 'reveal-up', delay: 70 },
      { selector: '.cosmic-quote-card', variant: 'reveal-right', delay: 140 },
      { selector: '.comparison-card-passive', variant: 'reveal-left', delay: 70 },
      { selector: '.comparison-card-engine', variant: 'reveal-right', delay: 140 },
      { selector: '.kinetic-stage', variant: 'reveal-scale', delay: 80 },
      { selector: '.contact-email-box', variant: 'reveal-scale', delay: 80 }
    ];
    */
    /*
    const revealConfigs = [
      { selector: '.home-pillars-section .page-eyebrow, .home-comparison-section .page-eyebrow, .unified-cta-section .page-eyebrow, .content-section .page-eyebrow', variant: 'reveal-up', delay: 0 },
      { selector: '.home-pillars-section h2, .home-comparison-section h2, .team-heading, .content-section > .section-inner > h2', variant: 'reveal-up', delay: 60 },
      { selector: '.frosted-panel, .unified-cta-strip, .contact-form-panel', variant: 'reveal-up', delay: 70 },
      { selector: '.comparison-card-passive', variant: 'reveal-left', delay: 70 },
      { selector: '.comparison-card-engine', variant: 'reveal-right', delay: 140 },
      { selector: '.contact-info-sidebar', variant: 'reveal-right', delay: 110 }
    ];
    */
    // Gene - Nov, 24, 2026: Editorial reveal targets, staggered rows, hairline draws, and magnetic controls
    const revealConfigs = [
      { selector: '.ed-reveal, .closing-band-inner, .contact-editorial-left, .contact-editorial-right', variant: 'reveal-up', delay: 0 },
      { selector: '.section-heading-group .page-eyebrow, .section-heading-group h2', variant: 'reveal-up', delay: 40 },
      { selector: '.ed-line-draw', variant: 'reveal-line', delay: 0 }
    ];

    revealConfigs.forEach(({ selector, variant, delay }) => {
      root.querySelectorAll(selector).forEach((el) => {
        if (el.closest('.case-modal-backdrop')) return;
        el.classList.add('parallax-reveal', variant);
        if (delay && !el.style.getPropertyValue('--reveal-delay')) {
          el.style.setProperty('--reveal-delay', `${delay}ms`);
        }
      });
    });

    /*
    const gridContainers = [
      { parent: '.home-metrics-grid', child: '.home-metric-card', step: 75, variant: 'reveal-up' },
      { parent: '.pillars-grid-2x2', child: '.pillar-card', step: 85, variant: 'reveal-up' },
      { parent: '.process-grid-4', child: '.process-card', step: 80, variant: 'reveal-up' },
      { parent: '.founders-grid', child: '.founder-profile-card', step: 95, variant: 'reveal-up' },
      { parent: '.gallery-grid-3', child: '.project-card', step: 80, variant: 'reveal-up' },
      { parent: '.priority-chips-grid', child: '.priority-chip', step: 55, variant: 'reveal-up' }
    ];
    */
    const gridContainers = [
      { parent: '.cap-list', child: '.cap-row', step: 70, variant: 'reveal-up' },
      { parent: '.bento-grid', child: '.bento-card', step: 85, variant: 'reveal-up' },
      { parent: '.project-editorial-list', child: '.project-row', step: 90, variant: 'reveal-up' },
      { parent: '.founders-editorial-grid', child: '.founder-card', step: 90, variant: 'reveal-up' },
      { parent: '.process-strip', child: '.process-step', step: 75, variant: 'reveal-up' },
      { parent: '.scope-pill-group', child: '.scope-pill', step: 45, variant: 'reveal-up' }
    ];

    gridContainers.forEach(({ parent, child, step, variant }) => {
      root.querySelectorAll(parent).forEach((grid) => {
        grid.querySelectorAll(child).forEach((item, idx) => {
          item.classList.add('parallax-reveal', variant);
          item.style.setProperty('--reveal-delay', `${idx * step}ms`);
        });
      });
    });

    const allRevealEls = Array.from(root.querySelectorAll('.parallax-reveal'));
    const vh = Math.max(1, window.innerHeight);

    // Reveal elements already inside the initial viewport without delaying first paint
    const belowFoldEls = [];
    allRevealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.94) {
        markRevealedAndSettle(el, true);
      } else {
        belowFoldEls.push(el);
      }
    });

    if (belowFoldEls.length > 0) {
      if (!('IntersectionObserver' in window)) {
        belowFoldEls.forEach((el) => markRevealedAndSettle(el, true));
      } else {
        revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                markRevealedAndSettle(entry.target, false);
                revealObserver?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
        );
        belowFoldEls.forEach((el) => revealObserver.observe(el));
      }
    }

    // Subtle magnetic CTA controls on fine-pointer desktop devices
    if (!isCoarsePointer) {
      root.querySelectorAll('[data-magnetic]').forEach((btn) => {
        const onMagneticMove = (e) => {
          const rect = btn.getBoundingClientRect();
          const relX = e.clientX - (rect.left + rect.width * 0.5);
          const relY = e.clientY - (rect.top + rect.height * 0.5);
          const tx = Math.max(-8, Math.min(8, relX * 0.22));
          const ty = Math.max(-6, Math.min(6, relY * 0.22));
          btn.style.setProperty('--mag-x', `${tx.toFixed(1)}px`);
          btn.style.setProperty('--mag-y', `${ty.toFixed(1)}px`);
        };
        const onMagneticLeave = () => {
          btn.style.setProperty('--mag-x', '0px');
          btn.style.setProperty('--mag-y', '0px');
        };
        btn.addEventListener('pointermove', onMagneticMove, { passive: true });
        btn.addEventListener('pointerleave', onMagneticLeave);
        magneticCleanups.push(() => {
          btn.removeEventListener('pointermove', onMagneticMove);
          btn.removeEventListener('pointerleave', onMagneticLeave);
          btn.style.removeProperty('--mag-x');
          btn.style.removeProperty('--mag-y');
        });
      });
    }

    // Continuous Scroll & Pointer Parallax
    const cornerCoil = document.querySelector('.ambient-corner-coil');
    const footerWordmark = document.querySelector('.footer-giant-wordmark');
    const footerEl = document.querySelector('.site-footer');
    const marqueeTrack = root.querySelector('.kinetic-marquee-inner');

    // Gene - Nov, 24, 2026: Updated depth parallax targets for editorial work media and portraits
    /*
    const autoDepthTargets = [
      { selector: '.harmony-motion-stage-card', speed: -0.05 },
      { selector: '.comparison-card-engine', speed: 0.045 },
      { selector: '.founder-portrait-frame', speed: -0.04 },
      { selector: '.contact-info-sidebar', speed: 0.04 }
    ];
    */
    const autoDepthTargets = [
      { selector: '.founder-portrait-frame', speed: -0.035 },
      { selector: '.work-media-parallax', speed: -0.03 }
    ];

    autoDepthTargets.forEach(({ selector, speed }) => {
      root.querySelectorAll(selector).forEach((el) => {
        if (!el.hasAttribute('data-parallax-speed')) {
          el.setAttribute('data-parallax-speed', String(speed));
        }
      });
    });

    const parallaxItems = Array.from(root.querySelectorAll('[data-parallax-speed]'))
      .map((node) => ({
        node,
        speed: parseFloat(node.getAttribute('data-parallax-speed')) || 0,
        isReveal: node.classList.contains('parallax-reveal')
      }))
      .filter((item) => item.speed !== 0);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let scrollDirty = true;

    function updateParallaxFrame() {
      rafId = 0;
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const viewportH = Math.max(1, window.innerHeight);

      let nodeOffsets = null;
      let footerRect = null;

      if (scrollDirty) {
        nodeOffsets = parallaxItems.map((item) => {
          const rect = item.node.getBoundingClientRect();
          if (rect.bottom < -120 || rect.top > viewportH + 120) return null;
          const centerOffset = rect.top + rect.height * 0.5 - viewportH * 0.5;
          return Math.max(-32, Math.min(32, centerOffset * item.speed));
        });
      }

      if (footerWordmark && footerEl) {
        footerRect = footerEl.getBoundingClientRect();
      }

      if (cornerCoil) {
        const cy = scrollY * 0.07 + currentMouseY * 18;
        const cx = currentMouseX * 20;
        const crot = scrollY * 0.045 + currentMouseX * 12;
        cornerCoil.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) rotate(${crot.toFixed(2)}deg)`;
      }

      if (scrollDirty && marqueeTrack) {
        const shift = -Math.min(180, scrollY * 0.08);
        marqueeTrack.style.transform = `translate3d(${shift.toFixed(1)}px, 0, 0)`;
      }

      if (scrollDirty && nodeOffsets) {
        for (let i = 0; i < parallaxItems.length; i++) {
          const offsetY = nodeOffsets[i];
          if (offsetY === null) continue;
          const item = parallaxItems[i];
          if (item.isReveal) {
            item.node.style.setProperty('--parallax-y', `${offsetY.toFixed(1)}px`);
          } else {
            item.node.style.transform = `translate3d(0, ${offsetY.toFixed(1)}px, 0)`;
          }
        }
      }

      if (footerWordmark && footerRect && footerRect.top < viewportH) {
        const progress = Math.min(1, Math.max(0, (viewportH - footerRect.top) / Math.max(1, footerRect.height)));
        const yPct = 22 - progress * 18;
        footerWordmark.style.transform = `translate3d(${(currentMouseX * -16).toFixed(1)}px, ${yPct.toFixed(2)}%, 0)`;
      }

      scrollDirty = false;
      const mouseSettled =
        Math.abs(targetMouseX - currentMouseX) < 0.0008 &&
        Math.abs(targetMouseY - currentMouseY) < 0.0008;

      if (!mouseSettled) {
        scheduleParallax();
      }
    }

    function scheduleParallax() {
      if (!rafId && !document.hidden) {
        rafId = requestAnimationFrame(updateParallaxFrame);
      }
    }

    onMouseMove = (e) => {
      targetMouseX = e.clientX / Math.max(1, window.innerWidth) - 0.5;
      targetMouseY = e.clientY / Math.max(1, window.innerHeight) - 0.5;
      scheduleParallax();
    };

    onScrollOrResize = () => {
      scrollDirty = true;
      scheduleParallax();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    scheduleParallax();
  });

  onBeforeUnmount(() => {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    settleTimers.forEach((timerId) => clearTimeout(timerId));
    settleTimers.length = 0;
    magneticCleanups.forEach((fn) => fn());
    magneticCleanups.length = 0;
    if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
    if (onScrollOrResize) {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    }
  });
}
