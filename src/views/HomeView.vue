<!-- Gene - Nov, 24, 2026: Monumental editorial Home with full-bleed HeroWaveField, kinetic marquee, interactive capability rows, asymmetric SwitchFiber work bento, and CaseStudyModal -->
<script setup>
// Gene - Nov, 24, 2026: Added lifecycle hooks for kinetic harmonic wave motion on hero headline
// import { ref, computed } from 'vue';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink } from 'vue-router';
import { HOME_DATA, PROJECTS_DATA } from '@/data/siteContent';
import { PROJECT_THUMBNAILS } from '@/data/mediaAssets';
import HeroWaveField from '@/components/HeroWaveField.vue';
import UnifiedCtaStrip from '@/components/UnifiedCtaStrip.vue';
import CaseStudyModal from '@/components/CaseStudyModal.vue';
import { useParallaxMotion } from '@/composables/useParallaxMotion';
import { useCardTilt } from '@/composables/useCardTilt';

// Gene - Nov, 24, 2026: Superseded interactive 4-pillar HeroWorkPreview / HarmonyMotionStage script state
/*
import { DISPLAY_CONFIG, HERO_PILLARS, HOME_DATA } from '@/data/siteContent';
import HarmonyMotionStage from '@/components/HarmonyMotionStage.vue';
const activePillar = ref(HERO_PILLARS[0].id);
const tabRefs = ref([]);
const currentPillarMeta = computed(
  () => HERO_PILLARS.find((p) => p.id === activePillar.value) || HERO_PILLARS[0]
);
function selectPillar(id) {
  activePillar.value = id;
}
function cyclePillar(step) {
  const currentIdx = HERO_PILLARS.findIndex((p) => p.id === activePillar.value);
  const nextIdx = (currentIdx + step + HERO_PILLARS.length) % HERO_PILLARS.length;
  activePillar.value = HERO_PILLARS[nextIdx].id;
  tabRefs.value[nextIdx]?.focus();
}
*/

const viewRef = ref(null);
useParallaxMotion(viewRef);
useCardTilt(viewRef);

const expandedCapId = ref(HOME_DATA.capabilitiesSection.items[0]?.id || '');
const activeProject = ref(null);
let lastTriggerEl = null;

function toggleCapability(id) {
  expandedCapId.value = expandedCapId.value === id ? '' : id;
}

const featuredProjects = computed(() =>
  HOME_DATA.featuredWork.projectIds
    .map((id) => PROJECTS_DATA.projects.find((p) => p.id === id))
    .filter(Boolean)
);

function openCaseStudy(project, event) {
  lastTriggerEl = event?.currentTarget || null;
  activeProject.value = project;
}

function closeCaseStudy() {
  activeProject.value = null;
  lastTriggerEl?.focus();
  lastTriggerEl = null;
}

// Gene - Nov, 24, 2026: Pre-split hero headline words/characters and run GPU-composited harmonic letter-wave + pointer proximity ripple
const heroTitleRef = ref(null);
let cleanupHeadlineMotion = null;

const animatedHeadlineLines = HOME_DATA.headlineLines.map((line, lineIdx) => {
  let charIndexInLine = 0;
  const rawWords = line.split(' ');
  const words = rawWords.map((word, wordIdx) => {
    const chars = Array.from(word).map((char) => {
      const charIdx = charIndexInLine;
      charIndexInLine += 1;
      return { char, charIdx };
    });
    charIndexInLine += 1;
    return { wordIdx, chars };
  });
  return {
    line,
    lineIdx,
    totalChars: Math.max(1, charIndexInLine - 1),
    words
  };
});

