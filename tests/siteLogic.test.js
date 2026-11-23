// Gene - Nov, 23, 2026: Built-in Node unit tests verifying site configuration, minimal-copy defaults, brief builder, and project filters
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  SITE_META,
  DISPLAY_CONFIG,
  NAV_ITEMS,
  HERO_PILLARS,
  ABOUT_DATA,
  PROJECTS_DATA,
  CONTACT_DATA
} from '../src/data/siteContent.js';
import {
  formatPrioritySummary,
  buildClipboardBrief,
  buildMailtoHref,
  filterProjectsByCategory
} from '../src/utils/briefBuilder.js';

const { priorities } = CONTACT_DATA.briefBuilder;

describe('HarmonyITC site configuration', () => {
  it('standardizes official domain, contact email, and minimal text flags', () => {
    assert.equal(SITE_META.domain, 'https://harmonyitc.dev');
    assert.equal(SITE_META.email, 'inquiries@harmonyitc.com');
    assert.equal(DISPLAY_CONFIG.showExtendedCopy, false);
    assert.equal(DISPLAY_CONFIG.showHeaderCta, false);
    assert.equal(DISPLAY_CONFIG.showHomeMetrics, false);
  });

  it('defines clean Vue Router navigation paths and hero pitch pillars', () => {
    assert.deepEqual(
      NAV_ITEMS.map((item) => item.to),
      ['/', '/about', '/projects', '/contact']
    );
    assert.equal(HERO_PILLARS.length, 4);
    for (const pillar of HERO_PILLARS) {
      assert.ok(pillar.id && pillar.num && pillar.focusPrefix && pillar.focusText);
    }
  });

  it('provides explicit image dimensions and required fields on founders and projects', () => {
    assert.equal(ABOUT_DATA.team.founders.length, 3);
    for (const founder of ABOUT_DATA.team.founders) {
      assert.ok(founder.name && founder.role && founder.bio && founder.imageKey);
      assert.ok(Number.isInteger(founder.width) && founder.width > 0);
      assert.ok(Number.isInteger(founder.height) && founder.height > 0);
    }

    assert.equal(PROJECTS_DATA.projects.length, 3);
    for (const project of PROJECTS_DATA.projects) {
      assert.ok(project.id && project.title && project.imageKey);
      assert.ok(project.caseStudy.challenge && project.caseStudy.solution && project.caseStudy.tech);
      assert.ok(Number.isInteger(project.width) && project.width > 0);
      assert.ok(Number.isInteger(project.height) && project.height > 0);
    }
  });
});

describe('formatPrioritySummary', () => {
  it('handles 0, 1, 2, all 4, and unknown priorities', () => {
    assert.equal(formatPrioritySummary([], priorities), 'None selected yet (choose at least 1 area)');
    assert.equal(formatPrioritySummary(['problem'], priorities), 'Fix a Workflow Bottleneck');
    assert.equal(
      formatPrioritySummary(['problem', 'promo'], priorities),
      'Fix a Workflow Bottleneck, Improve Online Presence'
    );
    assert.equal(
      formatPrioritySummary(['problem', 'promo', 'operations', 'income'], priorities),
      'All 4 Areas Selected (Full Website & System Setup)'
    );
    assert.equal(formatPrioritySummary(['invalid-key'], priorities), 'None selected yet (choose at least 1 area)');
  });
});

describe('buildClipboardBrief and buildMailtoHref', () => {
  it('formats clipboard briefs for selected and empty priority lists', () => {
    const brief = buildClipboardBrief(['problem', 'income'], priorities, SITE_META.email);
    assert.match(brief, /Target Email: inquiries@harmonyitc\.com/);
    assert.match(brief, /1\. Fix a Workflow Bottleneck/);
    assert.match(brief, /2\. Support Revenue Growth/);

    const fallbackBrief = buildClipboardBrief([], priorities, SITE_META.email);
    assert.match(fallbackBrief, /- General Consultation/);
  });

  it('builds valid mailto links with encoded subject and priority list', () => {
    const href = buildMailtoHref(['operations'], priorities, SITE_META.email);
    assert.ok(href.startsWith('mailto:inquiries@harmonyitc.com?subject='));
    const parsed = new URL(href);
    assert.equal(parsed.pathname, 'inquiries@harmonyitc.com');
    const body = parsed.searchParams.get('body') || '';
    assert.match(body, /1\. Organize Daily Operations/);

    const emptyHref = buildMailtoHref([], priorities, SITE_META.email);
    const emptyBody = new URL(emptyHref).searchParams.get('body') || '';
    assert.match(emptyBody, /- General Inquiry/);
  });
});

describe('filterProjectsByCategory', () => {
  it('filters SwitchFiber projects by category accurately', () => {
    const { projects } = PROJECTS_DATA;
    assert.equal(filterProjectsByCategory(projects, 'all').length, 3);
    assert.equal(filterProjectsByCategory(projects, 'problem').length, 3);
    assert.equal(filterProjectsByCategory(projects, 'operations').length, 3);
    assert.deepEqual(
      filterProjectsByCategory(projects, 'promo').map((p) => p.id),
      ['switchfiber-subscriber']
    );
    assert.deepEqual(
      filterProjectsByCategory(projects, 'income').map((p) => p.id),
      ['switchfiber-subscriber']
    );
    assert.equal(filterProjectsByCategory(projects, 'unknown').length, 0);
  });
});
