<!-- Gene - Nov, 23, 2026: Contact view with native button priority toggles, brief builder, and direct email actions -->
<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { CONTACT_DATA, DISPLAY_CONFIG, SITE_META } from '@/data/siteContent';
import { formatPrioritySummary, buildClipboardBrief, buildMailtoHref } from '@/utils/briefBuilder';
import { useClipboard } from '@/composables/useClipboard';
import { useParallaxMotion } from '@/composables/useParallaxMotion';
import { useCardTilt } from '@/composables/useCardTilt';

const viewRef = ref(null);
useParallaxMotion(viewRef);
useCardTilt(viewRef);

const { copyTextToClipboard, showToast } = useClipboard();

const selectedPriorities = ref(CONTACT_DATA.briefBuilder.priorities.map((p) => p.id));
const briefCopiedBadge = ref(false);
const emailCopiedBadge = ref(false);
let briefBadgeTimer = null;
let emailBadgeTimer = null;

function isSelected(id) {
  return selectedPriorities.value.includes(id);
}

function togglePriority(id) {
  if (isSelected(id)) {
    selectedPriorities.value = selectedPriorities.value.filter((item) => item !== id);
  } else {
    selectedPriorities.value = [...selectedPriorities.value, id];
  }
}

const summaryText = computed(() =>
  formatPrioritySummary(selectedPriorities.value, CONTACT_DATA.briefBuilder.priorities)
);

const briefMailtoHref = computed(() =>
  buildMailtoHref(selectedPriorities.value, CONTACT_DATA.briefBuilder.priorities, SITE_META.email)
);

const directInquiryHref = `mailto:${SITE_META.email}?subject=${encodeURIComponent(CONTACT_DATA.directBox.inquirySubject)}`;

async function handleCopyBrief() {
  const brief = buildClipboardBrief(
    selectedPriorities.value,
    CONTACT_DATA.briefBuilder.priorities,
    SITE_META.email
  );
  const copied = await copyTextToClipboard(brief);
  briefCopiedBadge.value = true;
  clearTimeout(briefBadgeTimer);
  briefBadgeTimer = setTimeout(() => {
    briefCopiedBadge.value = false;
  }, 2500);
  showToast(copied ? 'Project brief copied to clipboard!' : `Brief prepared — email ${SITE_META.email}`);
}

async function handleCopyEmail() {
  const copied = await copyTextToClipboard(SITE_META.email);
  emailCopiedBadge.value = true;
  clearTimeout(emailBadgeTimer);
  emailBadgeTimer = setTimeout(() => {
    emailCopiedBadge.value = false;
  }, 2500);
  showToast(copied ? `Copied ${SITE_META.email} to clipboard!` : `Direct email: ${SITE_META.email}`);
}

onBeforeUnmount(() => {
  clearTimeout(briefBadgeTimer);
  clearTimeout(emailBadgeTimer);
});
</script>

<template>
  <div ref="viewRef">
    <section class="page-hero">
      <div class="section-inner" data-parallax-speed="0.035">
        <div class="page-eyebrow">{{ CONTACT_DATA.hero.eyebrow }}</div>
        <h1 class="page-title">
          {{ CONTACT_DATA.hero.titleStart }}
          <strong>{{ CONTACT_DATA.hero.titleAccent }}</strong>
          <span class="ink-dark"> {{ CONTACT_DATA.hero.titleEnd }}</span>
        </h1>
        <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="page-lead">
          {{ CONTACT_DATA.hero.lead }}
        </p>
      </div>
    </section>

    <section class="content-section content-section-tight">
      <div class="section-inner">
        <div class="frosted-panel">
          <div class="page-eyebrow">{{ CONTACT_DATA.briefBuilder.eyebrow }}</div>
          <h2 class="brief-heading">{{ CONTACT_DATA.briefBuilder.heading }}</h2>
          <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="brief-subtitle">
            {{ CONTACT_DATA.briefBuilder.subtitle }}
          </p>

          <div class="priority-checklist-grid">
            <button
              v-for="item in CONTACT_DATA.briefBuilder.priorities"
              :key="item.id"
              type="button"
              class="priority-choice-card"
              :class="{
                selected: isSelected(item.id),
                'priority-choice-card--with-copy': DISPLAY_CONFIG.showExtendedCopy
              }"
              :aria-pressed="String(isSelected(item.id))"
              @click="togglePriority(item.id)"
            >
              <span class="priority-check-box" aria-hidden="true">
                {{ isSelected(item.id) ? '&#10003;' : '' }}
              </span>
              <span>
                <span class="priority-choice-title" style="display: block;">{{ item.title }}</span>
                <span v-if="DISPLAY_CONFIG.showExtendedCopy" class="priority-choice-desc" style="display: block;">
                  {{ item.desc }}
                </span>
              </span>
            </button>
          </div>

          <div class="brief-action-bar">
            <div class="brief-status-text">
              Selected Focus: <strong>{{ summaryText }}</strong>
            </div>

            <div class="action-row">
              <button
                type="button"
                class="cta-pill-btn"
                aria-label="Copy assembled brief to clipboard"
                @click="handleCopyBrief"
              >
                <span>Copy Project Brief</span>
                <span class="copied-badge" :class="{ show: briefCopiedBadge }">Copied!</span>
                <span class="cta-arrow-pocket" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </span>
              </button>

              <a :href="briefMailtoHref" class="btn-outline-teal">
                <span>Send by Email</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Direct Email Box -->
        <div class="contact-email-box">
          <div class="contact-email-meta">
            <span class="contact-email-kicker">{{ CONTACT_DATA.directBox.label }}</span>
            <span class="email-display">{{ CONTACT_DATA.directBox.email }}</span>
          </div>

          <div class="action-row">
            <button
              type="button"
              class="cta-pill-btn"
              aria-label="Copy official email to clipboard"
              @click="handleCopyEmail"
            >
              <span>Copy Email</span>
              <span class="copied-badge" :class="{ show: emailCopiedBadge }">Copied!</span>
              <span class="cta-arrow-pocket" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </span>
            </button>

            <a :href="directInquiryHref" class="btn-outline-teal btn-outline-cosmic">
              <span>Open Mail App</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Availability Cards -->
        <div class="contact-channels-grid">
          <div v-for="channel in CONTACT_DATA.channels" :key="channel.label" class="contact-channel-card">
            <div class="project-cat">{{ channel.label }}</div>
            <div class="channel-value">{{ channel.value }}</div>
            <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="channel-desc">{{ channel.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
