<!-- Gene - Nov, 23, 2026: Home view with interactive Pitch Focus Switcher, HarmonyEcosystemHub, 4 Pillars, Comparison, and WebGL Cylinder -->
<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { DISPLAY_CONFIG, HERO_PILLARS, HOME_DATA } from '@/data/siteContent';
import HarmonyEcosystemHub from '@/components/HarmonyEcosystemHub.vue';
import PillarArtwork from '@/components/PillarArtwork.vue';
import KineticCylinder from '@/components/KineticCylinder.vue';
import { useParallaxMotion } from '@/composables/useParallaxMotion';
import { useCardTilt } from '@/composables/useCardTilt';

const viewRef = ref(null);
useParallaxMotion(viewRef);
useCardTilt(viewRef);

const activePillar = ref(HERO_PILLARS[0].id);

const currentPillarMeta = computed(
  () => HERO_PILLARS.find((p) => p.id === activePillar.value) || HERO_PILLARS[0]
);

function selectPillar(id) {
  activePillar.value = id;
}
</script>

<template>
  <div ref="viewRef">
    <!-- Section 1: Hero & Interactive Strategic Value Pitch -->
    <section class="hero-section" aria-label="Introduction">
      <div class="hero-container">
        <div class="hero-copy" data-parallax-speed="0.03">
          <div class="hero-eyebrow">{{ HOME_DATA.eyebrow }}</div>
          <h1 class="hero-headline">
            <span class="hero-line-light">{{ HOME_DATA.headline.light }}</span>
            <span class="hero-line-teal">{{ HOME_DATA.headline.accent }}</span>
            <span class="hero-line-dark">{{ HOME_DATA.headline.dark }}</span>
          </h1>
          <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="hero-sublead">
            {{ HOME_DATA.sublead }}
          </p>

          <!-- Interactive Pitch Focus Switcher -->
          <div class="pitch-focus-box">
            <div class="pitch-focus-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{{ HOME_DATA.pitchSwitcherLabel }}</span>
            </div>

            <div class="pitch-focus-pills" role="tablist" aria-label="Business Priorities">
              <button
                v-for="pillar in HERO_PILLARS"
                :key="pillar.id"
                type="button"
                role="tab"
                class="pitch-focus-btn"
                :class="{ active: activePillar === pillar.id }"
                :aria-selected="String(activePillar === pillar.id)"
                @click="selectPillar(pillar.id)"
              >
                <span class="pitch-focus-num">{{ pillar.num }}</span>
                <span>{{ pillar.buttonLabel }}</span>
              </button>
            </div>

            <div class="pitch-focus-panel" role="tabpanel">
              <p>
                <strong>{{ currentPillarMeta.focusPrefix }}</strong>
                {{ currentPillarMeta.focusText }}
              </p>
            </div>
          </div>

          <div class="hero-cta-row">
            <RouterLink to="/#capabilities" class="cta-pill-btn cta-lg">
              <span>See How We Help</span>
              <span class="cta-arrow-pocket" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </span>
            </RouterLink>
            <RouterLink to="/projects" class="btn-outline-teal">
              <span>View Our Work</span>
            </RouterLink>
          </div>
        </div>

        <div class="hero-visual">
          <HarmonyEcosystemHub :active-pillar="activePillar" />
        </div>
      </div>
    </section>

    <!-- Section 2: Business Outcomes Metrics Strip (controlled by DISPLAY_CONFIG.showHomeMetrics) -->
    <section v-if="DISPLAY_CONFIG.showHomeMetrics" class="home-metrics-section" aria-label="Business Impact Outcomes">
      <div class="section-inner">
        <div class="home-metrics-grid">
          <div v-for="metric in HOME_DATA.metrics" :key="metric.title" class="home-metric-card">
            <div class="home-metric-val">{{ metric.value }}</div>
            <div class="home-metric-title">{{ metric.title }}</div>
            <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="home-metric-desc">{{ metric.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: The 4 Core Website Product Pillars -->
    <section id="capabilities" class="home-pillars-section" aria-labelledby="pillars-heading">
      <div class="section-inner">
        <div class="pillars-header-row">
          <div>
            <div class="page-eyebrow">{{ HOME_DATA.pillarsSection.eyebrow }}</div>
            <h2 id="pillars-heading" class="section-heading section-heading--lg">
              {{ HOME_DATA.pillarsSection.headingLead }}
              <strong>{{ HOME_DATA.pillarsSection.headingAccent }}</strong>
            </h2>
          </div>
          <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="team-intro section-subcopy--narrow">
            {{ HOME_DATA.pillarsSection.intro }}
          </p>
        </div>

        <div class="pillars-grid-2x2">
          <article v-for="item in HOME_DATA.pillarsSection.items" :key="item.id" class="pillar-card">
            <div class="pillar-card-top">
              <div class="pillar-icon-badge" aria-hidden="true">
                <svg v-if="item.icon === 'alert'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <svg v-else-if="item.icon === 'star'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg v-else-if="item.icon === 'monitor'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span class="pillar-num-tag">{{ item.areaLabel }}</span>
            </div>

            <PillarArtwork :shape="item.shape" />

            <h3 class="pillar-title">{{ item.title }}</h3>
            <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="pillar-desc">{{ item.desc }}</p>
            <div class="pillar-tags">
              <span v-for="tag in item.tags" :key="tag" class="pillar-tag">{{ tag }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Section 4: Strategic Pitch Comparison Matrix -->
    <section class="home-comparison-section" aria-labelledby="comparison-heading">
      <div class="section-inner">
        <div class="page-eyebrow">{{ HOME_DATA.comparisonSection.eyebrow }}</div>
        <h2 id="comparison-heading" class="section-heading section-heading--md">
          {{ HOME_DATA.comparisonSection.headingLead }}
          <strong class="ink-strong">{{ HOME_DATA.comparisonSection.headingAccent }}</strong>
        </h2>
        <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="section-subcopy">
          {{ HOME_DATA.comparisonSection.intro }}
        </p>

        <div class="comparison-grid-2">
          <div class="comparison-card-passive">
            <div class="process-tag comparison-tag">{{ HOME_DATA.comparisonSection.passive.tag }}</div>
            <h3 class="comparison-card-title">{{ HOME_DATA.comparisonSection.passive.title }}</h3>
            <ul class="comparison-list">
              <li v-for="line in HOME_DATA.comparisonSection.passive.items" :key="line" class="comparison-item">
                <span class="comparison-badge-cross" aria-hidden="true">&times;</span>
                <span>{{ line }}</span>
              </li>
            </ul>
          </div>

          <div class="comparison-card-engine">
            <div class="cosmic-eyebrow comparison-tag">{{ HOME_DATA.comparisonSection.engine.tag }}</div>
            <h3 class="comparison-card-title">{{ HOME_DATA.comparisonSection.engine.title }}</h3>
            <ul class="comparison-list">
              <li v-for="item in HOME_DATA.comparisonSection.engine.items" :key="item.lead" class="comparison-item">
                <span class="comparison-badge-check" aria-hidden="true">&#10003;</span>
                <span><strong>{{ item.lead }}</strong> {{ item.body }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5: Kinetic 3D Typography Cylinder & Conversation Callout -->
    <section class="kinetic-section" aria-label="Upcoming Platform Promise">
      <div class="kinetic-split-grid">
        <div class="kinetic-stage-wrap">
          <h2 class="sr-only">{{ HOME_DATA.kineticSection.srHeading }}</h2>
          <KineticCylinder />
        </div>

        <div class="frosted-panel">
          <div class="page-eyebrow">{{ HOME_DATA.kineticSection.ctaEyebrow }}</div>
          <h2
            class="kinetic-cta-heading"
            :class="{ 'kinetic-cta-heading--with-copy': DISPLAY_CONFIG.showExtendedCopy }"
          >
            {{ HOME_DATA.kineticSection.ctaHeadingLead }}
            <span>{{ HOME_DATA.kineticSection.ctaHeadingAccent }}</span>
          </h2>
          <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="kinetic-cta-desc">
            {{ HOME_DATA.kineticSection.ctaDesc }}
          </p>
          <div class="action-row">
            <RouterLink to="/contact" class="cta-pill-btn cta-lg">
              <span>Talk With Us</span>
              <span class="cta-arrow-pocket" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </RouterLink>
            <RouterLink to="/about" class="btn-outline-teal">
              <span>Meet the Team</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
