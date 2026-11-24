<!-- Gene - Nov, 24, 2026: Projects view with platform tabs, clickable thumbnails, ?case= deep linking, and UnifiedCtaStrip -->
<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DISPLAY_CONFIG, PROJECTS_DATA } from '@/data/siteContent';
import { PROJECT_THUMBNAILS } from '@/data/mediaAssets';
import { filterProjectsByCategory } from '@/utils/briefBuilder';
import CaseStudyModal from '@/components/CaseStudyModal.vue';
import UnifiedCtaStrip from '@/components/UnifiedCtaStrip.vue';
import { useParallaxMotion } from '@/composables/useParallaxMotion';
import { useCardTilt } from '@/composables/useCardTilt';

const route = useRoute();
const router = useRouter();
const viewRef = ref(null);
useParallaxMotion(viewRef);
useCardTilt(viewRef);

const activeFilter = ref('all');
const activeProject = ref(null);
let lastTriggerEl = null;

const visibleProjects = computed(() =>
  filterProjectsByCategory(PROJECTS_DATA.projects, activeFilter.value)
);

function selectFilter(id) {
  activeFilter.value = id;
}

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
    <!-- Projects Intro & Platform Category Filter -->
    <section class="page-hero">
      <div class="section-inner" data-parallax-speed="0.035">
        <div class="page-eyebrow">{{ PROJECTS_DATA.hero.eyebrow }}</div>
        <h1 class="page-title">
          {{ PROJECTS_DATA.hero.titleStart }}
          <strong>{{ PROJECTS_DATA.hero.titleAccent }}</strong>
          <span class="ink-dark"> {{ PROJECTS_DATA.hero.titleEnd }}</span>
        </h1>
        <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="page-lead">
          {{ PROJECTS_DATA.hero.lead }}
        </p>

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

    <!-- Projects Gallery -->
    <section class="content-section content-section-tight">
      <div class="section-inner">
        <div class="gallery-grid-3">
          <article v-for="project in visibleProjects" :key="project.id" class="project-card">
            <button
              type="button"
              class="project-thumb project-thumb-btn"
              :class="project.thumbModifier"
              :aria-label="`Inspect ${project.title} case study`"
              @click="openCaseStudy(project, $event)"
            >
              <img
                :src="PROJECT_THUMBNAILS[project.imageKey]"
                :alt="project.alt"
                :width="project.width"
                :height="project.height"
                loading="lazy"
              />
            </button>

            <div class="project-body">
              <div class="project-cat">{{ project.categoryLabel }}</div>
              <h2 class="project-title">{{ project.title }}</h2>
              <p v-if="DISPLAY_CONFIG.showExtendedCopy" class="project-desc">{{ project.desc }}</p>

              <div class="project-metrics">
                <div v-for="metric in project.metrics" :key="metric.value">
                  <div class="p-metric-val">{{ metric.value }}</div>
                  <div class="p-metric-lbl">{{ metric.label }}</div>
                </div>
              </div>

              <div class="project-footer">
                <span class="project-tag-pill">{{ project.tagPill }}</span>
                <div class="project-footer-actions">
                  <a
                    v-if="project.liveUrl"
                    class="project-live-link"
                    :href="project.liveUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{{ project.liveActionLabel }}</span>
                    <span aria-hidden="true">&#8599;</span>
                  </a>

                  <button
                    type="button"
                    class="cta-pill-btn"
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
                </div>
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
