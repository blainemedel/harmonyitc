/**
 * HarmonyITC &mdash; Multi-Page Interactivity & Pitch Controller
 * Handles mobile drawer navigation, project category filtering,
 * interactive case study modals, the hero pitch focus navigator,
 * the interactive contact priority brief generator, and one-click copy actions.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Mobile Navigation Drawer
  // ---------------------------------------------------------------------------
  function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const drawer = document.getElementById('mobile-drawer');

    if (!toggleBtn || !drawer) return;

    function toggleMenu(show) {
      const isOpen = typeof show === 'boolean' ? show : !drawer.classList.contains('open');
      toggleBtn.classList.toggle('active', isOpen);
      drawer.classList.toggle('open', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    toggleBtn.addEventListener('click', () => toggleMenu());

    drawer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Interactive Pitch Focus Navigator (index.html Hero)
  // ---------------------------------------------------------------------------
  const pillarPitchData = {
    'problem': {
      title: 'Pillar 01 / Problem-Solving Engine',
      text: 'We diagnose where your current workflow leaks customers, time, or revenue—then build custom digital solutions that eliminate those friction points permanently.'
    },
    'promo': {
      title: 'Pillar 02 / Promotional Material & Internet Presence',
      text: 'Your 24/7 digital flagship: Fast, search-optimized, and professionally designed to build instant trust and make your business commanding online.'
    },
    'operations': {
      title: 'Pillar 03 / System for Daily Business Operations',
      text: 'Built directly into your daily routine: Automated appointment booking, customer self-service portals, job dispatch queues, and streamlined invoicing.'
    },
    'income': {
      title: 'Pillar 04 / Income-Generating Asset',
      text: 'A website should never be a dead expense. We engineer automated lead-capture funnels and digital payment flows that convert visitors into revenue.'
    }
  };

  function initPitchNavigator() {
    const navButtons = document.querySelectorAll('.pitch-nav-btn[data-pillar]');
    const panelText = document.getElementById('pitch-nav-text');

    if (!navButtons.length || !panelText) return;

    navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        navButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const pillar = btn.getAttribute('data-pillar');
        const data = pillarPitchData[pillar];
        if (data) {
          panelText.innerHTML = `<strong>${data.title}:</strong> ${data.text}`;
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Project Category Filtering (projects.html)
  // ---------------------------------------------------------------------------
  function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedCategory = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const cardCategories = (card.getAttribute('data-category') || '').split(' ');
          if (selectedCategory === 'all' || cardCategories.includes(selectedCategory)) {
            card.style.display = 'flex';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Interactive Case Study Modals (projects.html)
  // ---------------------------------------------------------------------------
  const caseStudiesData = {
    'booking-portal': {
      eyebrow: 'PROBLEM SOLVER &bull; OPERATIONS &bull; REVENUE',
      title: 'Automated Booking & Client Services Hub',
      desc: 'Replaces chaotic phone bookings and manual calendar management with an automated, round-the-clock appointment and deposit-processing engine.',
      challenge: 'Staff spent 3+ hours every day answering repetitive booking inquiries over chat and phone, resulting in double-bookings, missed inquiries after business hours, and lost deposits.',
      solution: 'Engineered a branded customer portal with live calendar availability, automated reminder notifications, upfront deposit collection via digital gateways, and staff schedule sync.',
      tech: 'TypeScript, React / Next.js, Node.js, Stripe / GCash API, PostgreSQL, Redis',
      metrics: '85% Reduction in Admin Time &bull; +42% In After-Hours Bookings &bull; Zero Double-Bookings'
    },
    'ecommerce-engine': {
      eyebrow: 'PROMOTION &bull; OPERATIONS &bull; REVENUE',
      title: 'E-Commerce & Live Inventory Platform',
      desc: 'A 24/7 internet storefront that syncs in-store and online stock in real time, automates digital payments, and captures repeat customer orders.',
      challenge: 'Client operated a successful physical store but had zero digital presence. Manual spreadsheets caused frequent stock miscounts when attempting social media sales.',
      solution: 'Designed a high-converting web storefront with automated real-time inventory synchronization, instant checkout, courier dispatch integrations, and customer re-engagement emails.',
      tech: 'Modern Web Component System, Tailwind CSS, Node.js API, PostgreSQL, Webhooks',
      metrics: '3.2x Revenue Growth in 6 Months &bull; Zero Inventory Over-Sells &bull; 99.9% Checkout Uptime'
    },
    'billing-engine': {
      eyebrow: 'OPERATIONS &bull; PROBLEM SOLVER &bull; REVENUE',
      title: 'Subscriber Billing & Operations ERP',
      desc: 'Unified business operations platform handling end-to-end subscriber provisioning, recurring billing cycles, technician work orders, and RBAC.',
      challenge: 'Manual billing reconciliation and disparate technician dispatch spreadsheets caused customer provisioning bottlenecks and delayed payment collections.',
      solution: 'Architected an automated multi-tenant ERP platform with role-based access control (RBAC), automated recurring PDF invoice generation, payment reconciliations, and live dispatch queues.',
      tech: 'TypeScript, Express.js, Prisma ORM, PostgreSQL, Docker, BullMQ Queue',
      metrics: '50,000+ Monthly Invoices &bull; < 150ms Query Times &bull; 99.8% Automated Reconciliation'
    },
    'geo-mapping': {
      eyebrow: 'PROBLEM SOLVER &bull; OPERATIONS',
      title: 'Field Operations & Asset Dispatch Map',
      desc: 'High-density interactive map tracking field network access points (NAPs), optical splitter hierarchies, and field splice locations with offline caching.',
      challenge: 'Field technicians lacked real-time visibility into port availability on localized distribution boxes, relying on paper notes that caused installation delays.',
      solution: 'Developed a responsive geospatial portal capable of rendering thousands of vector features with offline sync, GPS pinning, and live port occupancy telemetry.',
      tech: 'GeoJSON, Mapbox GL JS / Leaflet, PostgreSQL / PostGIS, Service Workers (Offline PWA)',
      metrics: '12,000+ Km Mapped &bull; Instant Field GPS Sync &bull; 100% Offline Resiliency'
    },
    'b2b-leadgen': {
      eyebrow: 'PROMOTIONAL FLAGSHIP &bull; REVENUE',
      title: 'B2B Brand Flagship & Lead Engine',
      desc: 'Establishes commanding search authority and provides interactive proposal estimators that turn passive web visits into high-value qualified sales leads.',
      challenge: 'Client had an outdated static website that failed to rank on search engines, lacked credibility with enterprise buyers, and yielded zero qualified sales inquiries.',
      solution: 'Crafted a fast, authoritative digital flagship with technical SEO architecture, interactive service calculators, and an automated lead scoring pipeline that routes directly to sales.',
      tech: 'Semantic Modern HTML, CSS Neumorphic Architecture, Node Gateway, Web Vitals Optimization',
      metrics: '+210% In Qualified Inquiries &bull; 0.9s Page Load &bull; 1st-Page Google Search Ranking'
    },
    'telecom-monitor': {
      eyebrow: 'PROBLEM SOLVER &bull; OPERATIONS',
      title: 'Enterprise Infrastructure Telemetry',
      desc: 'Real-time telemetry and optical loss monitoring across distributed regional fiber optic paths, preventing extended subscriber outages.',
      challenge: 'Carrier backbones suffered from delayed fiber cut detection and fragmented telemetry across third-party line termination units, leading to costly customer SLA penalties.',
      solution: 'Constructed an event-driven telemetry ingest pipeline utilizing WebSockets and high-frequency polling. Automatically flags attenuation anomalies on geospatial maps in sub-second intervals.',
      tech: 'Go, Node.js, Redis Pub/Sub, WebSockets, PostgreSQL, Prometheus & Grafana',
      metrics: '99.99% Network Uptime &bull; Sub-10ms Incident Alerting &bull; Zero False Outage Alarms'
    }
  };

  function initCaseStudyModals() {
    const modal = document.getElementById('case-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('case-modal-close');
    const eyebrowEl = document.getElementById('case-modal-eyebrow');
    const titleEl = document.getElementById('case-modal-title');
    const descEl = document.getElementById('case-modal-desc');
    const challengeEl = document.getElementById('case-modal-challenge');
    const solutionEl = document.getElementById('case-modal-solution');
    const techEl = document.getElementById('case-modal-tech');
    const metricsEl = document.getElementById('case-modal-metrics');

    function openModal(id) {
      const data = caseStudiesData[id];
      if (!data) return;

      if (eyebrowEl) eyebrowEl.innerHTML = data.eyebrow;
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (challengeEl) challengeEl.innerHTML = data.challenge;
      if (solutionEl) solutionEl.innerHTML = data.solution;
      if (techEl) techEl.innerHTML = data.tech;
      if (metricsEl) metricsEl.innerHTML = data.metrics;

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-case-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-case-id');
        openModal(id);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Interactive Priority Brief Builder (contact.html)
  // ---------------------------------------------------------------------------
  const priorityLabels = {
    'problem': 'Solve a Business Bottleneck',
    'promo': '24/7 Internet Presence & Brand Flagship',
    'operations': 'Automate Daily Operations & Workflows',
    'income': 'Generate Measurable Revenue & Sales'
  };

  function initBriefBuilder() {
    const cards = document.querySelectorAll('.priority-choice-card[data-priority]');
    const summaryText = document.getElementById('selected-priorities-summary');
    const mailtoBtn = document.getElementById('email-brief-btn');
    const copyBriefBtn = document.getElementById('copy-brief-btn');

    if (!cards.length || !summaryText) return;

    function getSelectedPriorities() {
      const selected = [];
      cards.forEach((c) => {
        if (c.classList.contains('selected')) {
          selected.push(c.getAttribute('data-priority'));
        }
      });
      return selected;
    }

    function updateBrief() {
      const selected = getSelectedPriorities();

      if (selected.length === 0) {
        summaryText.textContent = 'None selected (Please select at least 1 priority)';
      } else if (selected.length === 4) {
        summaryText.textContent = 'All 4 Pillars Selected (Complete Business Engine)';
      } else {
        const names = selected.map((p) => priorityLabels[p]);
        summaryText.textContent = names.join(', ');
      }

      // Generate dynamic mailto link
      if (mailtoBtn) {
        const subject = encodeURIComponent('Project Consultation Brief — Harmony IT Consultancy');
        const priorityList = selected.length > 0 
          ? selected.map((p, idx) => `  ${idx + 1}. ${priorityLabels[p]}`).join('\n')
          : '  - General Consultation';
        const body = encodeURIComponent(
          `Hello HarmonyITC Team,\n\nI would like to schedule a consultation. Here are the core priorities for our business website:\n\n${priorityList}\n\nCompany Name:\nContact Person:\nPreferred Consultation Time:\n\nThank you!`
        );
        mailtoBtn.href = `mailto:inquiries@harmonyitc.com?subject=${subject}&body=${body}`;
      }
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.toggle('selected');
        const check = card.querySelector('.priority-check-box');
        if (check) {
          check.innerHTML = card.classList.contains('selected') ? '&#10003;' : '';
        }
        updateBrief();
      });
    });

    if (copyBriefBtn) {
      copyBriefBtn.addEventListener('click', async () => {
        const selected = getSelectedPriorities();
        const priorityList = selected.length > 0 
          ? selected.map((p, idx) => `  ${idx + 1}. ${priorityLabels[p]}`).join('\n')
          : '  - General Consultation';

        const briefText = 
`[Harmony IT Consultancy — Project Brief]
Target Email: inquiries@harmonyitc.com

Our Core Business Priorities:
${priorityList}

Note: Client-centered website product engineered to solve bottlenecks, amplify internet presence, automate daily operations, and generate revenue.`;

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(briefText);
          } else {
            const ta = document.createElement('textarea');
            ta.value = briefText;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }

          const badge = copyBriefBtn.querySelector('.copied-badge');
          if (badge) {
            badge.classList.add('show');
            setTimeout(() => badge.classList.remove('show'), 2500);
          }

          const toast = document.getElementById('copied-toast');
          if (toast) {
            toast.querySelector('.toast-text').textContent = 'Project brief copied to clipboard!';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
          }
        } catch (err) {
          console.error('Copy brief error:', err);
        }
      });
    }

    updateBrief();
  }

  // ---------------------------------------------------------------------------
  // 6. One-Click Copy Email & Feedback Toast (global)
  // ---------------------------------------------------------------------------
  function initCopyEmail() {
    const copyBtns = document.querySelectorAll('.copy-email-trigger');
    const toast = document.getElementById('copied-toast');

    if (!copyBtns.length) return;

    let toastTimer = null;

    function showToast(message) {
      if (!toast) return;
      if (message) {
        const textSpan = toast.querySelector('.toast-text');
        if (textSpan) textSpan.textContent = message;
      }
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    copyBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email') || 'inquiries@harmonyitc.com';

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(email);
          } else {
            const textArea = document.createElement('textarea');
            textArea.value = email;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          }

          const badge = btn.querySelector('.copied-badge');
          if (badge) {
            badge.classList.add('show');
            setTimeout(() => badge.classList.remove('show'), 2500);
          }

          showToast(`Copied ${email} to clipboard!`);
        } catch (err) {
          console.error('Copy failed: ', err);
          showToast(`Direct email: ${email}`);
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // DOM Ready Initialization
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initPitchNavigator();
    initProjectFilters();
    initCaseStudyModals();
    initBriefBuilder();
    initCopyEmail();
  });
})();