<!-- Gene - Nov, 23, 2026: Sticky matte slate-navy site header and accessible mobile drawer -->
<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { NAV_ITEMS, DISPLAY_CONFIG } from '@/data/siteContent';
import { BRAND_ASSETS } from '@/data/mediaAssets';
import { setBodyScrollLock } from '@/composables/useScrollLock';

const route = useRoute();
const menuOpen = ref(false);
const toggleBtnRef = ref(null);

function isNavActive(to) {
  return route.path === to;
}

function setMenuOpen(next, restoreFocus = false) {
  menuOpen.value = next;
  setBodyScrollLock('mobile-drawer', next);
  if (!next && restoreFocus) {
    toggleBtnRef.value?.focus();
  }
}

function toggleMenu() {
  setMenuOpen(!menuOpen.value);
}

function onKeyDown(e) {
  if (e.key === 'Escape' && menuOpen.value) {
    setMenuOpen(false, true);
  }
}

watch(
  () => route.fullPath,
  () => {
    if (menuOpen.value) {
      setMenuOpen(false);
    }
  }
);

onMounted(() => {
  document.addEventListener('keydown', onKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown);
  setBodyScrollLock('mobile-drawer', false);
});
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink to="/" class="brand-logo" aria-label="Harmony IT Consultancy Home">
        <img
          :src="BRAND_ASSETS.logo"
          alt="Harmony IT Consultancy"
          class="brand-logo-img"
          width="760"
          height="224"
          fetchpriority="high"
          decoding="async"
        />
      </RouterLink>

      <div class="header-right">
        <nav class="nav-links" aria-label="Main Navigation">
          <RouterLink
            v-for="item in NAV_ITEMS"
            :key="item.key"
            :to="item.to"
            class="nav-link"
            :class="{ active: isNavActive(item.to) }"
            :aria-current="isNavActive(item.to) ? 'page' : undefined"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <RouterLink v-if="DISPLAY_CONFIG.showHeaderCta" to="/contact" class="cta-pill-btn">
          <span>Let's Start</span>
          <span class="cta-arrow-pocket" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </RouterLink>
      </div>

      <button
        ref="toggleBtnRef"
        id="mobile-nav-toggle"
        type="button"
        class="mobile-nav-toggle"
        :class="{ active: menuOpen }"
        aria-label="Toggle mobile menu"
        aria-controls="mobile-drawer"
        :aria-expanded="String(menuOpen)"
        @click="toggleMenu"
      >
        <span class="hamburger-line" />
        <span class="hamburger-line" />
        <span class="hamburger-line" />
      </button>
    </div>
  </header>

  <nav
    id="mobile-drawer"
    class="mobile-drawer"
    :class="{ open: menuOpen }"
    aria-label="Mobile Navigation"
    :aria-hidden="String(!menuOpen)"
  >
    <RouterLink
      v-for="item in NAV_ITEMS"
      :key="item.key"
      :to="item.to"
      class="nav-link"
      :class="{ active: isNavActive(item.to) }"
      :aria-current="isNavActive(item.to) ? 'page' : undefined"
      :tabindex="menuOpen ? 0 : -1"
      @click="setMenuOpen(false)"
    >
      {{ item.label }}
    </RouterLink>

    <div v-if="DISPLAY_CONFIG.showHeaderCta" class="mobile-drawer-cta-wrap">
      <RouterLink
        to="/contact"
        class="cta-pill-btn cta-lg mobile-drawer-cta"
        :tabindex="menuOpen ? 0 : -1"
        @click="setMenuOpen(false)"
      >
        <span>Let's Start</span>
        <span class="cta-arrow-pocket" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </RouterLink>
    </div>
  </nav>
</template>
