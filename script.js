/**
 * HarmonyITC &mdash; Multi-Page Interactivity & UI Controller
 * Handles mobile drawer navigation, project category filtering,
 * interactive case study modals, and one-click contact copy actions.
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

    // Close menu when clicking any navigation link
    drawer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Project Category Filtering (projects.html)
  // ---------------------------------------------------------------------------
  function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active filter button state
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedCategory = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const cardCategories = (card.getAttribute('data-category') || '').split(' ');
          if (selectedCategory === 'all' || cardCategories.includes(selectedCategory)) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Interactive Case Study Modals (projects.html)
  // ---------------------------------------------------------------------------
  const caseStudiesData = {
    'telecom-monitor': {
      eyebrow: 'TELECOM & FIBER INFRASTRUCTURE',
      title: 'Backbone Fiber Distribution & Route Monitor',
      desc: 'Real-time telemetry and optical loss monitoring across distributed regional fiber optic paths, preventing extended subscriber outages.',
      challenge: 'Carrier backbones often suffered from delayed fiber cut detection and fragmented telemetry across third-party line termination units.',
      solution: 'Constructed an event-driven telemetry ingest pipeline utilizing WebSockets and high-frequency polling. Automatically flags attenuation anomalies on geospatial maps in sub-second intervals.',
      tech: 'Node.js, Redis Pub/Sub, WebSockets, PostgreSQL, PostGIS, Leaflet GIS',
      metrics: '99.99% Network Uptime &bull; Sub-10ms Incident Alerting &bull; Zero False Positives'
    },
    'billing-engine': {
      eyebrow: 'ENTERPRISE SOFTWARE',
      title: 'Operations & Subscriber Lifecycle Engine',
      desc: 'Unified business operations platform handling end-to-end subscriber provisioning, recurring billing cycles, technician work orders, and RBAC.',
      challenge: 'Manual billing reconciliation and disparate technician dispatch spreadsheets caused customer provisioning bottlenecks.',
      solution: 'Architected an automated multi-tenant ERP microservice with role-based access control (RBAC), automated recurring PDF invoice generation, and live dispatch queues.',
      tech: 'TypeScript, Express.js, Prisma ORM, PostgreSQL, Docker, BullMQ',
      metrics: '50,000+ Monthly Invoices &bull; < 150ms Query Times &bull; 99.8% Automated Reconciliation'
    },
    'geo-mapping': {
      eyebrow: 'GEOSPATIAL SYSTEMS',
      title: 'Geospatial Field Asset & NAP Mapping Portal',
      desc: 'High-density interactive map tracking field network access points (NAPs), optical splitter hierarchies, and field splice locations with offline caching.',
      challenge: 'Field technicians lacked real-time visibility into port availability on localized distribution boxes, leading to installation delays.',
      solution: 'Developed a responsive geospatial portal capable of rendering thousands of vector features with offline sync, GPS pinning, and live port occupancy telemetry.',
      tech: 'GeoJSON, Mapbox GL JS / Leaflet, PostgreSQL / PostGIS, Service Workers (Offline PWA)',
      metrics: '12,000+ Km Mapped &bull; Instant Field GPS Sync &bull; 100% Offline Resiliency'
    },
    'cloud-gateway': {
      eyebrow: 'CLOUD & APIS',
      title: 'Enterprise API Gateway & Security Orchestrator',
      desc: 'High-throughput reverse proxy and API security layer managing authentication, rate limiting, and compliance audit logs for internal and partner services.',
      challenge: 'Unifying client portals, technician mobile tools, and external partner APIs under a zero-trust, audited security layer.',
      solution: 'Implemented a lightweight Go and Node gateway with JWT validation, Redis token-bucket rate limiters, and structured audit telemetry.',
      tech: 'Go, Node.js, Docker, Kubernetes, Nginx, Prometheus, Grafana',
      metrics: '25M+ Monthly Requests &bull; End-to-End Cryptography &bull; 99.995% Service SLA'
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

      if (eyebrowEl) eyebrowEl.textContent = data.eyebrow;
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

    // Attach click listeners to "View Case Study" buttons
    document.querySelectorAll('[data-case-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-case-id');
        openModal(id);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

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
  // 4. One-Click Copy Email & Feedback Toast (contact.html & global)
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
            // Fallback for older browsers
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

          // Visual feedback on button if badge exists
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
    initProjectFilters();
    initCaseStudyModals();
    initCopyEmail();
  });
})();
