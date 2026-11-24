<!-- Gene - Nov, 23, 2026: Clean matte slate-navy 404 fallback route view -->
<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <!-- Gene - Nov, 24, 2026: Replaced boxed 404 panel with open monumental editorial typography -->
  <!--
  <section class="not-found-section">
    <div class="section-inner">
      <div class="frosted-panel not-found-card">
        <div class="page-eyebrow">404 &middot; Page Not Found</div>
        <h1 class="page-title">
          This page doesn't <strong>exist.</strong>
        </h1>
        <div class="action-row not-found-actions">
          <RouterLink to="/" class="cta-pill-btn cta-lg">
            <span>Back to Home</span>
            <span class="cta-arrow-pocket" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </RouterLink>
          <RouterLink to="/projects" class="btn-outline-teal">
            <span>View Projects</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
  -->
  <section class="not-found-section">
    <div class="section-inner not-found-editorial">
      <div class="not-found-code" aria-hidden="true">404</div>
      <div class="page-eyebrow">Page Not Found</div>
      <h1 class="page-title">
        This page doesn't <strong>exist.</strong>
      </h1>
      <div class="action-row not-found-actions">
        <RouterLink to="/" class="cta-pill-btn cta-lg" data-magnetic>
          <span>Back to Home</span>
          <span class="cta-arrow-pocket" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </RouterLink>
        <RouterLink to="/projects" class="btn-outline-teal" data-magnetic>
          <span>Selected Work</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
