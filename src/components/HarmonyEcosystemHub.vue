<!-- Gene - Nov, 23, 2026: Interactive Harmony Ecosystem Hub synchronized with the Home pitch focus tabs -->
<script setup>
import { ref, computed, useId, onMounted, onBeforeUnmount } from 'vue';
import { HERO_PILLARS } from '@/data/siteContent';
import { BRAND_ASSETS } from '@/data/mediaAssets';

const props = defineProps({
  activePillar: {
    type: String,
    default: 'problem'
  }
});

const uid = useId();
const stageRef = ref(null);
const backdropRef = ref(null);
const wiresRef = ref(null);
const medallionRef = ref(null);
const nodesWrapRef = ref(null);

const activeMeta = computed(
  () => HERO_PILLARS.find((p) => p.id === props.activePillar) || HERO_PILLARS[0]
);

const wirePaths = {
  problem: 'M168 172 Q122 126 78 60',
  promo: 'M232 172 Q280 124 326 74',
  operations: 'M168 228 Q120 264 74 294',
  income: 'M232 228 Q278 268 322 316'
};

let stageMouseRaf = 0;
let cleanupEvents = null;

onMounted(() => {
  const stage = stageRef.value;
  if (!stage) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let lastNx = 0;
  let lastNy = 0;

  const onMouseMove = (e) => {
    const rect = stage.getBoundingClientRect();
    lastNx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    lastNy = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;

    if (!stageMouseRaf) {
      stageMouseRaf = requestAnimationFrame(() => {
        stageMouseRaf = 0;
        if (backdropRef.value) {
          backdropRef.value.style.transform = `translate3d(${(lastNx * -10).toFixed(1)}px, ${(lastNy * -10).toFixed(1)}px, -40px)`;
        }
        if (wiresRef.value) {
          wiresRef.value.style.transform = `translate3d(${(lastNx * 6).toFixed(1)}px, ${(lastNy * 6).toFixed(1)}px, 8px)`;
        }
        if (medallionRef.value) {
          medallionRef.value.style.transform = `translate3d(${(lastNx * 12).toFixed(1)}px, ${(lastNy * 12).toFixed(1)}px, 28px) rotateX(${(lastNy * -10).toFixed(2)}deg) rotateY(${(lastNx * 12).toFixed(2)}deg)`;
        }
        if (nodesWrapRef.value) {
          nodesWrapRef.value.style.transform = `rotateX(${(lastNy * -6).toFixed(2)}deg) rotateY(${(lastNx * 7).toFixed(2)}deg)`;
        }
      });
    }
  };

  const onMouseLeave = () => {
    if (stageMouseRaf) {
      cancelAnimationFrame(stageMouseRaf);
      stageMouseRaf = 0;
    }
    if (backdropRef.value) backdropRef.value.style.transform = '';
    if (wiresRef.value) wiresRef.value.style.transform = '';
    if (medallionRef.value) medallionRef.value.style.transform = '';
    if (nodesWrapRef.value) nodesWrapRef.value.style.transform = '';
  };

  stage.addEventListener('mousemove', onMouseMove, { passive: true });
  stage.addEventListener('mouseleave', onMouseLeave);

  cleanupEvents = () => {
    stage.removeEventListener('mousemove', onMouseMove);
    stage.removeEventListener('mouseleave', onMouseLeave);
  };
});

onBeforeUnmount(() => {
  if (stageMouseRaf) {
    cancelAnimationFrame(stageMouseRaf);
    stageMouseRaf = 0;
  }
  if (cleanupEvents) {
    cleanupEvents();
    cleanupEvents = null;
  }
});
</script>

<template>
  <div
    ref="stageRef"
    class="hero-artwork-stage hero-3d-stage harmony-hub-stage"
    :data-active-pillar="activePillar"
    aria-hidden="true"
  >
    <div ref="backdropRef" class="hero-3d-backdrop" />
    <div class="hero-3d-orbit-ring hero-orbit-outer" />
    <div class="hero-3d-orbit-ring hero-orbit-inner" />
    <div class="harmony-pulse-ring harmony-pulse-a" />
    <div class="harmony-pulse-ring harmony-pulse-b" />

    <svg ref="wiresRef" class="harmony-hub-wires" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient :id="`${uid}-waveCool`" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="#3a6a93" stop-opacity="0" />
          <stop offset="50%" stop-color="#9eb9d6" stop-opacity="0.58" />
          <stop offset="100%" stop-color="#3a6a93" stop-opacity="0" />
        </linearGradient>
        <linearGradient :id="`${uid}-waveWarm`" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="#ff6b2c" stop-opacity="0" />
          <stop offset="50%" stop-color="#ff8a4c" stop-opacity="0.52" />
          <stop offset="100%" stop-color="#ff6b2c" stop-opacity="0" />
        </linearGradient>
      </defs>

      <path
        class="harmony-wave-path wave-cool"
        d="M44 200 Q122 152 200 200 T356 200"
        :stroke="`url(#${uid}-waveCool)`"
        stroke-width="1.6"
      />
      <path
        class="harmony-wave-path wave-warm"
        d="M44 200 Q122 248 200 200 T356 200"
        :stroke="`url(#${uid}-waveWarm)`"
        stroke-width="1.4"
      />

      <circle cx="200" cy="200" r="102" stroke="rgba(156, 183, 212, 0.2)" stroke-width="1" stroke-dasharray="4 6" />
      <circle cx="200" cy="200" r="144" stroke="rgba(156, 183, 212, 0.14)" stroke-width="1" />

      <path
        v-for="pillar in HERO_PILLARS"
        :key="pillar.id"
        class="harmony-wire"
        :class="{ 'is-active': activePillar === pillar.id }"
        :d="wirePaths[pillar.id]"
      />
    </svg>

    <div ref="medallionRef" class="harmony-core-medallion">
      <div class="harmony-emblem-ring">
        <img :src="BRAND_ASSETS.icon" alt="" width="64" height="64" decoding="async" />
      </div>
      <div class="harmony-core-meta">
        <span class="harmony-core-title">HARMONY</span>
        <span class="harmony-core-status">{{ activeMeta.hubStatus }}</span>
      </div>
    </div>

    <div ref="nodesWrapRef" class="hero-3d-nodes">
      <div
        v-for="pillar in HERO_PILLARS"
        :key="pillar.id"
        class="hero-3d-node"
        :class="[`node-${pillar.id}`, { 'is-active': activePillar === pillar.id }]"
      >
        <span class="node-dot" />
        <span class="node-meta">{{ pillar.num }}</span>
        <span class="node-label">{{ pillar.hubNodeLabel }}</span>
      </div>
    </div>

    <div class="hero-3d-badge">
      <img :src="BRAND_ASSETS.icon" alt="" width="20" height="20" decoding="async" />
      <span>Built Around Your Business</span>
    </div>
  </div>
</template>
