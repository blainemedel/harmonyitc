<!-- Gene - Nov, 24, 2026: Shared closing CTA strip used cleanly at the bottom of Home, About, and Projects -->
<script setup>
import { RouterLink } from 'vue-router';
import { DISPLAY_CONFIG } from '@/data/siteContent';

defineProps({
  eyebrow: {
    type: String,
    required: true
  },
  headingLead: {
    type: String,
    required: true
  },
  headingAccent: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  primaryLabel: {
    type: String,
    required: true
  },
  primaryTo: {
    type: String,
    required: true
  },
  secondaryLabel: {
    type: String,
    default: ''
  },
  secondaryTo: {
    type: String,
    default: ''
  },
  // Gene - Nov, 24, 2026: Added optional direct email action for open big-text closing band
  secondaryEmail: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <!-- Gene - Nov, 24, 2026: Replaced boxed frosted-panel CTA strip with open frameless big-type editorial band flowing into footer -->
  <!--
  <section class="unified-cta-section">
    <div class="section-inner">
      <div class="frosted-panel unified-cta-strip">
        <div class="unified-cta-copy">
          <div class="page-eyebrow unified-cta-eyebrow">{{ eyebrow }}</div>
          <h2 class="unified-cta-heading">
            {{ headingLead }}
            <span v-if="headingAccent">{{ ' ' }}{{ headingAccent }}</span>
          </h2>
          <p v-if="DISPLAY_CONFIG.showExtendedCopy && desc" class="unified-cta-desc">
            {{ desc }}
          </p>
        </div>

        <div class="action-row">
          <RouterLink :to="primaryTo" class="cta-pill-btn cta-lg">
            <span>{{ primaryLabel }}</span>
            <span class="cta-arrow-pocket" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </RouterLink>

          <RouterLink v-if="secondaryLabel && secondaryTo" :to="secondaryTo" class="btn-outline-teal">
            <span>{{ secondaryLabel }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
  -->
  <section class="closing-band">
    <div class="section-inner">
      <div class="ed-line-draw closing-band-rule" aria-hidden="true" />
      <div class="closing-band-inner">
        <div class="closing-band-copy">
          <div class="page-eyebrow closing-band-eyebrow">{{ eyebrow }}</div>
          <h2 class="closing-band-heading">
            <span>{{ headingLead }}</span>{{ ' ' }}<strong v-if="headingAccent">{{ headingAccent }}</strong>
          </h2>
          <p v-if="DISPLAY_CONFIG.showExtendedCopy && desc" class="unified-cta-desc">
            {{ desc }}
          </p>
        </div>

        <div class="action-row closing-band-actions">
          <RouterLink :to="primaryTo" class="cta-pill-btn cta-lg" data-magnetic>
            <span>{{ primaryLabel }}</span>
            <span class="cta-arrow-pocket" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </RouterLink>

          <a
            v-if="secondaryEmail"
            :href="`mailto:${secondaryEmail}`"
            class="closing-email-link"
            data-magnetic
          >
            <span>{{ secondaryEmail }}</span>
            <span aria-hidden="true">&#8599;</span>
          </a>

          <RouterLink
            v-else-if="secondaryLabel && secondaryTo"
            :to="secondaryTo"
            class="btn-outline-teal"
            data-magnetic
          >
            <span>{{ secondaryLabel }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
