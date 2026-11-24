<!-- Gene - Nov, 24, 2026: Upgraded CaseStudyModal with screenshot preview, lightbox zoom, tech badges, and Build Something Similar CTA -->
<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink } from 'vue-router';
import { PROJECT_THUMBNAILS } from '@/data/mediaAssets';
import { setBodyScrollLock } from '@/composables/useScrollLock';

const props = defineProps({
  project: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const modalCardRef = ref(null);
const closeBtnRef = ref(null);
const previewBtnRef = ref(null);
const lightboxCloseBtnRef = ref(null);
const zoomOpen = ref(false);

function getFocusableElements() {
  if (!modalCardRef.value) return [];
  return Array.from(
    modalCardRef.value.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  );
}

async function openZoom() {
  zoomOpen.value = true;
  await nextTick();
  lightboxCloseBtnRef.value?.focus();
}

async function closeZoom() {
  zoomOpen.value = false;
  await nextTick();
  previewBtnRef.value?.focus();
}

function handleKeyDown(e) {
  if (!props.project) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    if (zoomOpen.value) {
      closeZoom();
    } else {
      emit('close');
    }
    return;
  }

  if (e.key === 'Tab') {
    if (zoomOpen.value) {
      e.preventDefault();
      lightboxCloseBtnRef.value?.focus();
      return;
    }
    const focusable = getFocusableElements();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

watch(
  () => props.project,
  async (current) => {
    zoomOpen.value = false;
    setBodyScrollLock('case-modal', Boolean(current));
    if (current) {
      await nextTick();
      closeBtnRef.value?.focus();
    }
  }
);

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
  setBodyScrollLock('case-modal', false);
});
</script>

<template>
  <div
    class="case-modal-backdrop"
    :class="{ active: Boolean(project) }"
    :aria-hidden="String(!project)"
    role="dialog"
    aria-modal="true"
    aria-labelledby="case-modal-title"
    @click.self="emit('close')"
  >
    <div v-if="project" ref="modalCardRef" class="case-modal-card">
      <button
        ref="closeBtnRef"
        id="case-modal-close"
        type="button"
        class="case-modal-close"
        aria-label="Close dialog"
        @click="emit('close')"
      >
        &times;
      </button>

      <div class="page-eyebrow case-modal-eyebrow">{{ project.caseStudy.eyebrow }}</div>
      <h2 id="case-modal-title" class="case-modal-title">{{ project.caseStudy.title }}</h2>
      <p class="case-modal-desc">{{ project.caseStudy.desc }}</p>

      <button
        ref="previewBtnRef"
        type="button"
        class="case-modal-preview-btn"
        :class="project.thumbModifier"
        :aria-label="`Zoom ${project.caseStudy.title} screenshot`"
        @click="openZoom"
      >
        <img
          :src="PROJECT_THUMBNAILS[project.imageKey]"
          :alt="project.alt"
          :width="project.width"
          :height="project.height"
          decoding="async"
        />
        <span class="case-modal-zoom-chip" aria-hidden="true">Click to zoom</span>
      </button>

      <div class="modal-block">
        <div class="modal-block-title">01 / Operational Context</div>
        <div class="modal-block-body">{{ project.caseStudy.challenge }}</div>
      </div>

      <div class="modal-block">
        <div class="modal-block-title">02 / Delivered Platform Solution</div>
        <div class="modal-block-body">{{ project.caseStudy.solution }}</div>
      </div>

      <div class="modal-block">
        <div class="modal-block-title">03 / Capabilities &amp; Live Links</div>
        <div class="modal-block-metrics">
          <span>{{ project.caseStudy.capabilitiesSummary }}</span>
          <template v-if="project.liveUrl && project.caseStudy.liveHostText">
            <span> &bull; Live at </span>
            <a
              :href="project.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="modal-live-link"
            >
              {{ project.caseStudy.liveHostText }}
            </a>
          </template>
        </div>
      </div>

      <div class="modal-block">
        <div class="modal-block-title">Built With</div>
        <div v-if="project.caseStudy.techStack?.length" class="modal-tech-pills">
          <span v-for="tech in project.caseStudy.techStack" :key="tech" class="pillar-tag">
            {{ tech }}
          </span>
        </div>
        <div v-else class="modal-block-tech">{{ project.caseStudy.tech }}</div>
      </div>

      <div class="case-modal-actions">
        <RouterLink
          :to="{ path: '/contact', query: { focus: project.primaryPriority, project: project.id } }"
          class="cta-pill-btn"
          @click="emit('close')"
        >
          <span>Build Something Similar</span>
          <span class="cta-arrow-pocket" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </RouterLink>

        <a
          v-if="project.liveUrl"
          :href="project.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-outline-teal"
        >
          <span>{{ project.liveActionLabel }}</span>
          <span aria-hidden="true">&#8599;</span>
        </a>
      </div>
    </div>

    <div
      v-if="project && zoomOpen"
      class="case-modal-lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="`Full screenshot preview of ${project.caseStudy.title}`"
      @click.self="closeZoom"
    >
      <button
        ref="lightboxCloseBtnRef"
        type="button"
        class="case-modal-lightbox-close"
        aria-label="Close zoomed preview"
        @click="closeZoom"
      >
        &times;
      </button>
      <img
        :src="PROJECT_THUMBNAILS[project.imageKey]"
        :alt="project.alt"
        :width="project.width"
        :height="project.height"
        class="case-modal-lightbox-img"
      />
    </div>
  </div>
</template>
