// Gene - Nov, 24, 2026: Updated unit tests for editorial Home capabilities, streamlined founders, SwitchFiber showcase, and unselected Contact scopes
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  SITE_META,
  DISPLAY_CONFIG,
  NAV_ITEMS,
  HARMONY_MOTION_RIBBONS,
  HERO_PILLARS,
  HOME_DATA,
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
    assert.equal(SITE_META.email, 'harmonyitco@gmail.com');
    assert.equal(DISPLAY_CONFIG.showExtendedCopy, false);
    assert.equal(DISPLAY_CONFIG.showHeaderCta, false);
    assert.equal(DISPLAY_CONFIG.showHomeMetrics, false);
  });

  it('defines editorial Home headline lines, kinetic marquee, capabilities, and featured SwitchFiber work', () => {
    assert.deepEqual(
      NAV_ITEMS.map((item) => item.to),
      ['/', '/about', '/projects', '/contact']
    );
    assert.equal(HOME_DATA.headlineLines.length, 3);
    assert.ok(HOME_DATA.marqueeWords.includes('harmony'));
    assert.equal(HOME_DATA.capabilitiesSection.items.length, 4);
    for (const cap of HOME_DATA.capabilitiesSection.items) {
      assert.ok(cap.id && cap.num && cap.title && cap.summary);
      assert.ok(Array.isArray(cap.deliverables) && cap.deliverables.length >= 2);
    }
    assert.equal(HOME_DATA.featuredWork.projectIds.length, 3);
    for (const id of HOME_DATA.featuredWork.projectIds) {
      assert.ok(PROJECTS_DATA.projects.some((p) => p.id === id));
    }

    assert.ok(Array.isArray(HARMONY_MOTION_RIBBONS.top) && HARMONY_MOTION_RIBBONS.top.length >= 4);
    assert.ok(Array.isArray(HARMONY_MOTION_RIBBONS.bottom) && HARMONY_MOTION_RIBBONS.bottom.length >= 4);
    assert.equal(HERO_PILLARS.length, 4);
  });

  it('provides streamlined founder profiles, hairline process steps, and explicit project dimensions', () => {
    assert.equal(ABOUT_DATA.team.founders.length, 3);
    for (const founder of ABOUT_DATA.team.founders) {
      assert.ok(founder.name && founder.role && founder.shortBio && founder.bio && founder.imageKey);
      assert.ok(Number.isInteger(founder.width) && founder.width > 0);
      assert.ok(Number.isInteger(founder.height) && founder.height > 0);
    }
    assert.equal(ABOUT_DATA.process.steps.length, 4);
    for (const step of ABOUT_DATA.process.steps) {
      assert.ok(step.num && step.title && step.desc);
    }

    assert.deepEqual(
      PROJECTS_DATA.filters.map((f) => f.id),
      ['all', 'web', 'admin', 'mobile']
    );
    assert.equal(PROJECTS_DATA.projects.length, 3);
    for (const project of PROJECTS_DATA.projects) {
      assert.ok(project.id && project.indexNum && project.title && project.shortDesc && project.imageKey && project.platform);
      assert.ok(validPriorityIds.includes(project.primaryPriority));
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
    assert.equal(formatPrioritySummary(['web'], priorities), 'Web Platform');
    assert.equal(
      formatPrioritySummary(['web', 'operations', 'mobile', 'portals'], priorities),
      'All 4 Areas Selected (Full Website & System Setup)'
    );

    const brief = buildClipboardBrief(['web', 'portals'], priorities, SITE_META.email);
    assert.match(brief, /Target Email: harmonyitco@gmail\.com/);
    assert.match(brief, /1\. Web Platform/);
    assert.match(brief, /2\. Digital Portal & Billing/);

    const href = buildMailtoHref(['operations'], priorities, SITE_META.email);
    const body = new URL(href).searchParams.get('body') || '';
    assert.match(body, /1\. Operations System/);
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
    assert.ok(fallbackUrl.startsWith('mailto:harmonyitco@gmail.com?subject='));
    const parsed = new URL(fallbackUrl);
    assert.match(parsed.searchParams.get('subject') || '', /Northwind Fiber/);
    const body = parsed.searchParams.get('body') || '';
    assert.match(body, /Name: Alex Rivera/);
    assert.match(body, /Company: Northwind Fiber/);
    assert.match(body, /1\. Operations System/);
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
        priorities: ['web', 'portals', 'bogus-id'],
        website: ''
      },
      validPriorityIds
    );
    assert.equal(good.ok, true);
    assert.equal(good.isSpam, false);
    assert.deepEqual(good.data.priorities, ['web', 'portals']);
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
        priorities: ['operations']
      },
      priorityList: priorities,
      fromEmail: 'HarmonyITC <noreply@harmonyitc.dev>',
      toEmail: SITE_META.email
    });

    assert.equal(payload.from, 'HarmonyITC <noreply@harmonyitc.dev>');
    assert.deepEqual(payload.to, ['harmonyitco@gmail.com']);
    assert.equal(payload.reply_to, 'alex@example.com');
    assert.equal(payload.subject, 'HarmonyITC Inquiry from Test & Co');
    assert.match(payload.text, /Operations System/);
    assert.doesNotMatch(payload.html, /<script>|<img src=x/);
    assert.match(payload.html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  });

  it('parses ?focus= and ?project= query params and defaults scopes to unselected', () => {
    const prefilled = parseContactQuery(
      { focus: 'mobile', project: 'switchfiber-mobile' },
      validPriorityIds,
      PROJECTS_DATA.projects
    );
    assert.deepEqual(prefilled.priorities, ['mobile']);
    assert.equal(prefilled.referencedProjectTitle, 'Switch Fiber — Field Technician Terminal');
    assert.match(prefilled.starterMessage, /Switch Fiber — Field Technician Terminal/);

    const fallback = parseContactQuery(
      { focus: 'invalid', project: 'missing-id' },
      validPriorityIds,
      PROJECTS_DATA.projects
    );
    assert.deepEqual(fallback.priorities, []);
    assert.equal(fallback.referencedProjectTitle, '');
    assert.equal(fallback.starterMessage, '');
  });
});

// Gene - Nov, 24, 2026: Previous pre-editorial unit test suite preserved below
/*
describe('HarmonyITC legacy configuration', () => {
  it('verified problem/promo/operations/income pillars', () => {});
});
*/
