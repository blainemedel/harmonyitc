// Gene - Nov, 24, 2026: Unit tests for site configuration, HarmonyMotionStage metadata, platform filters, Contact validation, and Resend payload formatting
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  SITE_META,
  DISPLAY_CONFIG,
  NAV_ITEMS,
  HARMONY_MOTION_RIBBONS,
  HERO_PILLARS,
  ABOUT_DATA,
  PROJECTS_DATA,
  CONTACT_DATA
} from '../src/data/siteContent.js';
import {
  formatPrioritySummary,
  buildClipboardBrief,
  buildMailtoHref,
  buildInquiryFallbackMailto,
  filterProjectsByCategory
} from '../src/utils/briefBuilder.js';
import {
  escapeHtml,
  validateInquiryPayload,
  buildResendEmailPayload,
  parseContactQuery
} from '../src/utils/contactInquiry.js';

const { priorities } = CONTACT_DATA.briefBuilder;
const validPriorityIds = priorities.map((p) => p.id);

describe('HarmonyITC site configuration', () => {
  it('standardizes official domain, contact email, and minimal text flags', () => {
    assert.equal(SITE_META.domain, 'https://harmonyitc.dev');
    // Gene - Nov, 24, 2026: Updated expected contact email to harmonyitco@gmail.com
    // assert.equal(SITE_META.email, 'inquiries@harmonyitc.com');
    assert.equal(SITE_META.email, 'harmonyitco@gmail.com');
    assert.equal(DISPLAY_CONFIG.showExtendedCopy, false);
    assert.equal(DISPLAY_CONFIG.showHeaderCta, false);
    assert.equal(DISPLAY_CONFIG.showHomeMetrics, false);
  });

  it('defines clean Vue Router navigation paths, HarmonyMotionStage profiles, and kinetic ribbons', () => {
    assert.deepEqual(
      NAV_ITEMS.map((item) => item.to),
      ['/', '/about', '/projects', '/contact']
    );
    assert.ok(Array.isArray(HARMONY_MOTION_RIBBONS.top) && HARMONY_MOTION_RIBBONS.top.length >= 4);
    assert.ok(Array.isArray(HARMONY_MOTION_RIBBONS.bottom) && HARMONY_MOTION_RIBBONS.bottom.length >= 4);
    assert.ok(HARMONY_MOTION_RIBBONS.top.includes('HARMONY'));
    assert.ok(HARMONY_MOTION_RIBBONS.bottom.includes('HARMONY'));

    assert.equal(HERO_PILLARS.length, 4);
    for (const pillar of HERO_PILLARS) {
      assert.ok(pillar.id && pillar.num && pillar.focusPrefix && pillar.focusText);
      assert.ok(pillar.motion);
      assert.ok(typeof pillar.motion.tempo === 'number' && pillar.motion.tempo > 0);
      assert.ok(typeof pillar.motion.amplitude === 'number' && pillar.motion.amplitude > 0);
      assert.ok(pillar.motion.phrase && pillar.motion.glowRgba);
    }
  });

  it('provides explicit image dimensions, platform tags, and techStack badges on founders and projects', () => {
    assert.equal(ABOUT_DATA.team.founders.length, 3);
    for (const founder of ABOUT_DATA.team.founders) {
      assert.ok(founder.name && founder.role && founder.bio && founder.imageKey);
      assert.ok(Number.isInteger(founder.width) && founder.width > 0);
      assert.ok(Number.isInteger(founder.height) && founder.height > 0);
    }

    assert.deepEqual(
      PROJECTS_DATA.filters.map((f) => f.id),
      ['all', 'web', 'admin', 'mobile']
    );
    assert.equal(PROJECTS_DATA.projects.length, 3);
    for (const project of PROJECTS_DATA.projects) {
      assert.ok(project.id && project.title && project.imageKey && project.platform && project.primaryPriority);
      assert.ok(Array.isArray(project.caseStudy.techStack) && project.caseStudy.techStack.length >= 2);
      assert.ok(project.caseStudy.challenge && project.caseStudy.solution && project.caseStudy.tech);
      assert.ok(Number.isInteger(project.width) && project.width > 0);
      assert.ok(Number.isInteger(project.height) && project.height > 0);
    }
  });
});

