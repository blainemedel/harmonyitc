<!-- Gene - Nov, 24, 2026: Unified 2-column Contact Hub with real Vercel Function inquiry submission and direct info sidebar -->
<script setup>
import { ref, reactive, computed, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { CONTACT_DATA, DISPLAY_CONFIG, PROJECTS_DATA, SITE_META } from '@/data/siteContent';
import { buildClipboardBrief, buildInquiryFallbackMailto } from '@/utils/briefBuilder';
import { validateInquiryPayload, parseContactQuery } from '@/utils/contactInquiry';
import { useClipboard } from '@/composables/useClipboard';
import { useParallaxMotion } from '@/composables/useParallaxMotion';
import { useCardTilt } from '@/composables/useCardTilt';

const route = useRoute();
const viewRef = ref(null);
useParallaxMotion(viewRef);
useCardTilt(viewRef);

const { copyTextToClipboard, showToast } = useClipboard();

const priorityItems = CONTACT_DATA.briefBuilder.priorities;
const validPriorityIds = priorityItems.map((p) => p.id);

const selectedPriorities = ref([...validPriorityIds]);
const referencedProjectTitle = ref('');

const form = reactive({
  name: '',
  email: '',
  company: '',
  message: '',
  website: ''
});

const fieldErrors = ref({});
const submitState = ref('idle'); // 'idle' | 'submitting' | 'sent' | 'fallback' | 'error'
const serverMessage = ref('');
const briefCopiedBadge = ref(false);
const emailCopiedBadge = ref(false);
let briefBadgeTimer = null;
let emailBadgeTimer = null;

watch(
  () => [route.query.focus, route.query.project],
  () => {
    const parsed = parseContactQuery(route.query, validPriorityIds, PROJECTS_DATA.projects);
    selectedPriorities.value = parsed.priorities;
    referencedProjectTitle.value = parsed.referencedProjectTitle;
    if (parsed.starterMessage && !form.message.trim()) {
      form.message = parsed.starterMessage;
    }
  },
  { immediate: true }
);

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

const fallbackMailtoHref = computed(() =>
  buildInquiryFallbackMailto(
    {
      name: form.name,
      email: form.email,
      company: form.company,
      message: form.message,
      priorities: selectedPriorities.value
    },
    priorityItems,
    SITE_META.email
  )
);

const directInquiryHref = `mailto:${SITE_META.email}?subject=${encodeURIComponent(
  CONTACT_DATA.directBox.inquirySubject
)}`;

async function handleCopyBrief() {
  const brief = buildClipboardBrief(selectedPriorities.value, priorityItems, SITE_META.email);
  const fullBrief = form.message.trim()
    ? `${brief}\n\nProject Details:\n${form.message.trim()}`
    : brief;
  const copied = await copyTextToClipboard(fullBrief);
  briefCopiedBadge.value = true;
  clearTimeout(briefBadgeTimer);
  briefBadgeTimer = setTimeout(() => {
    briefCopiedBadge.value = false;
  }, 2500);
  showToast(
    copied ? 'Project brief copied to clipboard!' : `Brief prepared — email ${SITE_META.email}`
  );
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

async function handleSubmit() {
  fieldErrors.value = {};
  serverMessage.value = '';

  const payload = {
    name: form.name,
    email: form.email,
    company: form.company,
    message: form.message,
    priorities: selectedPriorities.value,
    website: form.website
  };

  const clientCheck = validateInquiryPayload(payload, validPriorityIds);
  if (clientCheck.isSpam) {
    submitState.value = 'sent';
    return;
  }
  if (!clientCheck.ok) {
    fieldErrors.value = clientCheck.errors;
    return;
  }

  submitState.value = 'submitting';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok) {
      submitState.value = 'sent';
      return;
    }

    if (res.status === 400 && data.fieldErrors) {
      fieldErrors.value = data.fieldErrors;
      submitState.value = 'error';
      serverMessage.value = data.error || 'Please review the highlighted fields.';
      return;
    }

    // 503 NOT_CONFIGURED, 502 UPSTREAM_ERROR, 500, or Vite local dev without Vercel API
    submitState.value = 'fallback';
    serverMessage.value =
      data.error ||
      'Direct web delivery is temporarily unavailable. You can send your filled brief in one click below.';
  } catch (_) {
    submitState.value = 'fallback';
    serverMessage.value =
      'Could not reach the inquiry service. You can open your mail app or copy your prefilled brief below.';
  }
}

