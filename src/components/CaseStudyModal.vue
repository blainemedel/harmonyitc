<!-- Gene - Nov, 23, 2026: Accessible Case Study dialog with focus management, tab trapping, Escape close, and zero v-html -->
<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
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

function getFocusableElements() {
  if (!modalCardRef.value) return [];
  return Array.from(
    modalCardRef.value.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  );
}

function handleKeyDown(e) {
  if (!props.project) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    emit('close');
    return;
  }

  if (e.key === 'Tab') {
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
        <div class="modal-block-tech">{{ project.caseStudy.tech }}</div>
      </div>
    </div>
  </div>
</template>