onMounted(() => {
  const titleEl = heroTitleRef.value;
  if (!titleEl) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const charEls = Array.from(titleEl.querySelectorAll('.hero-wave-char'));
  if (charEls.length === 0) return;

  let isUnmounted = false;
  const totalLines = Math.max(1, HOME_DATA.headlineLines.length);
  const charNodes = charEls.map((el) => {
    const lineIdx = Number(el.dataset.lineIdx || 0);
    const charIdx = Number(el.dataset.charIdx || 0);
    const lineLen = Math.max(1, Number(el.dataset.lineLen || 1));
    return {
      el,
      lineIdx,
      charIdx,
      nx: (charIdx + 0.5) / lineLen,
      ny: (lineIdx + 0.5) / totalLines
    };
  });

  function measureChars() {
    const titleRect = titleEl.getBoundingClientRect();
    const titleW = Math.max(1, titleRect.width);
    for (let i = 0; i < charNodes.length; i++) {
      const node = charNodes[i];
      const r = node.el.getBoundingClientRect();
      node.nx = (r.left + r.width * 0.5 - titleRect.left) / titleW;
      node.ny = (node.lineIdx + 0.5) / totalLines;
    }
  }

  const heroSection = titleEl.closest('.hero-editorial') || titleEl;
  let targetPx = 0.5;
  let targetPy = 0.5;
  let curPx = 0.5;
  let curPy = 0.5;
  let hoverActive = false;
  let hoverStrength = 0;
  let isInView = true;
  let rafId = 0;
  let io = null;
  const startedAt = performance.now();
  let lastTime = startedAt;
  let phase = 0.35;

  function renderHeadlineFrame(now) {
    rafId = 0;
    const dt = Math.min(0.05, Math.max(0.004, (now - lastTime) / 1000));
    lastTime = now;

    const t = Math.min(1, (now - startedAt) / 900);
    const easeRamp = t * t * (3 - 2 * t);

    phase += dt * 2.05;

    const targetStrength = hoverActive ? 1 : 0;
    hoverStrength += (targetStrength - hoverStrength) * Math.min(1, dt * 7);
    curPx += (targetPx - curPx) * Math.min(1, dt * 9);
    curPy += (targetPy - curPy) * Math.min(1, dt * 9);

    const isCompact = window.innerWidth < 640;
    const baseAmp = isCompact ? 3.5 : 5.5;
    const hoverLift = isCompact ? 5 : 8.5;

    for (let i = 0; i < charNodes.length; i++) {
      const node = charNodes[i];
      const waveOffset = phase - node.charIdx * 0.42 - node.lineIdx * 0.75;
      let y = Math.sin(waveOffset) * baseAmp * easeRamp;
      let scale = 1 + Math.cos(waveOffset) * 0.02 * easeRamp;
      let rot = Math.cos(waveOffset) * 1.25 * easeRamp;

      if (hoverStrength > 0.005) {
        const dx = curPx - node.nx;
        const dy = (curPy - node.ny) * 0.85;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.26) {
          const proximity = (1 - dist / 0.26) * hoverStrength;
          y -= proximity * hoverLift;
          scale += proximity * 0.055;
          rot += dx * proximity * 6;
        }
      }

      node.el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotate(${rot.toFixed(2)}deg)`;
    }

    if (!isUnmounted && isInView && !document.hidden) {
      rafId = requestAnimationFrame(renderHeadlineFrame);
    }
  }

  function syncLoop() {
    const shouldRun = !isUnmounted && isInView && !document.hidden;
    if (shouldRun && !rafId) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(renderHeadlineFrame);
    } else if (!shouldRun && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  const onPointerMove = (e) => {
    const titleRect = titleEl.getBoundingClientRect();
    targetPx = (e.clientX - titleRect.left) / Math.max(1, titleRect.width);
    targetPy = (e.clientY - titleRect.top) / Math.max(1, titleRect.height);
    hoverActive = targetPx >= -0.15 && targetPx <= 1.15 && targetPy >= -0.25 && targetPy <= 1.25;
  };

  const onPointerLeave = () => {
    hoverActive = false;
  };

  const onResize = () => measureChars();
  const onVisibilityChange = () => syncLoop();

  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === titleEl) {
            isInView = entry.isIntersecting;
            syncLoop();
          }
        });
      },
      { rootMargin: '80px 0px', threshold: 0.01 }
    );
    io.observe(titleEl);
  }

  measureChars();
  document.fonts?.ready?.then(() => {
    if (!isUnmounted) measureChars();
  });

  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibilityChange);
  heroSection.addEventListener('pointermove', onPointerMove, { passive: true });
  heroSection.addEventListener('pointerleave', onPointerLeave);

  syncLoop();

  cleanupHeadlineMotion = () => {
    isUnmounted = true;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    if (io) {
      io.disconnect();
      io = null;
    }
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    heroSection.removeEventListener('pointermove', onPointerMove);
    heroSection.removeEventListener('pointerleave', onPointerLeave);
  };
});

onBeforeUnmount(() => {
  cleanupHeadlineMotion?.();
  cleanupHeadlineMotion = null;
});
</script>

<template>
  <div ref="viewRef">
    <!-- Gene - Nov, 24, 2026: Superseded 2-column hero with boxed pitch-focus-box and HarmonyMotionStage -->
    <!--
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
    -->
          <!--
          <div class="pitch-focus-box">
            <div class="pitch-focus-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{{ HOME_DATA.pitchSwitcherLabel }}</span>
            </div>

            <div class="pitch-focus-pills" role="tablist" aria-label="Business Priorities">
              <button
                v-for="(pillar, idx) in HERO_PILLARS"
                :key="pillar.id"
                :ref="(el) => { if (el) tabRefs[idx] = el; }"
                :id="`hero-tab-${pillar.id}`"
                type="button"
                role="tab"
                class="pitch-focus-btn"
                :class="{ active: activePillar === pillar.id }"
                :aria-selected="String(activePillar === pillar.id)"
                :aria-controls="`hero-tabpanel-${pillar.id}`"
                :tabindex="activePillar === pillar.id ? 0 : -1"
                @click="selectPillar(pillar.id)"
                @keydown.left.prevent="cyclePillar(-1)"
                @keydown.right.prevent="cyclePillar(1)"
              >
                <span class="pitch-focus-num">{{ pillar.num }}</span>
                <span>{{ pillar.buttonLabel }}</span>
              </button>
            </div>

            <div
              :id="`hero-tabpanel-${currentPillarMeta.id}`"
              :aria-labelledby="`hero-tab-${currentPillarMeta.id}`"
              class="pitch-focus-panel"
              role="tabpanel"
            >
              <p>
                <strong>{{ currentPillarMeta.focusPrefix }}</strong>
                {{ currentPillarMeta.focusText }}
              </p>
            </div>
          </div>

          <div class="hero-cta-row">
            <RouterLink :to="{ path: '/contact', query: { focus: activePillar } }" class="cta-pill-btn cta-lg">
              <span>Start a Conversation</span>
              <span class="cta-arrow-pocket" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </RouterLink>
            <RouterLink to="/projects" class="btn-outline-teal">
              <span>View Our Work</span>
            </RouterLink>
          </div>
        </div>

        <div class="hero-visual">
          <HarmonyMotionStage :active-pillar="activePillar" />
        </div>
      </div>
    </section>
          -->

    <!-- Section 1: Monumental Full-Width Editorial Hero -->
    <section class="hero-editorial" aria-label="Introduction">
      <HeroWaveField />

      <div class="section-inner hero-editorial-inner">
        <div class="hero-editorial-top">
          <div class="hero-eyebrow hero-editorial-eyebrow">
            <span class="ed-live-dot" aria-hidden="true" />
            <span>{{ HOME_DATA.eyebrow }}</span>
          </div>

          <!-- Gene - Nov, 24, 2026: Preserved static headline markup and replaced with kinetic character-wave headline -->
          <!--
          <h1 class="hero-editorial-title">
            <span
              v-for="(line, idx) in HOME_DATA.headlineLines"
              :key="line"
              class="reveal-mask"
            >
              <span
                class="reveal-mask-inner"
                :class="{ 'is-accent': idx === 1, 'is-bright': idx === 2 }"
                :style="{ '--mask-delay': `${idx * 95}ms` }"
              >
                {{ line }}
              </span>
            </span>
          </h1>
          -->
          <h1
            ref="heroTitleRef"
            class="hero-editorial-title hero-editorial-title--kinetic"
            :aria-label="HOME_DATA.headlineLines.join(' ')"
          >
            <span
              v-for="item in animatedHeadlineLines"
              :key="item.line"
              class="reveal-mask hero-wave-mask"
              aria-hidden="true"
            >
              <span
                class="reveal-mask-inner"
                :class="{ 'is-accent': item.lineIdx === 1, 'is-bright': item.lineIdx === 2 }"
                :style="{ '--mask-delay': `${item.lineIdx * 95}ms` }"
              >
                <template v-for="w in item.words" :key="`${item.lineIdx}-${w.wordIdx}`">
                  <span class="hero-wave-word">
                    <span
                      v-for="c in w.chars"
                      :key="`${item.lineIdx}-${w.wordIdx}-${c.charIdx}`"
                      class="hero-wave-char"
                      :data-line-idx="item.lineIdx"
                      :data-char-idx="c.charIdx"
                      :data-line-len="item.totalChars"
                    >{{ c.char }}</span>
                  </span><template v-if="w.wordIdx < item.words.length - 1">{{ ' ' }}</template>
                </template>
              </span>
            </span>
          </h1>
        </div>

        <div class="hero-editorial-foot">
          <div class="ed-line-draw hero-foot-rule" aria-hidden="true" />
          <div class="hero-foot-row">
            <p class="hero-editorial-lead">{{ HOME_DATA.lead }}</p>

            <div class="hero-foot-actions">
              <div class="action-row">
                <RouterLink :to="HOME_DATA.primaryCta.to" class="cta-pill-btn cta-lg" data-magnetic>
                  <span>{{ HOME_DATA.primaryCta.label }}</span>
                  <span class="cta-arrow-pocket" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </RouterLink>

                <RouterLink :to="HOME_DATA.secondaryCta.to" class="btn-outline-teal" data-magnetic>
                  <span>{{ HOME_DATA.secondaryCta.label }}</span>
                  <span aria-hidden="true">&#8599;</span>
                </RouterLink>
              </div>

              <div class="hero-scroll-cue" aria-hidden="true">
                <span class="hero-scroll-label">Scroll</span>
                <span class="hero-scroll-track">
                  <span class="hero-scroll-stem" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 2: Kinetic Typographic Marquee -->
    <section class="kinetic-marquee-band" aria-hidden="true">
      <div class="kinetic-marquee-inner">
        <div class="kinetic-marquee-track">
          <div v-for="copyIdx in 2" :key="`marquee-${copyIdx}`" class="kinetic-marquee-group">
            <template v-for="word in HOME_DATA.marqueeWords" :key="`${copyIdx}-${word}`">
              <span class="kinetic-marquee-word" :class="{ 'is-harmony': word === 'harmony' }">
                {{ word }}
              </span>
              <span class="kinetic-marquee-sep">/</span>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Interactive Editorial Capabilities -->
    <section class="capabilities-section" aria-labelledby="capabilities-heading">
      <div class="section-inner">
        <div class="section-header-split ed-reveal">
          <div class="section-heading-group">
            <div class="page-eyebrow">{{ HOME_DATA.capabilitiesSection.eyebrow }}</div>
            <h2 id="capabilities-heading" class="editorial-section-title">
              <span>{{ HOME_DATA.capabilitiesSection.headingLead }}</span>{{ ' ' }}<strong>{{ HOME_DATA.capabilitiesSection.headingAccent }}</strong>
            </h2>
          </div>
        </div>

        <div class="cap-list">
          <article
            v-for="cap in HOME_DATA.capabilitiesSection.items"
            :key="cap.id"
            class="cap-row"
            :class="{ 'is-open': expandedCapId === cap.id }"
          >
            <button
              type="button"
              class="cap-row-trigger"
              :aria-expanded="String(expandedCapId === cap.id)"
              :aria-controls="`cap-panel-${cap.id}`"
              @click="toggleCapability(cap.id)"
            >
              <span class="cap-row-num">{{ cap.num }}</span>
              <span class="cap-row-title">{{ cap.title }}</span>
              <span class="cap-row-meta">
                <span class="cap-row-tag">{{ cap.tag }}</span>
                <span class="cap-row-plus" aria-hidden="true">
                  <span class="cap-plus-h" />
                  <span class="cap-plus-v" />
                </span>
              </span>
            </button>

            <div
              :id="`cap-panel-${cap.id}`"
              class="cap-row-drawer"
              :aria-hidden="String(expandedCapId !== cap.id)"
            >
              <div class="cap-row-drawer-inner">
                <div class="cap-drawer-content">
                  <p class="cap-drawer-summary">{{ cap.summary }}</p>
                  <div class="cap-drawer-bottom">
                    <div class="cap-deliverables">
                      <span v-for="item in cap.deliverables" :key="item" class="cap-deliverable-pill">
                        {{ item }}
                      </span>
                    </div>
                    <RouterLink
                      :to="{ path: '/contact', query: { focus: cap.id } }"
                      class="cap-discuss-link"
                      :tabindex="expandedCapId === cap.id ? 0 : -1"
                    >
                      <span>Discuss this</span>
                      <span aria-hidden="true">&rarr;</span>
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Section 4: Asymmetric SwitchFiber Featured Work Bento -->
    <section class="featured-work-section" aria-labelledby="featured-work-heading">
      <div class="section-inner">
        <div class="section-header-split ed-reveal">
          <div class="section-heading-group">
            <div class="page-eyebrow">{{ HOME_DATA.featuredWork.eyebrow }}</div>
            <h2 id="featured-work-heading" class="editorial-section-title">
              <span>{{ HOME_DATA.featuredWork.headingLead }}</span>{{ ' ' }}<strong>{{ HOME_DATA.featuredWork.headingAccent }}</strong>
            </h2>
          </div>

          <RouterLink to="/projects" class="editorial-inline-link" data-magnetic>
            <span>All Projects</span>
            <span aria-hidden="true">&rarr;</span>
          </RouterLink>
        </div>

        <div class="bento-grid">
          <article
            v-for="(project, idx) in featuredProjects"
            :key="project.id"
            class="bento-card"
            :class="{ 'bento-card--lead': idx === 0 }"
          >
            <button
              type="button"
              class="bento-media-btn"
              :class="project.thumbModifier"
              :aria-label="`Inspect ${project.title} case study`"
              @click="openCaseStudy(project, $event)"
            >
              <img
                :src="PROJECT_THUMBNAILS[project.imageKey]"
                :alt="project.alt"
                :width="project.width"
                :height="project.height"
                class="bento-media-img"
                loading="lazy"
              />
              <span class="bento-inspect-chip" aria-hidden="true">Case Study &#8599;</span>
            </button>

            <div class="bento-card-body">
              <div class="bento-card-meta">
                <span class="bento-index">{{ project.indexNum }}</span>
                <span class="bento-subtitle">{{ project.subtitle }}</span>
              </div>

              <h3 class="bento-card-title">{{ project.title }}</h3>
              <p class="bento-card-desc">{{ project.shortDesc }}</p>

              <div class="bento-card-foot">
                <div class="bento-metric-pair">
                  <span class="bento-metric-val">{{ project.metrics[0]?.value }}</span>
                  <span class="bento-metric-lbl">{{ project.metrics[0]?.label }}</span>
                </div>

                <div class="bento-card-actions">
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
                  <button
                    type="button"
                    class="editorial-pill-action"
                    @click="openCaseStudy(project, $event)"
                  >
                    <span>Case Study</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Section 5: Seamless Big-Text Closing Band -->
    <UnifiedCtaStrip v-bind="HOME_DATA.closingCta" />

    <CaseStudyModal :project="activeProject" @close="closeCaseStudy" />
  </div>
</template>
