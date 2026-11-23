// Gene - Nov, 23, 2026: Interactive 3D magnetic card tilt and specular spotlight composable with clean unmount
import { onMounted, onBeforeUnmount } from 'vue';

const CARD_SELECTORS = [
  '.pillar-card',
  '.process-card',
  '.home-metric-card',
  '.project-card',
  '.cosmic-quote-card',
  '.comparison-card-passive',
  '.comparison-card-engine',
  '.contact-channel-card',
  '.priority-choice-card',
  '.founder-profile-card'
].join(', ');

/**
 * Applies smooth pointer-driven 3D tilt and specular spotlight CSS vars to cards in the active view.
 */
export function useCardTilt(rootRef) {
  const cleanups = [];

  onMounted(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReduced || isCoarsePointer) return;

    const root = rootRef?.value || document;
    const cards = root.querySelectorAll(CARD_SELECTORS);

    cards.forEach((card) => {
      card.classList.add('parallax-tilt-card');
      let tiltRaf = 0;
      let latestX = 0;
      let latestY = 0;

      const onMove = (e) => {
        latestX = e.clientX;
        latestY = e.clientY;
        if (tiltRaf) return;
        tiltRaf = requestAnimationFrame(() => {
          tiltRaf = 0;
          const rect = card.getBoundingClientRect();
          const x = latestX - rect.left;
          const y = latestY - rect.top;
          const nx = x / Math.max(1, rect.width) - 0.5;
          const ny = y / Math.max(1, rect.height) - 0.5;

          const tiltX = (ny * -5.5).toFixed(2);
          const tiltY = (nx * 5.5).toFixed(2);

          card.style.setProperty('--mouse-x', `${x.toFixed(0)}px`);
          card.style.setProperty('--mouse-y', `${y.toFixed(0)}px`);
          card.style.setProperty('--tilt-x', `${tiltX}deg`);
          card.style.setProperty('--tilt-y', `${tiltY}deg`);
        });
      };

      const onLeave = () => {
        if (tiltRaf) {
          cancelAnimationFrame(tiltRaf);
          tiltRaf = 0;
        }
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      };

      card.addEventListener('mousemove', onMove, { passive: true });
      card.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        if (tiltRaf) cancelAnimationFrame(tiltRaf);
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    });
  });

  onBeforeUnmount(() => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  });
}
