<!-- Gene - Nov, 24, 2026: Open architectural Contact split with direct copyable email, unselected optional scope pills, hairline inputs, and /api/contact delivery -->
<script setup>
import { ref, reactive, computed, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { CONTACT_DATA, PROJECTS_DATA, SITE_META } from '@/data/siteContent';
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

// Gene - Nov, 24, 2026: Initialize scope pills unselected unless ?focus= is explicitly passed
/* const selectedPriorities = ref([...validPriorityIds]); */
const selectedPriorities = ref([]);
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
const emailCopiedBadge = ref(false);
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
  clearTimeout(emailBadgeTimer);
});
</script>

<template>
  <div ref="viewRef">
    <!-- Gene - Nov, 24, 2026: Replaced boxed Contact Hub & multi-button sidebar with open architectural 2-column Contact split -->
    <section class="contact-editorial-section">
      <div class="section-inner">
        <div class="contact-editorial-grid">
          <!-- Left: Editorial Prompt & Direct Copyable Email -->
          <div class="contact-editorial-left">
            <div class="page-eyebrow">{{ CONTACT_DATA.hero.eyebrow }}</div>
            <h1 class="editorial-page-title contact-editorial-title">
              <span class="reveal-mask">
                <span class="reveal-mask-inner" style="--mask-delay: 0ms;">{{ CONTACT_DATA.hero.titleStart }}</span>
              </span>
              <span class="reveal-mask">
                <span class="reveal-mask-inner" style="--mask-delay: 55ms;">
                  <strong>{{ CONTACT_DATA.hero.titleAccent }}</strong>{{ ' ' }}<span class="ink-dark">{{ CONTACT_DATA.hero.titleEnd }}</span>
                </span>
              </span>
            </h1>

            <div class="ed-line-draw contact-left-rule" aria-hidden="true" />

            <div class="contact-direct-block">
              <div class="contact-direct-label">{{ CONTACT_DATA.directBox.label }}</div>
              <div class="contact-email-row">
                <a :href="directInquiryHref" class="contact-email-display">
                  {{ CONTACT_DATA.directBox.email }}
                </a>
                <button
                  type="button"
                  class="contact-copy-chip"
                  aria-label="Copy official email to clipboard"
                  @click="handleCopyEmail"
                >
                  <span>{{ emailCopiedBadge ? 'Copied' : 'Copy' }}</span>
                </button>
              </div>
              <p class="contact-direct-status">
                <span class="ed-live-dot" aria-hidden="true" />
                <span>{{ CONTACT_DATA.directNote }}</span>
              </p>
            </div>
          </div>

          <!-- Right: Frameless Hairline Inquiry Form -->
          <div class="contact-editorial-right">
            <div v-if="referencedProjectTitle" class="referenced-project-note">
              Inspired by: <strong>{{ referencedProjectTitle }}</strong>
            </div>

            <div v-if="submitState === 'sent'" class="form-success-card" role="status" aria-live="polite">
              <div class="page-eyebrow">Inquiry Received</div>
              <h2 class="form-success-title">Thanks — Paulo, Gene &amp; Bry will follow up shortly.</h2>
              <p class="form-success-body">
                We typically reply within 24 hours on business days ({{ SITE_META.email }}).
              </p>
              <div class="action-row">
                <button type="button" class="btn-outline-teal" @click="resetInquiryForm">
                  <span>Send Another Inquiry</span>
                </button>
              </div>
            </div>

            <form v-else class="contact-hairline-form" novalidate @submit.prevent="handleSubmit">
              <div class="scope-group-block">
                <div class="form-label">
                  Scope <span class="form-optional">(Optional)</span>
                </div>
                <div class="scope-pill-group" role="group" aria-label="Project Scope">
                  <button
                    v-for="item in priorityItems"
                    :key="item.id"
                    type="button"
                    class="scope-pill"
                    :class="{ selected: isSelected(item.id) }"
                    :aria-pressed="String(isSelected(item.id))"
                    @click="togglePriority(item.id)"
                  >
                    {{ item.title }}
                  </button>
                </div>
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
                    class="form-input-hairline"
                    :class="{ 'is-invalid': fieldErrors.name }"
                    placeholder="Alex Rivera"
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
                    class="form-input-hairline"
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
                  class="form-input-hairline"
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
                  class="form-textarea-hairline"
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

              <div class="contact-submit-row">
                <button
                  type="submit"
                  class="cta-pill-btn cta-lg"
                  data-magnetic
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
