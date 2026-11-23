<!-- Gene - Nov, 23, 2026: Root application shell with AmbientBackdrop, scroll progress bar, header, RouterView, footer, and toast -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import AmbientBackdrop from '@/components/AmbientBackdrop.vue';
import SiteHeader from '@/components/SiteHeader.vue';
import SiteFooter from '@/components/SiteFooter.vue';
import { useClipboard } from '@/composables/useClipboard';

const route = useRoute();
const { toastVisible, toastMessage } = useClipboard();

const scrollProgressPct = ref(0);
let progressRaf = 0;

function updateProgress() {
  progressRaf = 0;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  scrollProgressPct.value = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
}

function scheduleProgress() {
  if (!progressRaf) {
    progressRaf = requestAnimationFrame(updateProgress);
  }
}

onMounted(() => {
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress, { passive: true });
  updateProgress();
});

onBeforeUnmount(() => {
  if (progressRaf) {
    cancelAnimationFrame(progressRaf);
    progressRaf = 0;
  }
  window.removeEventListener('scroll', scheduleProgress);
  window.removeEventListener('resize', scheduleProgress);
});
</script>

<template>
  <div class="app-shell">
    <div
      class="scroll-progress-bar"
      :style="{ width: `${scrollProgressPct}%` }"
      aria-hidden="true"
    />

    <AmbientBackdrop />

    <SiteHeader />

    <main>
      <RouterView />
    </main>

    <SiteFooter :is-home="route.name === 'home'" />

    <div
      id="copied-toast"
      class="copied-toast"
      :class="{ show: toastVisible }"
      role="status"
      aria-live="polite"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span class="toast-text">{{ toastMessage }}</span>
    </div>
  </div>
</template>