describe('briefBuilder helpers & platform filtering', () => {
  it('formats priority summaries and clipboard/mailto briefs cleanly', () => {
    assert.equal(formatPrioritySummary([], priorities), 'None selected yet (choose at least 1 area)');
    assert.equal(formatPrioritySummary(['problem'], priorities), 'Fix a Workflow Bottleneck');
    assert.equal(
      formatPrioritySummary(['problem', 'promo', 'operations', 'income'], priorities),
      'All 4 Areas Selected (Full Website & System Setup)'
    );

    const brief = buildClipboardBrief(['problem', 'income'], priorities, SITE_META.email);
    // Gene - Nov, 24, 2026: Updated expected contact email to harmonyitco@gmail.com
    // assert.match(brief, /Target Email: inquiries@harmonyitc\.com/);
    assert.match(brief, /Target Email: harmonyitco@gmail\.com/);
    assert.match(brief, /1\. Fix a Workflow Bottleneck/);

    const href = buildMailtoHref(['operations'], priorities, SITE_META.email);
    const body = new URL(href).searchParams.get('body') || '';
    assert.match(body, /1\. Organize Daily Operations/);
  });

  it('builds a full fallback mailto link preserving entered Contact form fields', () => {
    const fallbackUrl = buildInquiryFallbackMailto(
      {
        name: 'Alex Rivera',
        email: 'alex@example.com',
        company: 'Northwind Fiber',
        message: 'Looking to automate technician dispatch.',
        priorities: ['operations']
      },
      priorities,
      SITE_META.email
    );
    // Gene - Nov, 24, 2026: Updated expected contact email to harmonyitco@gmail.com
    // assert.ok(fallbackUrl.startsWith('mailto:inquiries@harmonyitc.com?subject='));
    assert.ok(fallbackUrl.startsWith('mailto:harmonyitco@gmail.com?subject='));
    const parsed = new URL(fallbackUrl);
    assert.match(parsed.searchParams.get('subject') || '', /Northwind Fiber/);
    const body = parsed.searchParams.get('body') || '';
    assert.match(body, /Name: Alex Rivera/);
    assert.match(body, /Company: Northwind Fiber/);
    assert.match(body, /1\. Organize Daily Operations/);
    assert.match(body, /Looking to automate technician dispatch\./);
  });

  it('filters SwitchFiber projects accurately by platform key', () => {
    const { projects } = PROJECTS_DATA;
    assert.equal(filterProjectsByCategory(projects, 'all').length, 3);
    assert.deepEqual(
      filterProjectsByCategory(projects, 'web').map((p) => p.id),
      ['switchfiber-subscriber']
    );
    assert.deepEqual(
      filterProjectsByCategory(projects, 'admin').map((p) => p.id),
      ['switchfiber-admin']
    );
    assert.deepEqual(
      filterProjectsByCategory(projects, 'mobile').map((p) => p.id),
      ['switchfiber-mobile']
    );
    assert.equal(filterProjectsByCategory(projects, 'unknown').length, 0);
  });
});

describe('contactInquiry validation, escaping, Resend payload, and query parsing', () => {
  it('validates clean input, detects honeypot spam, and rejects bad fields', () => {
    const good = validateInquiryPayload(
      {
        name: '  Alex Rivera ',
        email: 'alex@example.com',
        company: 'Acme Ops',
        message: 'Need a customer self-service portal with online bill pay.',
        priorities: ['promo', 'income', 'bogus-id'],
        website: ''
      },
      validPriorityIds
    );
    assert.equal(good.ok, true);
    assert.equal(good.isSpam, false);
    assert.deepEqual(good.data.priorities, ['promo', 'income']);
    assert.equal(good.data.name, 'Alex Rivera');

    const spam = validateInquiryPayload(
      {
        name: 'Bot',
        email: 'bot@example.com',
        message: 'Spam message payload.',
        website: 'https://spam.example.com'
      },
      validPriorityIds
    );
    assert.equal(spam.ok, true);
    assert.equal(spam.isSpam, true);

    const invalid = validateInquiryPayload(
      {
        name: 'A',
        email: 'not-an-email',
        company: 'x'.repeat(125),
        message: 'too short',
        priorities: []
      },
      validPriorityIds
    );
    assert.equal(invalid.ok, false);
    assert.ok(invalid.errors.name);
    assert.ok(invalid.errors.email);
    assert.ok(invalid.errors.company);
    assert.ok(invalid.errors.message);
  });

  it('escapes HTML safely inside Resend email payloads', () => {
    assert.equal(escapeHtml('<script>"alert"</script>'), '&lt;script&gt;&quot;alert&quot;&lt;/script&gt;');

    const payload = buildResendEmailPayload({
      data: {
        name: 'Alex <Admin>',
        email: 'alex@example.com',
        company: 'Test & Co',
        message: 'Hello <img src=x onerror=alert(1)>',
        priorities: ['problem']
      },
      priorityList: priorities,
      fromEmail: 'HarmonyITC <noreply@harmonyitc.dev>',
      toEmail: SITE_META.email
    });

    assert.equal(payload.from, 'HarmonyITC <noreply@harmonyitc.dev>');
    // Gene - Nov, 24, 2026: Updated expected contact email to harmonyitco@gmail.com
    // assert.deepEqual(payload.to, ['inquiries@harmonyitc.com']);
    assert.deepEqual(payload.to, ['harmonyitco@gmail.com']);
    assert.equal(payload.reply_to, 'alex@example.com');
    assert.equal(payload.subject, 'HarmonyITC Inquiry from Test & Co');
    assert.match(payload.text, /Fix a Workflow Bottleneck/);
    assert.doesNotMatch(payload.html, /<script>|<img src=x/);
    assert.match(payload.html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  });

  it('parses ?focus= and ?project= query params for prefilled Case Study inquiries', () => {
    const prefilled = parseContactQuery(
      { focus: 'operations', project: 'switchfiber-mobile' },
      validPriorityIds,
      PROJECTS_DATA.projects
    );
    assert.deepEqual(prefilled.priorities, ['operations']);
    assert.equal(prefilled.referencedProjectTitle, 'Switch Fiber — Field Technician Terminal');
    assert.match(prefilled.starterMessage, /Switch Fiber — Field Technician Terminal/);

    const fallback = parseContactQuery(
      { focus: 'invalid', project: 'missing-id' },
      validPriorityIds,
      PROJECTS_DATA.projects
    );
    assert.deepEqual(fallback.priorities, validPriorityIds);
    assert.equal(fallback.referencedProjectTitle, '');
    assert.equal(fallback.starterMessage, '');
  });
});
