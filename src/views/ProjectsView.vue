<!-- Gene - Nov, 24, 2026: Editorial alternating SwitchFiber showcase rows without redundant filter rail, preserving deep-linked CaseStudyModal -->
<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PROJECTS_DATA } from '@/data/siteContent';
import { PROJECT_THUMBNAILS } from '@/data/mediaAssets';
import CaseStudyModal from '@/components/CaseStudyModal.vue';
import UnifiedCtaStrip from '@/components/UnifiedCtaStrip.vue';
import { useParallaxMotion } from '@/composables/useParallaxMotion';
import { useCardTilt } from '@/composables/useCardTilt';

// Gene - Nov, 24, 2026: Removed unused platform filter tabs for the 3-project SwitchFiber showcase
/*
import { DISPLAY_CONFIG, PROJECTS_DATA } from '@/data/siteContent';
import { filterProjectsByCategory } from '@/utils/briefBuilder';
const activeFilter = ref('all');
const visibleProjects = computed(() =>
  filterProjectsByCategory(PROJECTS_DATA.projects, activeFilter.value)
);
function selectFilter(id) {
  activeFilter.value = id;
}
*/

const route = useRoute();
const router = useRouter();
const viewRef = ref(null);
useParallaxMotion(viewRef);
useCardTilt(viewRef);

const activeProject = ref(null);
let lastTriggerEl = null;

const visibleProjects = computed(() => PROJECTS_DATA.projects);

function openCaseStudy(project, event) {
  lastTriggerEl = event?.currentTarget || null;
  activeProject.value = project;
}

function closeCaseStudy() {
  activeProject.value = null;
  if (route.query.case) {
    router.replace({ path: '/projects' });
  }
  lastTriggerEl?.focus();
  lastTriggerEl = null;
}

watch(
  () => route.query.case,
  (caseId) => {
    if (!caseId) return;
    const matched = PROJECTS_DATA.projects.find((p) => p.id === String(caseId));
    if (matched) {
      activeProject.value = matched;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div ref="viewRef">
    <!-- Gene - Nov, 24, 2026: Replaced filter rail + 3-column card grid with alternating full-width editorial split rows -->
    <!--
    <section class="page-hero">
      <div class="section-inner" data-parallax-speed="0.035">
        <div class="page-eyebrow">{{ PROJECTS_DATA.hero.eyebrow }}</div>
        <h1 class="page-title">
          {{ PROJECTS_DATA.hero.titleStart }}
          <strong>{{ PROJECTS_DATA.hero.titleAccent }}</strong>
          <span class="ink-dark"> {{ PROJECTS_DATA.hero.titleEnd }}</span>
        </h1>
        <div class="filter-rail" role="tablist" aria-label="Platform Categories">
          <button
            v-for="tab in PROJECTS_DATA.filters"
            :key="tab.id"
            type="button"
            role="tab"
            class="filter-btn"
            :class="{ active: activeFilter === tab.id }"
            :aria-selected="String(activeFilter === tab.id)"
            @click="selectFilter(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </section>
    -->

    <!-- Editorial Projects Intro -->
    <section class="editorial-page-hero">
      <div class="section-inner">
        <div class="page-eyebrow">{{ PROJECTS_DATA.hero.eyebrow }}</div>
        <h1 class="editorial-page-title">
          <span class="reveal-mask">
            <span class="reveal-mask-inner" style="--mask-delay: 0ms;">
              {{ PROJECTS_DATA.hero.titleStart }}{{ ' ' }}<strong>{{ PROJECTS_DATA.hero.titleAccent }}</strong>
            </span>
          </span>
          <span class="reveal-mask">
            <span class="reveal-mask-inner ink-dark" style="--mask-delay: 55ms;">
              {{ PROJECTS_DATA.hero.titleEnd }}
            </span>
          </span>
        </h1>
        <p class="editorial-page-lead ed-reveal">{{ PROJECTS_DATA.hero.lead }}</p>
        <div class="ed-line-draw editorial-hero-rule" aria-hidden="true" />
      </div>
    </section>

    <!-- Alternating Wide Editorial Split Rows -->
    <section class="projects-editorial-section" aria-label="SwitchFiber Platforms">
      <div class="section-inner">
        <div class="project-editorial-list">
          <article
            v-for="(project, idx) in visibleProjects"
            :key="project.id"
            class="project-row"
            :class="{ 'project-row--reversed': idx % 2 === 1 }"
          >
            <button
              type="button"
              class="project-media-frame work-media-parallax"
              :class="project.thumbModifier"
              :aria-label="`Inspect ${project.title} case study`"
              @click="openCaseStudy(project, $event)"
            >
              <img
                :src="PROJECT_THUMBNAILS[project.imageKey]"
                :alt="project.alt"
                :width="project.width"
                :height="project.height"
                class="project-media-img"
                loading="lazy"
              />
              <span class="bento-inspect-chip" aria-hidden="true">Inspect &#8599;</span>
            </button>

            <div class="project-editorial-info">
              <div class="project-editorial-head">
                <span class="project-editorial-index">{{ project.indexNum }}</span>
                <span class="project-editorial-sub">{{ project.subtitle }}</span>
              </div>

              <h2 class="project-editorial-title">{{ project.title }}</h2>
              <p class="project-editorial-desc">{{ project.shortDesc }}</p>

              <div class="project-editorial-stats">
                <div v-for="metric in project.metrics" :key="metric.value" class="project-stat-item">
                  <div class="p-metric-val">{{ metric.value }}</div>
                  <div class="p-metric-lbl">{{ metric.label }}</div>
                </div>
              </div>

              <div class="project-editorial-actions">
                <button
                  type="button"
                  class="cta-pill-btn"
                  data-magnetic
                  @click="openCaseStudy(project, $event)"
                >
                  <span>Case Study</span>
                  <span class="cta-arrow-pocket" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </button>

                <a
                  v-if="project.liveUrl"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="editorial-text-link"
                >
                  <span>{{ project.liveActionLabel }}</span>
                  <span aria-hidden="true">&#8599;</span>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <UnifiedCtaStrip v-bind="PROJECTS_DATA.closingCta" />

    <CaseStudyModal :project="activeProject" @close="closeCaseStudy" />
  </div>
</template>
