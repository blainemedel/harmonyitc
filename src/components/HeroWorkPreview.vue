<!-- Gene - Nov, 24, 2026: Interactive SwitchFiber deliverable showcase card synchronized with Home Hero Pitch Focus tabs -->
<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { HERO_PILLARS } from '@/data/siteContent';
import { PROJECT_THUMBNAILS } from '@/data/mediaAssets';

const props = defineProps({
  activePillar: {
    type: String,
    default: 'problem'
  }
});

const currentPillar = computed(
  () => HERO_PILLARS.find((pillar) => pillar.id === props.activePillar) || HERO_PILLARS[0]
);

const previewImage = computed(() => PROJECT_THUMBNAILS[currentPillar.value.preview.imageKey]);
</script>

<template>
  <div class="hero-preview-card">
    <div class="preview-topbar">
      <div class="preview-pill-group">
        <span class="preview-num">{{ currentPillar.num }}</span>
        <span class="preview-pill">{{ currentPillar.preview.badge }}</span>
      </div>
      <span class="preview-status">
        <span class="preview-status-dot" aria-hidden="true" />
        <span>Live System</span>
      </span>
    </div>

    <div class="preview-shot-stage">
      <Transition name="preview-swap" mode="out-in">
        <div
          :key="currentPillar.id"
          class="preview-shot-wrap"
          :class="currentPillar.preview.thumbModifier"
        >
          <img
            :src="previewImage"
            :alt="`${currentPillar.preview.title} — ${currentPillar.preview.badge}`"
            :width="currentPillar.preview.width"
            :height="currentPillar.preview.height"
            decoding="async"
          />
        </div>
      </Transition>
    </div>

    <div class="preview-footer">
      <div class="preview-meta">
        <div class="preview-title">{{ currentPillar.preview.title }}</div>
        <div class="preview-metric-row">
          <strong>{{ currentPillar.preview.metricVal }}</strong>
          <span aria-hidden="true">&middot;</span>
          <span>{{ currentPillar.preview.metricSub }}</span>
        </div>
      </div>

      <RouterLink
        :to="{ path: '/projects', query: { case: currentPillar.preview.projectId } }"
        class="preview-case-link"
      >
        <span>Inspect Case Study</span>
        <span aria-hidden="true">&rarr;</span>
      </RouterLink>
    </div>
  </div>
</template>
