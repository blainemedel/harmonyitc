<!-- Gene - Nov, 23, 2026: Minimalist site footer with navigation links, email, and giant harmony wordmark -->
<script setup>
import { RouterLink } from 'vue-router';
import { NAV_ITEMS, SITE_META } from '@/data/siteContent';

defineProps({
  isHome: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <footer class="site-footer" :class="{ 'site-footer--home': isHome }">
    <div class="footer-inner">
      <!-- Gene - Nov, 24, 2026: Added sleek architectural top hairline rule for footer continuity -->
      <div class="footer-top-rule" aria-hidden="true" />
      <div class="footer-micro-row">
        <span>&copy; {{ SITE_META.copyrightYear }} {{ SITE_META.brandName }}. All rights reserved.</span>
        <nav class="footer-micro-links" aria-label="Footer Navigation">
          <RouterLink v-for="item in NAV_ITEMS" :key="item.key" :to="item.to">
            {{ item.label }}
          </RouterLink>
          <a :href="`mailto:${SITE_META.email}`">{{ SITE_META.email }}</a>
        </nav>
      </div>
    </div>
    <div class="footer-wordmark-wrap" aria-hidden="true">
      <span class="footer-giant-wordmark">harmony</span>
    </div>
  </footer>
</template>
