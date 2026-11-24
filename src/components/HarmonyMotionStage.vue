<!-- Gene - Nov, 24, 2026: Custom kinetic HARMONY typography + synchronized canvas harmonic waves & counter-flowing ribbons synced with Home Pitch Focus tabs -->
<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink } from 'vue-router';
import { HERO_PILLARS, HARMONY_MOTION_RIBBONS } from '@/data/siteContent';

const props = defineProps({
  activePillar: {
    type: String,
    default: 'problem'
  }
});

const LETTERS = ['H', 'A', 'R', 'M', 'O', 'N', 'Y'];

const currentPillar = computed(
  () => HERO_PILLARS.find((pillar) => pillar.id === props.activePillar) || HERO_PILLARS[0]
);

const cardRef = ref(null);
const stageWrapRef = ref(null);
const canvasRef = ref(null);
const letterRefs = ref([]);

const isPaused = ref(false);
const prefersReduced = ref(false);

let drawOnce = null;
let syncLoop = null;
let cleanupMotion = null;

function toggleMotion() {
  if (prefersReduced.value) return;
  isPaused.value = !isPaused.value;
  syncLoop?.();
}

onMounted(() => {
  const card = cardRef.value;
  const stageWrap = stageWrapRef.value;
  const canvas = canvasRef.value;
  if (!card || !stageWrap || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  prefersReduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  isPaused.value = prefersReduced.value;

  let width = 320;
  let height = 260;
  let dpr = 1;
  let phase = 0.65;
  let currentAmp = currentPillar.value.motion.amplitude;
  let currentTempo = currentPillar.value.motion.tempo;
  let hoverActive = false;
  let hoverNormX = 0.5;
  let hoverNormY = 0.5;
  let isInView = true;
  let rafId = 0;
  let lastTime = performance.now();
  let io = null;

  function renderFrame(now) {
    rafId = 0;
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;

    const motion = currentPillar.value.motion;
    if (prefersReduced.value) {
      currentAmp = 0;
      currentTempo = motion.tempo;
    } else {
      currentAmp += (motion.amplitude - currentAmp) * 0.08;
      currentTempo += (motion.tempo - currentTempo) * 0.08;
      if (!isPaused.value) {
        phase += dt * 2.15 * currentTempo;
      }
    }

    ctx.clearRect(0, 0, width, height);

    // Subtle harmonic glow behind center wordmark
    const gx = width * (hoverActive ? 0.35 + hoverNormX * 0.3 : 0.5 + Math.sin(phase * 0.35) * 0.07);
    const gy = height * (hoverActive ? 0.35 + hoverNormY * 0.3 : 0.5 + Math.cos(phase * 0.3) * 0.05);
    const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(width, height) * 0.55);
    glow.addColorStop(0, motion.glowRgba);
    glow.addColorStop(0.55, 'rgba(58, 106, 147, 0.1)');
    // glow.addColorStop(1, 'rgba(2, 11, 40, 0)');
    // Gene - Nov, 24, 2026: Faded radial canvas glow into transparent studio blue instead of dark cosmic navy for seamless background blending
    glow.addColorStop(1, 'rgba(58, 106, 147, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Three synchronized harmonic sine waves using the exact same phase clock as HARMONY letters
    const waveConfigs = [
      { color: 'rgba(180, 208, 233, 0.3)', width: 1.5, freq: 0.014, speedMul: 1.0, phaseShift: 0, ampScale: 1.15 },
      { color: 'rgba(216, 238, 255, 0.46)', width: 2.0, freq: 0.011, speedMul: 0.85, phaseShift: 1.25, ampScale: 1.4 },
      { color: 'rgba(255, 152, 92, 0.28)', width: 1.35, freq: 0.017, speedMul: 1.2, phaseShift: 2.4, ampScale: 0.9 }
    ];

    const baseCenterY = height * 0.5;
    const waveBaseAmp = prefersReduced.value ? 8 : Math.max(10, currentAmp * 1.35);

    waveConfigs.forEach((cfg) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const hoverDist = hoverActive ? Math.abs(x / Math.max(1, width) - hoverNormX) : 1;
        const hoverBoost = hoverActive && hoverDist < 0.24 ? (1 - hoverDist / 0.24) * 7 : 0;
        const envelope = Math.sin((x / Math.max(1, width)) * Math.PI);
        const y =
          baseCenterY +
          Math.sin(x * cfg.freq - phase * cfg.speedMul + cfg.phaseShift) *
            (waveBaseAmp * cfg.ampScale * (0.45 + 0.55 * envelope) + hoverBoost);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = cfg.color;
      ctx.lineWidth = cfg.width;
      ctx.stroke();
    });

    // Update each letter transform directly on DOM element (zero per-frame reactive allocations)
    for (let i = 0; i < LETTERS.length; i++) {
      const el = letterRefs.value[i];
      if (!el) continue;

      if (prefersReduced.value) {
        el.style.transform = 'translate3d(0, 0, 0)';
        continue;
      }

      const waveOffset = phase - i * 0.56;
      let y = Math.sin(waveOffset) * currentAmp;
      let scale = 1 + Math.cos(waveOffset) * 0.035;
      const rot = Math.cos(waveOffset) * 2.2;

      if (hoverActive) {
        const letterFrac = (i + 0.5) / LETTERS.length;
        const dist = Math.abs(hoverNormX - letterFrac);
        if (dist < 0.28) {
          const proximity = 1 - dist / 0.28;
          y -= proximity * 10;
          scale += proximity * 0.06;
        }
      }

      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotate(${rot.toFixed(2)}deg)`;
    }

    if (!prefersReduced.value && !isPaused.value && isInView && !document.hidden) {
      rafId = requestAnimationFrame(renderFrame);
    }
  }

  function resize() {
    const rect = stageWrap.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(240, Math.round(rect.width));
    height = Math.max(200, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderFrame(performance.now());
  }

  syncLoop = () => {
    const shouldRun = !prefersReduced.value && !isPaused.value && isInView && !document.hidden;
    if (shouldRun && !rafId) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(renderFrame);
    } else if (!shouldRun && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
      renderFrame(performance.now());
    }
  };

  drawOnce = () => {
    renderFrame(performance.now());
  };

  const onPointerMove = (e) => {
    const rect = stageWrap.getBoundingClientRect();
    hoverNormX = Math.min(1, Math.max(0, (e.clientX - rect.left) / Math.max(1, rect.width)));
    hoverNormY = Math.min(1, Math.max(0, (e.clientY - rect.top) / Math.max(1, rect.height)));
    hoverActive = true;
    if (isPaused.value && !prefersReduced.value) {
      renderFrame(performance.now());
    }
  };

  const onPointerLeave = () => {
    hoverActive = false;
    if (isPaused.value && !prefersReduced.value) {
      renderFrame(performance.now());
    }
  };

  const onVisibilityChange = () => syncLoop?.();

  if (!prefersReduced.value && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === card) {
            isInView = entry.isIntersecting;
            syncLoop?.();
          }
        });
      },
      { rootMargin: '80px 0px', threshold: 0.01 }
    );
    io.observe(card);
  }

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibilityChange);
  stageWrap.addEventListener('pointermove', onPointerMove, { passive: true });
  stageWrap.addEventListener('pointerleave', onPointerLeave);

  syncLoop();

  cleanupMotion = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    if (io) {
      io.disconnect();
      io = null;
    }
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    stageWrap.removeEventListener('pointermove', onPointerMove);
    stageWrap.removeEventListener('pointerleave', onPointerLeave);
  };
});

watch(
  () => props.activePillar,
  () => {
    if (isPaused.value || prefersReduced.value) {
      drawOnce?.();
    }
  }
);

onBeforeUnmount(() => {
  cleanupMotion?.();
  cleanupMotion = null;
  drawOnce = null;
  syncLoop = null;
});
</script>

<template>
  <div
    ref="cardRef"
    class="harmony-motion-stage-card"
    :class="{ 'is-paused': isPaused || prefersReduced }"
  >
    <div class="harmony-motion-topbar">
      <div class="preview-pill-group">
        <span class="preview-num">{{ currentPillar.num }}</span>
        <span class="preview-pill">{{ currentPillar.hubStatus }}</span>
      </div>

      <button
        type="button"
        class="harmony-motion-toggle"
        :aria-pressed="String(isPaused)"
        :aria-label="isPaused ? 'Resume live Harmony motion' : 'Pause live Harmony motion'"
        :disabled="prefersReduced"
        @click="toggleMotion"
      >
        <span class="harmony-toggle-dot" aria-hidden="true" />
        <span>{{ prefersReduced ? 'Reduced Motion' : isPaused ? 'Paused' : 'Live Motion' }}</span>
      </button>
    </div>

    <div ref="stageWrapRef" class="harmony-motion-canvas-wrap">
      <canvas ref="canvasRef" class="harmony-motion-canvas" aria-hidden="true" />

      <!-- Top counter-flowing typographic ribbon -->
      <div class="harmony-ribbon-row harmony-ribbon-row--top" aria-hidden="true">
        <div class="harmony-ribbon-track harmony-ribbon-track--left">
          <span v-for="copyIdx in 2" :key="`top-${copyIdx}`" class="harmony-ribbon-group">
            <template v-for="word in HARMONY_MOTION_RIBBONS.top" :key="`${copyIdx}-${word}`">
              <span class="harmony-ribbon-word" :class="{ 'is-highlight': word === 'HARMONY' }">
                {{ word }}
              </span>
              <span class="harmony-ribbon-sep">&bull;</span>
            </template>
          </span>
        </div>
      </div>

      <!-- Synchronized kinetic HARMONY wordmark -->
      <div class="harmony-kinetic-word" role="img" aria-label="Harmony moving in harmony">
        <span
          v-for="(letter, idx) in LETTERS"
          :key="`${letter}-${idx}`"
          :ref="(el) => { if (el) letterRefs[idx] = el; }"
          class="harmony-kinetic-letter"
        >
          {{ letter }}
        </span>
      </div>

      <!-- Bottom counter-flowing typographic ribbon -->
      <div class="harmony-ribbon-row harmony-ribbon-row--bottom" aria-hidden="true">
        <div class="harmony-ribbon-track harmony-ribbon-track--right">
          <span v-for="copyIdx in 2" :key="`bot-${copyIdx}`" class="harmony-ribbon-group">
            <template v-for="word in HARMONY_MOTION_RIBBONS.bottom" :key="`${copyIdx}-${word}`">
              <span class="harmony-ribbon-word" :class="{ 'is-highlight': word === 'HARMONY' }">
                {{ word }}
              </span>
              <span class="harmony-ribbon-sep">&bull;</span>
            </template>
          </span>
        </div>
      </div>
    </div>

    <div class="harmony-motion-footer">
      <Transition name="preview-swap" mode="out-in">
        <div :key="currentPillar.id" class="harmony-motion-phrase">
          {{ currentPillar.motion.phrase }}
        </div>
      </Transition>

      <RouterLink to="/projects" class="preview-case-link">
        <span>View Projects</span>
        <span aria-hidden="true">&rarr;</span>
      </RouterLink>
    </div>
  </div>
</template>
