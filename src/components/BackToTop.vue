<!-- Gene - Nov, 24, 2026: Subtle matte Back-to-Top button revealed after scrolling past 480px -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const visible = ref(false);

function updateVisibility() {
  visible.value = (window.scrollY || document.documentElement.scrollTop || 0) > 480;
}

function scrollToTop() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({
    top: 0,
    behavior: prefersReduced ? 'auto' : 'smooth'
  });
}

onMounted(() => {
  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisibility);
});
</script>

<template>
  <button
    type="button"
    class="back-to-top-btn"
    :class="{ visible }"
    aria-label="Back to top"
    :aria-hidden="String(!visible)"
    :tabindex="visible ? 0 : -1"
    @click="scrollToTop"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  </button>
</template>