function resetInquiryForm() {
  form.name = '';
  form.email = '';
  form.company = '';
  form.message = '';
  form.website = '';
  fieldErrors.value = {};
  serverMessage.value = '';
  submitState.value = 'idle';
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
        <div class="contact-hub-grid">
          <!-- Left: Unified Priority Chips + Working Inquiry Form -->
          <div class="frosted-panel contact-form-panel">
            <div class="page-eyebrow">{{ CONTACT_DATA.briefBuilder.eyebrow }}</div>
            <h2 class="brief-heading">{{ CONTACT_DATA.briefBuilder.heading }}</h2>
            <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="brief-subtitle">
              {{ CONTACT_DATA.briefBuilder.subtitle }}
            </p>

            <div v-if="referencedProjectTitle" class="referenced-project-note">
              Inspired by: <strong>{{ referencedProjectTitle }}</strong>
            </div>

            <div v-if="submitState === 'sent'" class="form-success-card" role="status" aria-live="polite">
              <div class="page-eyebrow">Inquiry Received</div>
              <h3 class="form-success-title">Thanks — Paulo, Gene &amp; Bry will follow up shortly.</h3>
              <p class="form-success-body">
                We typically reply within 24 hours on business days ({{ SITE_META.email }}).
              </p>
              <div class="action-row">
                <button type="button" class="btn-outline-teal" @click="resetInquiryForm">
                  <span>Send Another Inquiry</span>
                </button>
              </div>
            </div>

            <form v-else class="contact-form" novalidate @submit.prevent="handleSubmit">
              <div class="priority-chips-grid" role="group" aria-label="Project Focus Areas">
                <button
                  v-for="item in priorityItems"
                  :key="item.id"
                  type="button"
                  class="priority-chip"
                  :class="{ selected: isSelected(item.id) }"
                  :aria-pressed="String(isSelected(item.id))"
                  @click="togglePriority(item.id)"
                >
                  <span class="priority-check-box" aria-hidden="true">
                    {{ isSelected(item.id) ? '&#10003;' : '' }}
                  </span>
                  <span class="priority-chip-title">{{ item.title }}</span>
                </button>
              </div>

              <!-- Honeypot field for spam bots -->
              <div class="sr-only" aria-hidden="true">
                <label for="contact-website">Website</label>
                <input
                  id="contact-website"
                  v-model="form.website"
                  type="text"
                  tabindex="-1"
                  autocomplete="off"
                />
              </div>

              <div class="form-grid-2">
                <div class="form-field">
                  <label class="form-label" for="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    v-model="form.name"
                    type="text"
                    class="form-input"
                    :class="{ 'is-invalid': fieldErrors.name }"
                    placeholder="e.g. Alex Rivera"
                    required
                    autocomplete="name"
                    :aria-invalid="Boolean(fieldErrors.name)"
                    :aria-describedby="fieldErrors.name ? 'contact-name-error' : undefined"
                  />
                  <span v-if="fieldErrors.name" id="contact-name-error" class="form-error">
                    {{ fieldErrors.name }}
                  </span>
                </div>

                <div class="form-field">
                  <label class="form-label" for="contact-email">Email Address</label>
                  <input
                    id="contact-email"
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    :class="{ 'is-invalid': fieldErrors.email }"
                    placeholder="you@company.com"
                    required
                    autocomplete="email"
                    :aria-invalid="Boolean(fieldErrors.email)"
                    :aria-describedby="fieldErrors.email ? 'contact-email-error' : undefined"
                  />
                  <span v-if="fieldErrors.email" id="contact-email-error" class="form-error">
                    {{ fieldErrors.email }}
                  </span>
                </div>
              </div>

              <div class="form-field">
                <label class="form-label" for="contact-company">
                  Company / Organization <span class="form-optional">(Optional)</span>
                </label>
                <input
                  id="contact-company"
                  v-model="form.company"
                  type="text"
                  class="form-input"
                  :class="{ 'is-invalid': fieldErrors.company }"
                  placeholder="Your business name"
                  autocomplete="organization"
                  :aria-invalid="Boolean(fieldErrors.company)"
                  :aria-describedby="fieldErrors.company ? 'contact-company-error' : undefined"
                />
                <span v-if="fieldErrors.company" id="contact-company-error" class="form-error">
                  {{ fieldErrors.company }}
                </span>
              </div>

              <div class="form-field">
                <label class="form-label" for="contact-message">Project Details</label>
                <textarea
                  id="contact-message"
                  v-model="form.message"
                  rows="4"
                  class="form-textarea"
                  :class="{ 'is-invalid': fieldErrors.message }"
                  placeholder="What are you looking to build or streamline?"
                  required
                  :aria-invalid="Boolean(fieldErrors.message)"
                  :aria-describedby="fieldErrors.message ? 'contact-message-error' : undefined"
                />
                <span v-if="fieldErrors.message" id="contact-message-error" class="form-error">
                  {{ fieldErrors.message }}
                </span>
              </div>

              <div v-if="submitState === 'error'" class="form-alert form-alert--error" role="alert">
                {{ serverMessage }}
              </div>

              <div v-if="submitState === 'fallback'" class="form-alert form-alert--fallback" role="status">
                <p>{{ serverMessage }}</p>
                <div class="action-row" style="margin-top: 0.85rem;">
                  <a :href="fallbackMailtoHref" class="cta-pill-btn">
                    <span>Open Prefilled Email</span>
                    <span class="cta-arrow-pocket" aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </span>
                  </a>
                  <button type="button" class="btn-outline-teal" @click="handleCopyBrief">
                    <span>Copy Brief</span>
                  </button>
                </div>
              </div>

              <div class="brief-action-bar">
                <button
                  type="submit"
                  class="cta-pill-btn cta-lg"
                  :disabled="submitState === 'submitting'"
                >
                  <span>{{ submitState === 'submitting' ? 'Sending...' : 'Send Inquiry' }}</span>
                  <span class="cta-arrow-pocket" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </button>

                <button
                  type="button"
                  class="btn-outline-teal"
                  aria-label="Copy assembled brief to clipboard"
                  @click="handleCopyBrief"
                >
                  <span>Copy Brief</span>
                  <span class="copied-badge" :class="{ show: briefCopiedBadge }">Copied!</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Right: Compact Dark-Cosmic Direct Info Sidebar -->
          <aside class="contact-info-sidebar" aria-label="Direct Contact Details">
            <div class="cosmic-eyebrow">{{ CONTACT_DATA.directBox.label }}</div>
            <div class="email-display sidebar-email">{{ CONTACT_DATA.directBox.email }}</div>

            <div class="action-row sidebar-actions">
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

            <div class="sidebar-divider" />

            <dl class="sidebar-meta-list">
              <div v-for="channel in CONTACT_DATA.channels" :key="channel.label" class="sidebar-meta-item">
                <dt class="project-cat">{{ channel.label }}</dt>
                <dd class="channel-value">{{ channel.value }}</dd>
                <dd v-if="DISPLAY_CONFIG.showExtendedCopy" class="channel-desc">{{ channel.desc }}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>
