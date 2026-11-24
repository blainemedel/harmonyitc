<!-- Gene - Nov, 24, 2026: Streamlined About Us without mission split card, extended founder bios behind copy toggle, and bottom UnifiedCtaStrip -->
<script setup>
import { ref } from 'vue';
import { ABOUT_DATA, DISPLAY_CONFIG } from '@/data/siteContent';
import { FOUNDER_PHOTOS } from '@/data/mediaAssets';
import UnifiedCtaStrip from '@/components/UnifiedCtaStrip.vue';
import { useParallaxMotion } from '@/composables/useParallaxMotion';
import { useCardTilt } from '@/composables/useCardTilt';

const viewRef = ref(null);
useParallaxMotion(viewRef);
useCardTilt(viewRef);
</script>

<template>
  <div ref="viewRef">
    <!-- About Page Intro -->
    <section class="page-hero">
      <div class="section-inner" data-parallax-speed="0.035">
        <div class="page-eyebrow">{{ ABOUT_DATA.hero.eyebrow }}</div>
        <h1 class="page-title">
          {{ ABOUT_DATA.hero.titleStart }}
          <strong>{{ ABOUT_DATA.hero.titleAccent }}</strong>
          <span class="ink-dark"> {{ ABOUT_DATA.hero.titleEnd }}</span>
        </h1>
        <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="page-lead">
          {{ ABOUT_DATA.hero.lead }}
        </p>
      </div>
    </section>

    <!-- Founding Team Section -->
    <section class="team-section founders-showcase">
      <div class="section-inner">
        <div class="team-header-row">
          <div>
            <div class="page-eyebrow">{{ ABOUT_DATA.team.eyebrow }}</div>
            <h2 class="team-heading">
              <span class="team-heading-sub">{{ ABOUT_DATA.team.headingSub }}</span>
              <span class="team-heading-main">{{ ABOUT_DATA.team.headingMain }}</span>
            </h2>
          </div>
          <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="team-intro">
            {{ ABOUT_DATA.team.intro }}
          </p>
        </div>

        <div class="founders-grid">
          <article v-for="founder in ABOUT_DATA.team.founders" :key="founder.id" class="founder-profile-card">
            <div class="founder-card-meta">
              <span class="founder-index-tag">{{ founder.indexTag }}</span>
              <span class="founder-domain-pill">{{ founder.domainPill }}</span>
            </div>

            <div class="founder-hero-row">
              <div class="founder-portrait-frame" data-parallax-speed="-0.015">
                <img
                  :src="FOUNDER_PHOTOS[founder.imageKey]"
                  :alt="founder.alt"
                  class="founder-portrait-img"
                  :class="founder.imageClass"
                  :width="founder.width"
                  :height="founder.height"
                  loading="lazy"
                />
              </div>
              <div class="founder-identity">
                <h3 class="team-name">{{ founder.name }}</h3>
                <div class="founder-fullname">{{ founder.fullName }}</div>
                <div class="team-role">{{ founder.role }}</div>
                <span class="founder-accent-bar" aria-hidden="true" />
              </div>
            </div>

            <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="team-bio">{{ founder.bio }}</p>

            <div class="founder-focus-block">
              <span class="founder-focus-label">Core Focus</span>
              <div class="founder-focus-tags">
                <span v-for="tag in founder.focusTags" :key="tag" class="pillar-tag">{{ tag }}</span>
              </div>
            </div>

            <div class="founder-links-bar">
              <a
                v-if="founder.portfolio"
                :href="founder.portfolio.url"
                target="_blank"
                rel="noopener noreferrer"
                class="founder-portfolio-link"
                :aria-label="founder.portfolio.ariaLabel"
              >
                <span>{{ founder.portfolio.text }}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>

              <div class="founder-social-group">
                <a
                  v-if="founder.github"
                  :href="founder.github.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="founder-icon-link"
                  :aria-label="founder.github.label"
                  title="GitHub"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>

                <a
                  v-if="founder.linkedin"
                  :href="founder.linkedin.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="founder-icon-link"
                  :aria-label="founder.linkedin.label"
                  title="LinkedIn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 4-Step Process -->
    <section class="content-section content-section-tight">
      <div class="section-inner">
        <div class="page-eyebrow">{{ ABOUT_DATA.process.eyebrow }}</div>
        <h2 class="section-heading section-heading--sm">
          {{ ABOUT_DATA.process.headingLead }}
          <strong>{{ ABOUT_DATA.process.headingAccent }}</strong>
        </h2>

        <div class="process-grid-4">
          <div v-for="step in ABOUT_DATA.process.steps" :key="step.num" class="process-card">
            <div class="process-num">{{ step.num }}</div>
            <div class="process-tag">{{ step.tag }}</div>
            <h3 class="process-title">{{ step.title }}</h3>
            <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="process-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Unified Closing Callout -->
    <UnifiedCtaStrip v-bind="ABOUT_DATA.closingCta" />
  </div>
</template>
