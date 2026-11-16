/**
 * Harmony IT Consultancy — Multi-Page Interactivity & 3D Kinetic Typography
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 0. Shared Lifecycle, Chrome & 3D Artwork Templates (Single Source of Truth)
  // ---------------------------------------------------------------------------
  const NAV_ITEMS = [
    { key: 'home', label: 'Home', href: 'index.html' },
    { key: 'about', label: 'About Us', href: 'about.html' },
    { key: 'projects', label: 'Projects', href: 'projects.html' },
    { key: 'contact', label: 'Contact Us', href: 'contact.html' }
  ];

  const CTA_ARROW_SVG = `
    <span class="cta-arrow-pocket" aria-hidden="true">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </span>`;

  const AMBIENT_COIL_SVG = `
    <svg class="ambient-corner-coil" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="porcelainGrad" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#3a5874" stop-opacity="0.75"/>
          <stop offset="55%" stop-color="#274667" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#0c2d4f" stop-opacity="0.18"/>
        </radialGradient>
      </defs>
      <circle cx="95" cy="145" r="96" stroke="url(#porcelainGrad)" stroke-width="10"/>
      <circle cx="95" cy="145" r="80" stroke="url(#porcelainGrad)" stroke-width="8"/>
      <circle cx="95" cy="145" r="64" stroke="url(#porcelainGrad)" stroke-width="7"/>
      <circle cx="95" cy="145" r="48" stroke="url(#porcelainGrad)" stroke-width="6"/>
      <circle cx="95" cy="145" r="32" stroke="url(#porcelainGrad)" stroke-width="5"/>
    </svg>`;

  function observeElementVisibility(el, onStateChange) {
    if (!el || typeof onStateChange !== 'function') return () => {};

    let inView = true;
    const notify = () => onStateChange(inView && !document.hidden);

    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target === el) {
              inView = entry.isIntersecting;
              notify();
            }
          });
        },
        { rootMargin: '80px 0px', threshold: 0.01 }
      );
      io.observe(el);
    }

    const onVisibility = () => notify();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }

  function initSharedChrome() {
    const ambientCanvas = document.querySelector('.ambient-canvas');
    if (ambientCanvas && !ambientCanvas.querySelector('.ambient-corner-coil')) {
      ambientCanvas.innerHTML = AMBIENT_COIL_SVG;
    }

    const header = document.querySelector('header.site-header');
    const drawer = document.getElementById('mobile-drawer');
    const activeKey =
      (header && header.getAttribute('data-active-nav')) ||
      document.body.getAttribute('data-active-nav') ||
      'home';

    const buildLinksHtml = () =>
      NAV_ITEMS.map(
        (item) =>
          `<a href="${item.href}" class="nav-link${item.key === activeKey ? ' active' : ''}">${item.label}</a>`
      ).join('');

    if (header && !header.querySelector('.header-inner')) {
      header.innerHTML = `
        <div class="header-inner">
          <a href="index.html" class="brand-logo" aria-label="Harmony IT Consultancy Home">
            <img
              src="assets/harmony-logo.png?v=20261126"
              alt="Harmony IT Consultancy"
              class="brand-logo-img"
              width="760"
              height="224"
              fetchpriority="high"
              decoding="async"
            >
          </a>
          <div class="header-right">
            <nav class="nav-links" aria-label="Main Navigation">${buildLinksHtml()}</nav>
            <a href="contact.html" class="cta-pill-btn"><span>Let's Start</span>${CTA_ARROW_SVG}</a>
          </div>
          <button id="mobile-nav-toggle" class="mobile-nav-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>`;
    }

    if (drawer && !drawer.querySelector('.nav-link')) {
      drawer.innerHTML = `
        ${buildLinksHtml()}
        <div style="margin-top: 0.75rem;">
          <a href="contact.html" class="cta-pill-btn cta-lg" style="width: 100%; justify-content: space-between;">
            <span>Let's Start</span>${CTA_ARROW_SVG}
          </a>
        </div>`;
    }

    const footer = document.querySelector('footer.site-footer');
    if (footer && !footer.querySelector('.footer-inner')) {
      const footerLinksHtml = NAV_ITEMS.map(
        (item) => `<a href="${item.href}">${item.label}</a>`
      ).join('');

      footer.innerHTML = `
        <div class="footer-inner">
          <div class="footer-micro-row">
            <span>&copy; 2026 Harmony IT Consultancy. All rights reserved.</span>
            <nav class="footer-micro-links" aria-label="Footer Navigation">
              ${footerLinksHtml}
              <a href="mailto:inquiries@harmonyitc.com">inquiries@harmonyitc.com</a>
            </nav>
          </div>
        </div>
        <div class="footer-wordmark-wrap" aria-hidden="true">
          <span class="footer-giant-wordmark">harmony</span>
        </div>`;
    }
  }

  const PILLAR_3D_TEMPLATES = {
    core: (p) => `
      <svg viewBox="0 0 320 156" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="${p}Sphere" cx="64%" cy="32%" r="65%">
            <stop offset="0%" stop-color="#9eb0bf"/><stop offset="28%" stop-color="#8198ae"/>
            <stop offset="58%" stop-color="#193c5e"/><stop offset="84%" stop-color="#0b2c49"/>
            <stop offset="100%" stop-color="#010a27"/>
          </radialGradient>
          <linearGradient id="${p}Torus" x1="25%" y1="15%" x2="78%" y2="88%">
            <stop offset="0%" stop-color="#9eb9d6"/><stop offset="35%" stop-color="#284a6d"/>
            <stop offset="72%" stop-color="#193c5e"/><stop offset="100%" stop-color="#021d3c"/>
          </linearGradient>
          <linearGradient id="${p}Line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#345f87" stop-opacity="0"/>
            <stop offset="50%" stop-color="#91b5d6" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#345f87" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <ellipse cx="160" cy="124" rx="54" ry="9" fill="#010a27" opacity="0.52"/>
        <line x1="36" y1="126" x2="284" y2="126" stroke="url(#${p}Line)" stroke-width="1.2"/>
        <line x1="56" y1="133" x2="264" y2="133" stroke="url(#${p}Line)" stroke-width="1"/>
        <path d="M96 86 C96 60 125 42 160 42 C195 42 224 60 224 86 C224 108 195 122 160 122 C125 122 96 108 96 86 Z" stroke="url(#${p}Torus)" stroke-width="16" fill="none" transform="rotate(-14 160 82)"/>
        <circle cx="160" cy="74" r="31" fill="url(#${p}Sphere)"/>
        <path d="M110 100 C134 118 186 118 212 96" stroke="#7e99b5" stroke-width="6" stroke-linecap="round" opacity="0.32" transform="rotate(-14 160 82)"/>
      </svg>`,
    sphere: (p) => `
      <svg viewBox="0 0 320 156" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="${p}Sphere" cx="66%" cy="32%" r="66%">
            <stop offset="0%" stop-color="#9eb0bf"/><stop offset="22%" stop-color="#8198ae"/>
            <stop offset="52%" stop-color="#284a6d"/><stop offset="78%" stop-color="#0b2c49"/>
            <stop offset="100%" stop-color="#010a27"/>
          </radialGradient>
          <linearGradient id="${p}Bar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#345f87" stop-opacity="0"/>
            <stop offset="50%" stop-color="#91b5d6" stop-opacity="0.72"/>
            <stop offset="100%" stop-color="#345f87" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <ellipse cx="160" cy="116" rx="46" ry="9" fill="#010a27" opacity="0.68"/>
        <line x1="28" y1="120" x2="292" y2="120" stroke="url(#${p}Bar)" stroke-width="1.5"/>
        <line x1="36" y1="127" x2="284" y2="127" stroke="url(#${p}Bar)" stroke-width="1.3"/>
        <line x1="48" y1="134" x2="272" y2="134" stroke="url(#${p}Bar)" stroke-width="1.1"/>
        <circle cx="160" cy="70" r="46" fill="url(#${p}Sphere)"/>
      </svg>`,
    torus: (p) => `
      <svg viewBox="0 0 320 156" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="${p}Body" cx="68%" cy="32%" r="68%">
            <stop offset="0%" stop-color="#9eb9d6"/><stop offset="28%" stop-color="#7e99b5"/>
            <stop offset="56%" stop-color="#284a6d"/><stop offset="80%" stop-color="#193c5e"/>
            <stop offset="100%" stop-color="#021d3c"/>
          </radialGradient>
          <linearGradient id="${p}Inner" x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stop-color="#021d3c"/><stop offset="55%" stop-color="#284a6d"/>
            <stop offset="100%" stop-color="#9eb9d6" stop-opacity="0.75"/>
          </linearGradient>
          <linearGradient id="${p}Floor" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#345f87" stop-opacity="0"/>
            <stop offset="50%" stop-color="#345f87" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#345f87" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <ellipse cx="160" cy="122" rx="54" ry="8" fill="#010a27" opacity="0.52"/>
        <line x1="36" y1="125" x2="284" y2="125" stroke="url(#${p}Floor)" stroke-width="1.2"/>
        <g transform="rotate(-18 160 74)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M160 27 C204 27 232 48 232 74 C232 100 204 121 160 121 C116 121 88 100 88 74 C88 48 116 27 160 27 Z M160 52 C136 52 120 61 120 74 C120 87 136 96 160 96 C184 96 200 87 200 74 C200 61 184 52 160 52 Z" fill="url(#${p}Body)"/>
          <path d="M116 74 C116 58 135 48 160 48 C185 48 204 58 204 74" stroke="url(#${p}Inner)" stroke-width="5.5" stroke-linecap="round" fill="none" opacity="0.68"/>
          <path d="M102 91 C118 109 144 116 174 114" stroke="#021d3c" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.55"/>
          <path d="M188 41 C208 48 220 60 221 75" stroke="#9eb9d6" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.48"/>
        </g>
      </svg>`,
    arrow: (p) => `
      <svg viewBox="0 0 320 156" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${p}Face" x1="15%" y1="80%" x2="88%" y2="18%">
            <stop offset="0%" stop-color="#0f3254"/><stop offset="35%" stop-color="#204467"/>
            <stop offset="72%" stop-color="#31547a"/><stop offset="100%" stop-color="#7e99b5"/>
          </linearGradient>
          <linearGradient id="${p}Edge" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#021d3c"/><stop offset="100%" stop-color="#113153"/>
          </linearGradient>
        </defs>
        <g stroke="#21486c" stroke-width="1.25" opacity="0.82" fill="none">
          <path d="M16 118 Q88 106 160 118 T304 118"/>
          <path d="M16 125 Q88 113 160 125 T304 125"/>
          <path d="M16 132 Q88 120 160 132 T304 132"/>
          <path d="M16 139 Q88 127 160 139 T304 139"/>
        </g>
        <ellipse cx="152" cy="112" rx="52" ry="8" fill="#010a27" opacity="0.56"/>
        <path d="M98 99 C136 96 164 78 182 54 L167 45 C163 42 165 36 170 36 L214 33 C219 33 223 37 222 42 L216 84 C215 89 209 90 205 86 L195 75 C172 103 136 112 96 105 C92 104 93 99 98 99 Z" fill="url(#${p}Edge)" transform="translate(-5, 6)"/>
        <path d="M98 99 C136 96 164 78 182 54 L167 45 C163 42 165 36 170 36 L214 33 C219 33 223 37 222 42 L216 84 C215 89 209 90 205 86 L195 75 C172 103 136 112 96 105 C92 104 93 99 98 99 Z" fill="url(#${p}Face)"/>
        <path d="M170 37 L214 34 C218 34 221 37 220 42 L215 80" stroke="#b4d0e9" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
      </svg>`
  };

  function initPillar3DArtworks() {
    document.querySelectorAll('.pillar-3d-showcase[data-shape]').forEach((el, idx) => {
      if (el.querySelector('svg')) return;
      const shape = el.getAttribute('data-shape');
      const renderFn = PILLAR_3D_TEMPLATES[shape];
      if (renderFn) {
        el.innerHTML = renderFn(`p3d-${idx}-`);
      }
    });
  }

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

    drawer.querySelectorAll('.nav-link, .cta-pill-btn').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Hero Interactive 3D Matte Triad (Sphere, Torus & Curved Arrow)
  //    Exact hexes sampled from reference matte studio render
  // ---------------------------------------------------------------------------
  const heroPillarTargets = {
    problem:    { sphere: 1.0,  torus: 1.0,  arrow: 1.0,  camRx: 0.24, camRy: -0.18 },
    promo:      { sphere: 1.18, torus: 0.92, arrow: 0.92, camRx: 0.14, camRy: 0.35 },
    operations: { sphere: 0.92, torus: 1.16, arrow: 0.94, camRx: 0.34, camRy: -0.45 },
    income:     { sphere: 0.92, torus: 0.94, arrow: 1.18, camRx: 0.18, camRy: 0.12 }
  };
  let activeHeroPillar = 'problem';

  function initHero3DEngine() {
    const stages = Array.from(document.querySelectorAll('.hero-3d-stage'));
    if (!stages.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function norm3(v) {
      const len = Math.hypot(v[0], v[1], v[2]) || 1;
      return [v[0] / len, v[1] / len, v[2] / len];
    }

    function dot3(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    function cross3(a, b) {
      return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
      ];
    }

    function rotatePoint(x, y, z, rx, ry, rz) {
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      const cosZ = Math.cos(rz), sinZ = Math.sin(rz);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;
      return [x3, y3, z2];
    }

    function lerpColorStops(stops, t) {
      const clamped = Math.max(0, Math.min(1, t));
      const scaled = clamped * (stops.length - 1);
      const i0 = Math.floor(scaled);
      const i1 = Math.min(stops.length - 1, i0 + 1);
      const frac = scaled - i0;
      const c0 = stops[i0], c1 = stops[i1];
      const r = Math.round(c0[0] + (c1[0] - c0[0]) * frac);
      const g = Math.round(c0[1] + (c1[1] - c0[1]) * frac);
      const b = Math.round(c0[2] + (c1[2] - c0[2]) * frac);
      return `rgb(${r},${g},${b})`;
    }

    // Exact matte palettes sampled from reference image
    const torusRamp = [
      [2, 29, 60],     // #021d3c core shadow
      [25, 60, 94],    // #193c5e deep navy
      [40, 74, 109],   // #284a6d midtone
      [126, 153, 181], // #7e99b5 soft studio fill
      [158, 185, 214]  // #9eb9d6 matte rim highlight
    ];

    const arrowRamp = [
      [15, 50, 84],    // #0f3254 deep tail shadow
      [32, 68, 103],   // #204467 body shadow
      [36, 70, 106],   // #24466a midtone
      [49, 84, 122],   // #31547a lit plane
      [180, 208, 233]  // #b4d0e9 beveled rim highlight
    ];

    // Studio key light from upper-right-front + subtle cool bounce from lower-left
    const keyLight = norm3([0.64, -0.58, 0.50]);
    const rimLight = norm3([-0.55, 0.38, 0.74]);

    function shadeMatte(normal, ramp, highlightBias) {
      const n = norm3(normal);
      const ndotl = dot3(n, keyLight);
      // Soft matte wrap diffuse (Oren-Nayar inspired falloff, zero harsh plastic specular)
      const wrap = Math.max(0, (ndotl + 0.42) / 1.42);
      const softDiff = Math.pow(wrap, 1.32);
      const bounce = Math.max(0, dot3(n, rimLight)) * 0.16;
      const fresnelRim = Math.pow(1 - Math.abs(n[2]), 2.2) * 0.14;
      const shadeT = softDiff * (0.86 + highlightBias) + bounce + fresnelRim;
      return lerpColorStops(ramp, shadeT);
    }

    stages.forEach((stage) => {
      const canvas = stage.querySelector('.hero-3d-canvas');
      const backdrop = stage.querySelector('.hero-3d-backdrop');
      const nodesWrap = stage.querySelector('.hero-3d-nodes');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = 0;
      let height = 0;
      let dpr = 1;

      function resizeCanvas() {
        const rect = stage.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = Math.max(240, rect.width || 420);
        height = Math.max(240, rect.height || 420);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      let targetTiltX = 0;
      let targetTiltY = 0;
      let currentTiltX = 0;
      let currentTiltY = 0;

      let curSphereScale = 1.0;
      let curTorusScale = 1.0;
      let curArrowScale = 1.0;
      let curCamRx = 0.24;
      let curCamRy = -0.18;

      if (!prefersReduced) {
        let stageMouseRaf = 0;
        let lastNx = 0;
        let lastNy = 0;

        stage.addEventListener('mousemove', (e) => {
          const rect = stage.getBoundingClientRect();
          lastNx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
          lastNy = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
          targetTiltY = lastNx * 0.54;
          targetTiltX = lastNy * -0.44;

          if (!stageMouseRaf) {
            stageMouseRaf = requestAnimationFrame(() => {
              stageMouseRaf = 0;
              if (backdrop) {
                backdrop.style.transform = `translate3d(${(lastNx * -12).toFixed(1)}px, ${(lastNy * -12).toFixed(1)}px, -40px)`;
              }
              if (nodesWrap) {
                nodesWrap.style.transform = `rotateX(${(lastNy * -6).toFixed(2)}deg) rotateY(${(lastNx * 7).toFixed(2)}deg)`;
              }
            });
          }
        });

        stage.addEventListener('mouseleave', () => {
          targetTiltX = 0;
          targetTiltY = 0;
          if (stageMouseRaf) {
            cancelAnimationFrame(stageMouseRaf);
            stageMouseRaf = 0;
          }
          if (backdrop) backdrop.style.transform = '';
          if (nodesWrap) nodesWrap.style.transform = '';
        });
      }

      // Build beveled 3D Curved Arrow local geometry once
      function buildCurvedArrowData() {
        const spineSteps = 26;
        const pts = [];
        // Sweep from bottom-left (-0.75, 0.55) to top-right (0.48, -0.48)
        for (let i = 0; i <= spineSteps; i++) {
          const t = i / spineSteps;
          const omt = 1 - t;
          const x = omt * omt * -0.78 + 2 * omt * t * -0.05 + t * t * 0.44;
          const y = omt * omt * 0.56 + 2 * omt * t * 0.36 + t * t * -0.42;
          const z = Math.sin(t * Math.PI) * 0.14;
          const halfW = 0.042 + t * 0.088;
          const halfD = 0.036 + t * 0.042;
          pts.push({ x, y, z, halfW, halfD });
        }

        // Chamfered 8-vertex cross-section per spine point
        const rings = [];
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const prev = pts[Math.max(0, i - 1)];
          const next = pts[Math.min(pts.length - 1, i + 1)];
          const tang = norm3([next.x - prev.x, next.y - prev.y, next.z - prev.z]);
          const upZ = [0, 0, 1];
          const side = norm3(cross3(tang, upZ));
          const depthDir = norm3(cross3(side, tang));

          const w = p.halfW;
          const d = p.halfD;
          const ch = 0.68; // bevel chamfer factor
          const profile = [
            [w, d * ch], [w * ch, d], [-w * ch, d], [-w, d * ch],
            [-w, -d * ch], [-w * ch, -d], [w * ch, -d], [w, -d * ch]
          ];
          const ring = profile.map(([sw, sd]) => [
            p.x + side[0] * sw + depthDir[0] * sd,
            p.y + side[1] * sw + depthDir[1] * sd,
            p.z + side[2] * sw + depthDir[2] * sd
          ]);
          rings.push(ring);
        }

        const faces = [];
        for (let i = 0; i < rings.length - 1; i++) {
          const r0 = rings[i], r1 = rings[i + 1];
          for (let j = 0; j < 8; j++) {
            const jn = (j + 1) % 8;
            faces.push([r0[j], r0[jn], r1[jn], r1[j]]);
          }
        }
        // Tail cap
        const tail = rings[0];
        faces.push([tail[0], tail[2], tail[4], tail[6]]);

        // Sculpted 3D arrowhead aligned to spine end
        const end = pts[pts.length - 1];
        const prevEnd = pts[pts.length - 2];
        const hTang = norm3([end.x - prevEnd.x, end.y - prevEnd.y, end.z - prevEnd.z]);
        const hSide = norm3(cross3(hTang, [0, 0, 1]));
        const hDepth = norm3(cross3(hSide, hTang));

        function headPt(f, s, d) {
          return [
            end.x + hTang[0] * f + hSide[0] * s + hDepth[0] * d,
            end.y + hTang[1] * f + hSide[1] * s + hDepth[1] * d,
            end.z + hTang[2] * f + hSide[2] * s + hDepth[2] * d
          ];
        }

        const hd = 0.082;
        const tipF = 0.36;
        const backF = -0.04;
        const wingS = 0.255;
        const frontTri = [headPt(tipF, 0, hd), headPt(backF, wingS, hd), headPt(backF, -wingS, hd)];
        const backTri = [headPt(tipF, 0, -hd), headPt(backF, -wingS, -hd), headPt(backF, wingS, -hd)];

        faces.push([frontTri[0], frontTri[1], frontTri[2]]);
        faces.push([backTri[0], backTri[1], backTri[2]]);
        faces.push([frontTri[0], backTri[0], backTri[2], frontTri[1]]);
        faces.push([frontTri[1], backTri[2], backTri[1], frontTri[2]]);
        faces.push([frontTri[2], backTri[1], backTri[0], frontTri[0]]);

        return faces;
      }

      const arrowFaces = buildCurvedArrowData();

      let elapsed = 0;
      let lastFrameTs = null;
      let isStageActive = true;
      let stageRafId = 0;

      function renderFrame(timestamp) {
        stageRafId = 0;
        if (lastFrameTs !== null && !prefersReduced) {
          elapsed += Math.min(0.05, Math.max(0, (timestamp - lastFrameTs) * 0.001));
        }
        lastFrameTs = timestamp;

        const targetCfg = heroPillarTargets[activeHeroPillar] || heroPillarTargets.problem;
        curSphereScale += (targetCfg.sphere - curSphereScale) * 0.06;
        curTorusScale += (targetCfg.torus - curTorusScale) * 0.06;
        curArrowScale += (targetCfg.arrow - curArrowScale) * 0.06;
        curCamRx += (targetCfg.camRx - curCamRx) * 0.05;
        curCamRy += (targetCfg.camRy - curCamRy) * 0.05;

        currentTiltX += (targetTiltX - currentTiltX) * 0.08;
        currentTiltY += (targetTiltY - currentTiltY) * 0.08;

        ctx.clearRect(0, 0, width, height);

        const cx = width * 0.5;
        const cy = height * 0.49;
        const unitScale = Math.min(width, height) * 0.27;
        const fov = 4.6;

        // Subtle studio floor horizon lines echoing the reference middle card
        const floorY = height * 0.805;
        for (let l = 0; l < 3; l++) {
          const ly = floorY + l * 7.5;
          const lineGrad = ctx.createLinearGradient(width * 0.14, ly, width * 0.86, ly);
          lineGrad.addColorStop(0, 'rgba(52, 95, 135, 0)');
          lineGrad.addColorStop(0.5, l === 0 ? 'rgba(145, 181, 214, 0.34)' : 'rgba(52, 95, 135, 0.28)');
          lineGrad.addColorStop(1, 'rgba(52, 95, 135, 0)');
          ctx.strokeStyle = lineGrad;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(width * 0.14, ly);
          ctx.lineTo(width * 0.86, ly);
          ctx.stroke();
        }

        const worldRx = curCamRx + Math.sin(elapsed * 0.42) * 0.08 + currentTiltX;
        const worldRy = curCamRy + Math.sin(elapsed * 0.34) * 0.18 + currentTiltY;
        const worldRz = Math.sin(elapsed * 0.26) * 0.05;

        const drawQueue = [];

        function project(pt) {
          const scale = fov / Math.max(0.6, fov - pt[2]);
          return [cx + pt[0] * unitScale * scale, cy + pt[1] * unitScale * scale, pt[2], scale];
        }

        // 1. Matte 3D Torus (centered-right tilted orbital sculpture)
        const uSteps = 44;
        const vSteps = 20;
        const majorR = 0.64 * curTorusScale;
        const minorR = 0.195 * curTorusScale;
        const torusTiltX = 0.72 + Math.sin(elapsed * 0.45) * 0.12;
        const torusTiltY = -0.38 + elapsed * 0.28;
        const torusOffset = [0.20, 0.04, -0.05];

        const torusGrid = [];
        for (let iu = 0; iu <= uSteps; iu++) {
          const u = (iu / uSteps) * Math.PI * 2;
          const cu = Math.cos(u), su = Math.sin(u);
          const ringRow = [];
          for (let iv = 0; iv <= vSteps; iv++) {
            const v = (iv / vSteps) * Math.PI * 2;
            const cv = Math.cos(v), sv = Math.sin(v);
            const lx = (majorR + minorR * cv) * cu;
            const ly = (majorR + minorR * cv) * su;
            const lz = minorR * sv;

            const [tx, ty, tz] = rotatePoint(lx, ly, lz, torusTiltX, torusTiltY, 0.2);
            const [wx, wy, wz] = rotatePoint(
              tx + torusOffset[0],
              ty + torusOffset[1],
              tz + torusOffset[2],
              worldRx,
              worldRy,
              worldRz
            );

            // Surface normal in world space
            const [tnx, tny, tnz] = rotatePoint(cv * cu, cv * su, sv, torusTiltX, torusTiltY, 0.2);
            const wn = rotatePoint(tnx, tny, tnz, worldRx, worldRy, worldRz);
            ringRow.push({ p: [wx, wy, wz], n: wn });
          }
          torusGrid.push(ringRow);
        }

        for (let iu = 0; iu < uSteps; iu++) {
          for (let iv = 0; iv < vSteps; iv++) {
            const v00 = torusGrid[iu][iv];
            const v10 = torusGrid[iu + 1][iv];
            const v11 = torusGrid[iu + 1][iv + 1];
            const v01 = torusGrid[iu][iv + 1];

            const avgN = [
              (v00.n[0] + v10.n[0] + v11.n[0] + v01.n[0]) * 0.25,
              (v00.n[1] + v10.n[1] + v11.n[1] + v01.n[1]) * 0.25,
              (v00.n[2] + v10.n[2] + v11.n[2] + v01.n[2]) * 0.25
            ];
            if (avgN[2] < -0.22) continue;

            const p0 = project(v00.p);
            const p1 = project(v10.p);
            const p2 = project(v11.p);
            const p3 = project(v01.p);
            const avgZ = (v00.p[2] + v10.p[2] + v11.p[2] + v01.p[2]) * 0.25;

            drawQueue.push({
              type: 'poly',
              z: avgZ,
              pts: [p0, p1, p2, p3],
              color: shadeMatte(avgN, torusRamp, 0.04)
            });
          }
        }

        // 2. Matte 3D Sphere (orbiting cleanly in foreground/midground)
        const sOrbit = elapsed * 0.42;
        const sphereBase = [
          -0.28 + Math.cos(sOrbit) * 0.14,
          -0.06 + Math.sin(sOrbit * 1.2) * 0.09,
          0.24 + Math.sin(sOrbit) * 0.22
        ];
        const sw = rotatePoint(sphereBase[0], sphereBase[1], sphereBase[2], worldRx, worldRy, worldRz);
        const sp = project(sw);
        const sphereRadiusPx = 0.365 * curSphereScale * unitScale * sp[3];

        drawQueue.push({
          type: 'sphere',
          z: sw[2],
          x: sp[0],
          y: sp[1],
          r: sphereRadiusPx
        });

        // 3. Matte 3D Curved Arrow (sweeping upward-right in 3D space)
        const arrowAngle = Math.sin(elapsed * 0.5) * 0.12;
        const arrowScale = 0.96 * curArrowScale;
        const arrowOffset = [-0.14, 0.08, 0.38];

        for (let f = 0; f < arrowFaces.length; f++) {
          const face = arrowFaces[f];
          const wPts = face.map((pt) => {
            const [rx, ry, rz] = rotatePoint(
              pt[0] * arrowScale,
              pt[1] * arrowScale,
              pt[2] * arrowScale,
              -0.18 + arrowAngle,
              0.24,
              -0.06
            );
            return rotatePoint(
              rx + arrowOffset[0],
              ry + arrowOffset[1],
              rz + arrowOffset[2],
              worldRx,
              worldRy,
              worldRz
            );
          });

          // Face normal
          const e1 = [wPts[1][0] - wPts[0][0], wPts[1][1] - wPts[0][1], wPts[1][2] - wPts[0][2]];
          const e2 = [wPts[2][0] - wPts[0][0], wPts[2][1] - wPts[0][1], wPts[2][2] - wPts[0][2]];
          const n = norm3(cross3(e1, e2));
          // Double-sided check facing viewer (+Z)
          const viewNormal = n[2] >= 0 ? n : [-n[0], -n[1], -n[2]];
          if (viewNormal[2] < 0.02) continue;

          let avgZ = 0;
          const projPts = wPts.map((wp) => {
            avgZ += wp[2];
            return project(wp);
          });
          avgZ /= wPts.length;

          drawQueue.push({
            type: 'poly',
            z: avgZ,
            pts: projPts,
            color: shadeMatte(viewNormal, arrowRamp, 0.08)
          });
        }

        // Depth sort back-to-front
        drawQueue.sort((a, b) => a.z - b.z);

        for (let i = 0; i < drawQueue.length; i++) {
          const item = drawQueue[i];
          if (item.type === 'poly') {
            ctx.fillStyle = item.color;
            ctx.strokeStyle = item.color;
            ctx.lineWidth = 0.75;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(item.pts[0][0], item.pts[0][1]);
            for (let k = 1; k < item.pts.length; k++) {
              ctx.lineTo(item.pts[k][0], item.pts[k][1]);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else if (item.type === 'sphere') {
            // Soft studio cast drop shadow
            const shGrad = ctx.createRadialGradient(
              item.x - item.r * 0.08,
              item.y + item.r * 0.92,
              item.r * 0.1,
              item.x,
              item.y + item.r * 0.92,
              item.r * 1.15
            );
            shGrad.addColorStop(0, 'rgba(1, 10, 39, 0.56)');
            shGrad.addColorStop(1, 'rgba(1, 10, 39, 0)');
            ctx.fillStyle = shGrad;
            ctx.beginPath();
            ctx.ellipse(item.x, item.y + item.r * 0.92, item.r * 0.95, item.r * 0.24, 0, 0, Math.PI * 2);
            ctx.fill();

            // Velvety matte studio sphere using exact sampled hexes (#9eb0bf -> #8198ae -> #0b2c49 -> #010a27)
            const spGrad = ctx.createRadialGradient(
              item.x + item.r * 0.34,
              item.y - item.r * 0.34,
              item.r * 0.04,
              item.x - item.r * 0.1,
              item.y + item.r * 0.1,
              item.r * 1.12
            );
            spGrad.addColorStop(0, '#9eb0bf');
            spGrad.addColorStop(0.22, '#8198ae');
            spGrad.addColorStop(0.52, '#284a6d');
            spGrad.addColorStop(0.78, '#0b2c49');
            spGrad.addColorStop(1, '#010a27');

            ctx.fillStyle = spGrad;
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
            ctx.fill();

            // Subtle lower-left ambient floor bounce rim
            const rimGrad = ctx.createRadialGradient(
              item.x - item.r * 0.42,
              item.y + item.r * 0.48,
              item.r * 0.05,
              item.x,
              item.y,
              item.r
            );
            rimGrad.addColorStop(0, 'rgba(40, 74, 109, 0.28)');
            rimGrad.addColorStop(0.65, 'rgba(11, 44, 73, 0)');
            rimGrad.addColorStop(1, 'rgba(1, 10, 39, 0)');
            ctx.fillStyle = rimGrad;
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        if (!prefersReduced && isStageActive && !document.hidden) {
          stageRafId = requestAnimationFrame(renderFrame);
        }
      }

      observeElementVisibility(stage, (active) => {
        isStageActive = active;
        if (active && !prefersReduced && !stageRafId) {
          lastFrameTs = null;
          stageRafId = requestAnimationFrame(renderFrame);
        } else if (!active && stageRafId) {
          cancelAnimationFrame(stageRafId);
          stageRafId = 0;
          lastFrameTs = null;
        }
      });

      stageRafId = requestAnimationFrame(renderFrame);
    });
  }

  // ---------------------------------------------------------------------------
  // 2.5 Interactive Pitch Focus Navigator (index.html)
  // ---------------------------------------------------------------------------
  const pitchPillarsCopy = {
    problem:
      '<strong>01 / Solving Real Problems:</strong> We look at where your team loses time, misses inquiries, or gets stuck in manual steps, then build straightforward tools that fix the root issue.',
    promo:
      '<strong>02 / Clear Online Presence:</strong> A fast, trustworthy website that explains what you do clearly, shows up well in search, and gives potential clients confidence to reach out.',
    operations:
      '<strong>03 / Smoother Daily Work:</strong> Replace scattered spreadsheets and long message threads with practical booking tools, client portals, job tracking, and organized dashboards.',
    income:
      '<strong>04 / Sustainable Growth:</strong> Clear customer paths, inquiry forms, service estimators, and online payment options that turn visitors into paying clients.'
  };

  function initPitchNavigator() {
    const buttons = document.querySelectorAll('.pitch-focus-btn[data-pillar]');
    const textEl = document.getElementById('pitch-focus-text');
    if (!buttons.length || !textEl) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const key = btn.getAttribute('data-pillar');
        if (pitchPillarsCopy[key]) {
          textEl.innerHTML = pitchPillarsCopy[key];
        }
        if (key) {
          activeHeroPillar = key;
          document.querySelectorAll('.hero-3d-node[data-pillar]').forEach((node) => {
            node.classList.toggle('is-active', node.getAttribute('data-pillar') === key);
          });
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 3. WebGL 3D Kinetic Typography Cylinder (index.html)
  // ---------------------------------------------------------------------------
  function createKineticTextCanvas() {
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 2048;
    texCanvas.height = 1024;
    const ctx = texCanvas.getContext('2d');
    ctx.clearRect(0, 0, texCanvas.width, texCanvas.height);

    const lines = [
      { text: 'THE WAIT',   y: 135, size: 196, targetW: 1320 },
      { text: 'WE PROMISE', y: 405, size: 138, targetW: 1320 },
      { text: 'IT WILL BE', y: 650, size: 178, targetW: 1320 },
      { text: 'WORTH',      y: 895, size: 185, targetW: 1200 },
    ];

    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';

    const leftX = 360;
    const fontStack = '"Anton", "Oswald", Impact, "Arial Narrow", sans-serif';

    lines.forEach((item) => {
      ctx.save();
      ctx.font = `700 ${item.size}px ${fontStack}`;
      const metrics = ctx.measureText(item.text);
      const scaleX = metrics.width > 0 ? Math.min(1.45, Math.max(0.82, item.targetW / metrics.width)) : 1;
      ctx.translate(leftX, item.y);
      ctx.scale(scaleX, 1);
      ctx.fillText(item.text, 0, 0);
      ctx.restore();
    });

    return texCanvas;
  }

  function initKineticCylinder() {
    const canvas = document.getElementById('kinetic-cylinder-canvas');
    const fallback = document.getElementById('kinetic-fallback');
    const stage = document.getElementById('kinetic-stage');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
    });

    if (!gl) {
      canvas.style.display = 'none';
      if (fallback) fallback.style.display = 'block';
      return;
    }

    const vsSource = `
      attribute vec3 aPos;
      attribute vec2 aUv;
      uniform mat4 uMvp;
      varying vec2 vUv;
      varying vec3 vPos;
      void main() {
        vUv = aUv;
        vPos = aPos;
        gl_Position = uMvp * vec4(aPos, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      varying vec3 vPos;
      uniform sampler2D uTex;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uScroll;
      uniform float uIsBack;

      void main() {
        if (vUv.x < 0.12 || vUv.x > 0.88) discard;
        float phase = uIsBack > 0.5 ? -0.16 : 0.0;
        vec2 uv = vec2(vUv.x, fract(vUv.y + uScroll + phase));
        vec4 tex = texture2D(uTex, uv);
        if (tex.a < 0.03) discard;

        float fade = uOpacity;
        float rimFade = smoothstep(0.015, 0.075, min(vUv.y, 1.0 - vUv.y));
        fade *= rimFade;
        if (uIsBack > 0.5) {
          float edgeSoft = smoothstep(-1.3, -0.45, vPos.x) * (1.0 - smoothstep(0.65, 1.35, vPos.x) * 0.25);
          fade *= mix(0.68, 0.94, edgeSoft);
        }
        float finalAlpha = tex.a * fade;
        gl_FragColor = vec4(uColor * finalAlpha, finalAlpha);
      }
    `;

    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Build two seamless open half-cylinders (Front half & Back half)
    // so both front charcoal and back white text read upright & seamlessly roll!
    function buildHalfCylinder(isBack) {
      const segX = 40;
      const segT = 48;
      const radius = 0.86;
      const halfLen = 1.08;
      const positions = [];
      const uvs = [];
      const indices = [];

      for (let iy = 0; iy <= segT; iy++) {
        const tFrac = iy / segT; // 0 (top) to 1 (bottom)
        const theta = isBack
          ? (Math.PI * 0.5) + tFrac * Math.PI        // +pi/2 -> +3pi/2 (back side top->bottom)
          : (Math.PI * 0.5) - tFrac * Math.PI;       // +pi/2 -> -pi/2  (front side top->bottom)

        const y = radius * Math.sin(theta);
        const z = radius * Math.cos(theta);
        const v = tFrac; // 0 at top -> 1 at bottom on BOTH halves!

        for (let ix = 0; ix <= segX; ix++) {
          const u = ix / segX;
          const x = (u - 0.5) * 2.0 * halfLen;
          positions.push(x, y, z);
          uvs.push(u, v);
        }
      }

      const stride = segX + 1;
      for (let iy = 0; iy < segT; iy++) {
        for (let ix = 0; ix < segX; ix++) {
          const a = iy * stride + ix;
          const b = a + stride;
          const c = a + 1;
          const d = b + 1;
          indices.push(a, b, c, c, b, d);
        }
      }

      return {
        positions: new Float32Array(positions),
        uvs: new Float32Array(uvs),
        indices: new Uint16Array(indices),
      };
    }

    function createMeshBuffers(mesh) {
      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);

      const uvBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.uvs, gl.STATIC_DRAW);

      const idxBuf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

      return { posBuf, uvBuf, idxBuf, count: mesh.indices.length };
    }

    const frontMesh = createMeshBuffers(buildHalfCylinder(false));
    const backMesh = createMeshBuffers(buildHalfCylinder(true));

    const aPos = gl.getAttribLocation(program, 'aPos');
    const aUv = gl.getAttribLocation(program, 'aUv');
    const uMvp = gl.getUniformLocation(program, 'uMvp');
    const uTex = gl.getUniformLocation(program, 'uTex');
    const uColor = gl.getUniformLocation(program, 'uColor');
    const uOpacity = gl.getUniformLocation(program, 'uOpacity');
    const uScroll = gl.getUniformLocation(program, 'uScroll');
    const uIsBack = gl.getUniformLocation(program, 'uIsBack');

    const texture = gl.createTexture();
    function uploadTexture() {
      const texCanvas = createKineticTextCanvas();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
    }

    uploadTexture();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(uploadTexture);
    }

    // Minimal 4x4 matrix helpers (column-major)
    function multiplyMat4(a, b) {
      const out = new Float32Array(16);
      for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
          out[col * 4 + row] =
            a[0 * 4 + row] * b[col * 4 + 0] +
            a[1 * 4 + row] * b[col * 4 + 1] +
            a[2 * 4 + row] * b[col * 4 + 2] +
            a[3 * 4 + row] * b[col * 4 + 3];
        }
      }
      return out;
    }

    function perspective(fovRad, aspect, near, far) {
      const f = 1.0 / Math.tan(fovRad / 2);
      const nf = 1 / (near - far);
      return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2 * far * near * nf, 0,
      ]);
    }

    function translateZ(z) {
      return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, z, 1,
      ]);
    }

    function rotateX(a) {
      const c = Math.cos(a), s = Math.sin(a);
      return new Float32Array([
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1,
      ]);
    }

    function rotateY(a) {
      const c = Math.cos(a), s = Math.sin(a);
      return new Float32Array([
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1,
      ]);
    }

    function rotateZ(a) {
      const c = Math.cos(a), s = Math.sin(a);
      return new Float32Array([
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ]);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    let scrollOffset = 0.80;
    let targetRotY = 0.50;
    let currentRotY = 0.50;
    let targetRotX = 0.06;
    let currentRotX = 0.06;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let dragVelocity = 0;

    if (stage) {
      stage.addEventListener('pointerdown', (e) => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        stage.setPointerCapture(e.pointerId);
      });
      stage.addEventListener('pointermove', (e) => {
        if (isDragging) {
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          targetRotY = Math.max(0.10, Math.min(0.95, targetRotY + dx * 0.004));
          dragVelocity = dy * 0.0016;
          scrollOffset += dragVelocity;
          lastX = e.clientX;
          lastY = e.clientY;
        } else {
          const rect = stage.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          targetRotY = 0.50 + nx * 0.18;
          targetRotX = 0.06 + ny * 0.14;
        }
      });
      stage.addEventListener('pointerup', () => {
        isDragging = false;
      });
      stage.addEventListener('mouseleave', () => {
        isDragging = false;
        targetRotY = 0.50;
        targetRotX = 0.06;
      });
    }

    function drawMesh(mesh, color, opacity, isBackFlag) {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.posBuf);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuf);
      gl.enableVertexAttribArray(aUv);
      gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.idxBuf);

      gl.uniform3fv(uColor, color);
      gl.uniform1f(uOpacity, opacity);
      gl.uniform1f(uIsBack, isBackFlag);

      gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastTime = performance.now();
    let isCylinderActive = true;
    let cylinderRafId = 0;

    function render(now) {
      cylinderRafId = 0;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!prefersReduced && !isDragging) {
        scrollOffset += dt * 0.045;
      }

      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.CULL_FACE);

      const aspect = canvas.width / Math.max(1, canvas.height);
      const proj = perspective((34 * Math.PI) / 180, aspect, 0.1, 20.0);
      const view = translateZ(-3.95);
      const model = multiplyMat4(
        rotateZ(0.11),
        multiplyMat4(rotateX(currentRotX), rotateY(currentRotY))
      );
      const mvp = multiplyMat4(proj, multiplyMat4(view, model));

      gl.uniformMatrix4fv(uMvp, false, mvp);
      gl.uniform1i(uTex, 0);
      gl.uniform1f(uScroll, scrollOffset);

      // Pass 1: Back translucent steel-blue wall (#5f7c98)
      drawMesh(backMesh, [0.373, 0.486, 0.596], 0.72, 1.0);
      // Pass 2: Front crisp studio white wall (#fdffff)
      drawMesh(frontMesh, [0.992, 1.0, 1.0], 1.0, 0.0);

      if (isCylinderActive && !document.hidden) {
        cylinderRafId = requestAnimationFrame(render);
      }
    }

    observeElementVisibility(stage, (active) => {
      isCylinderActive = active;
      if (active && !cylinderRafId) {
        lastTime = performance.now();
        cylinderRafId = requestAnimationFrame(render);
      } else if (!active && cylinderRafId) {
        cancelAnimationFrame(cylinderRafId);
        cylinderRafId = 0;
      }
    });

    cylinderRafId = requestAnimationFrame(render);
  }

  // ---------------------------------------------------------------------------
  // 4. Project Category Filtering (projects.html)
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
        let visibleIdx = 0;

        projectCards.forEach((card) => {
          const cardCategories = (card.getAttribute('data-category') || '').split(' ');
          if (selectedCategory === 'all' || cardCategories.includes(selectedCategory)) {
            card.style.display = 'flex';
            card.style.setProperty('--reveal-delay', `${visibleIdx * 75}ms`);
            visibleIdx++;
            card.classList.remove('is-revealed');
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.classList.add('is-revealed');
              });
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Interactive Case Study Modals (projects.html)
  // ---------------------------------------------------------------------------
  const caseStudiesData = {
    'switchfiber-admin': {
      eyebrow: 'PROBLEM SOLVER &bull; OPERATIONS',
      title: 'SwitchFiber Admin — Network Management',
      desc: 'An internal operations console built for Switch Fiber Network Operations to bring day-to-day ISP management into one clear workspace.',
      challenge: 'Running a regional fiber network means keeping subscriber records, service plans, field technician job orders, and fiber infrastructure synced cleanly without bouncing between disconnected spreadsheets.',
      solution: 'We built the authenticated SwitchFiber Admin console to bring subscriber accounts, service plan configurations, technician job orders, and fiber network management together inside one responsive web application.',
      tech: 'Vue 3, Vite, PrimeVue, Bootstrap, REST API',
      metrics: 'Subscriber, Plan, Job Order &amp; Fiber Management &bull; Live at <a href="https://admin.switchfiber.ph/switchfiberadmin/login" target="_blank" rel="noopener noreferrer">admin.switchfiber.ph/switchfiberadmin/login</a>'
    },
    'switchfiber-subscriber': {
      eyebrow: 'ONLINE PRESENCE &bull; OPERATIONS &bull; BILLING',
      title: 'SwitchFiber Public & Subscriber Portal',
      desc: 'The public website and subscriber portal serving homes and businesses across Binangonan and neighboring towns in Rizal.',
      challenge: 'Future subscribers needed a quick way to check barangay fiber availability, see honest plan pricing up front, apply online without visiting a branch, track installation status, and pay bills from their phone.',
      solution: 'We built a responsive public website and subscriber portal featuring the Rizal Fiber Grid serviceability checker, clear FTTH plan tiers (SwitchLite 50 Mbps &#8369;699, SwitchConnect 90 Mbps &#8369;799, SwitchNet 120 Mbps &#8369;999; up to 220 Mbps with 0 data cap), online signup (/register), application status tracking, router setup guides, and digital bill pay through pay.switchfiber.ph (GCash / QR Ph, Maya, WeChat Pay, Visa/Mastercard).',
      tech: 'Modern Web SPA, Rizal Fiber Grid Serviceability Checker, Digital Payments (pay.switchfiber.ph)',
      metrics: '9 Rizal Municipalities Covered &bull; Plans from &#8369;699/mo &bull; Live at <a href="https://switchfiberuser.genexis.dev/" target="_blank" rel="noopener noreferrer">switchfiberuser.genexis.dev</a>'
    },
    'switchfiber-mobile': {
      eyebrow: 'MOBILE APP &bull; FIELD OPERATIONS',
      title: 'Switch Fiber — Field Technician Terminal',
      desc: 'A dedicated mobile field terminal engineered for Switch Fiber Network Operations technicians working out on installations and line maintenance.',
      challenge: 'Field crews away from the office needed a focused, reliable mobile interface to sign in with their technician credentials and review assigned work orders without navigating a full desktop admin console on a phone.',
      solution: 'We built the Switch Fiber Field Technician Terminal mobile app with authenticated technician sign-in, credential persistence ("Remember me"), live backend server connection status (admin.switchfiber.ph), and direct access to assigned field work orders.',
      tech: 'Cross-Platform Mobile App, Authenticated Field Terminal, SwitchFiber Operations REST API',
      metrics: 'Technician Sign-In &amp; Work Order Access &bull; Connected to Switch Fiber Network Operations'
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
        openModal(btn.getAttribute('data-case-id'));
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Interactive Priority Brief Builder & Copy Email (contact.html)
  // ---------------------------------------------------------------------------
  async function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // Fallback below for non-HTTPS or restricted contexts
      }
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (_) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  const priorityLabels = {
    'problem': 'Fix a Workflow Bottleneck',
    'promo': 'Improve Online Presence',
    'operations': 'Organize Daily Operations',
    'income': 'Support Revenue Growth'
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
        summaryText.textContent = 'None selected yet (choose at least 1 area)';
      } else if (selected.length === 4) {
        summaryText.textContent = 'All 4 Areas Selected (Full Website & System Setup)';
      } else {
        summaryText.textContent = selected.map((p) => priorityLabels[p]).join(', ');
      }

      if (mailtoBtn) {
        const subject = encodeURIComponent('Project Consultation Brief — Harmony IT Consultancy');
        const priorityList = selected.length > 0
          ? selected.map((p, idx) => `  ${idx + 1}. ${priorityLabels[p]}`).join('\n')
          : '  - General Inquiry';
        const body = encodeURIComponent(
          `Hi Paulo, Gene, and Bry,\n\nI'd like to talk about a website or system project for our business. Here is what matters most to us right now:\n\n${priorityList}\n\nCompany Name:\nContact Person:\nBest Time for a Call:\n\nThanks!`
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
${priorityList}`;

        const copied = await copyTextToClipboard(briefText);
        showCopiedFeedback(
          copyBriefBtn,
          copied
            ? 'Project brief copied to clipboard!'
            : 'Brief prepared — email inquiries@harmonyitc.com'
        );
      });
    }

    updateBrief();
  }

  let sharedToastTimer = null;
  function showCopiedFeedback(triggerBtn, message) {
    const badge = triggerBtn && triggerBtn.querySelector('.copied-badge');
    if (badge) {
      badge.classList.add('show');
      clearTimeout(badge._hideTimer);
      badge._hideTimer = setTimeout(() => badge.classList.remove('show'), 2500);
    }
    const toast = document.getElementById('copied-toast');
    if (toast) {
      const textSpan = toast.querySelector('.toast-text');
      if (textSpan && message) textSpan.textContent = message;
      toast.classList.add('show');
      clearTimeout(sharedToastTimer);
      sharedToastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }

  function initCopyEmail() {
    const copyBtns = document.querySelectorAll('.copy-email-trigger');
    if (!copyBtns.length) return;

    copyBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email') || 'inquiries@harmonyitc.com';
        const copied = await copyTextToClipboard(email);
        showCopiedFeedback(
          btn,
          copied ? `Copied ${email} to clipboard!` : `Direct email: ${email}`
        );
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 7. Top Scroll Progress Indicator Bar (All Scrollable Pages)
  // ---------------------------------------------------------------------------
  function initScrollProgressBar() {
    if (document.body.classList.contains('deck-mode')) return;

    let bar = document.querySelector('.scroll-progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress-bar';
      bar.setAttribute('aria-hidden', 'true');
      document.body.prepend(bar);
    }

    let progressRaf = 0;
    function updateProgress() {
      progressRaf = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      bar.style.width = `${pct}%`;
    }

    function scheduleProgress() {
      if (!progressRaf) {
        progressRaf = requestAnimationFrame(updateProgress);
      }
    }

    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress, { passive: true });
    updateProgress();
  }

  // ---------------------------------------------------------------------------
  // 8. 3D Parallax Scroll-Reveal Engine (All Pages)
  // ---------------------------------------------------------------------------
  function initParallaxReveal() {
    if (document.body.classList.contains('deck-mode')) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    document.documentElement.classList.add('js-parallax-ready');

    // Auto-bind reveal classes & directional variants across all pages
    const revealConfigs = [
      { selector: '.hero-eyebrow, .page-eyebrow', variant: 'reveal-up', delay: 0 },
      { selector: '.hero-headline, .page-title, .team-heading, .home-pillars-section h2, .home-comparison-section h2, .content-section > .section-inner > h2', variant: 'reveal-up', delay: 70 },
      { selector: '.hero-sublead, .page-lead, .team-intro, .home-comparison-section > .section-inner > p', variant: 'reveal-up', delay: 140 },
      { selector: '.pitch-focus-box', variant: 'reveal-up', delay: 200 },
      { selector: '.hero-cta-row, .filter-rail', variant: 'reveal-up', delay: 250 },
      { selector: '.hero-artwork-stage', variant: 'reveal-scale', delay: 120 },
      { selector: '.frosted-panel', variant: 'reveal-up', delay: 80 },
      { selector: '.cosmic-quote-card', variant: 'reveal-right', delay: 180 },
      { selector: '.comparison-card-passive', variant: 'reveal-left', delay: 80 },
      { selector: '.comparison-card-engine', variant: 'reveal-right', delay: 180 },
      { selector: '.kinetic-stage', variant: 'reveal-scale', delay: 90 },
      { selector: '.contact-email-box', variant: 'reveal-scale', delay: 100 }
    ];

    revealConfigs.forEach(({ selector, variant, delay }) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (el.closest('.case-modal-backdrop')) return;
        el.classList.add('parallax-reveal', variant);
        if (delay && !el.style.getPropertyValue('--reveal-delay')) {
          el.style.setProperty('--reveal-delay', `${delay}ms`);
        }
      });
    });

    // Staggered grid items across all pages
    const gridContainers = [
      { parent: '.home-metrics-grid', child: '.home-metric-card', step: 85, variant: 'reveal-up' },
      { parent: '.pillars-grid-2x2', child: '.pillar-card', step: 95, variant: 'reveal-up' },
      { parent: '.process-grid-4', child: '.process-card', step: 90, variant: 'reveal-up' },
      { parent: '.team-grid', child: '.team-member', step: 110, variant: 'reveal-up' },
      { parent: '.gallery-grid-3', child: '.project-card', step: 85, variant: 'reveal-up' },
      { parent: '.priority-checklist-grid', child: '.priority-choice-card', step: 80, variant: 'reveal-up' },
      { parent: '.contact-channels-grid', child: '.contact-channel-card', step: 95, variant: 'reveal-up' }
    ];

    gridContainers.forEach(({ parent, child, step, variant }) => {
      document.querySelectorAll(parent).forEach((grid) => {
        grid.querySelectorAll(child).forEach((item, idx) => {
          item.classList.add('parallax-reveal', variant);
          item.style.setProperty('--reveal-delay', `${idx * step}ms`);
        });
      });
    });

    // Also include any custom [data-reveal] elements
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const dir = el.getAttribute('data-reveal') || 'up';
      el.classList.add('parallax-reveal', `reveal-${dir}`);
      const customDelay = el.getAttribute('data-reveal-delay');
      if (customDelay) {
        el.style.setProperty('--reveal-delay', `${customDelay}ms`);
      }
    });

    const allRevealEls = document.querySelectorAll('.parallax-reveal');
    if (!allRevealEls.length) return;

    if (!('IntersectionObserver' in window)) {
      allRevealEls.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          } else {
            // Re-arm reveal when element leaves far below viewport so scrolling down again replays the parallax reveal
            const rect = entry.boundingClientRect;
            if (rect.top > window.innerHeight * 0.92) {
              entry.target.classList.remove('is-revealed');
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -45px 0px'
      }
    );

    allRevealEls.forEach((el) => observer.observe(el));
  }

  // ---------------------------------------------------------------------------
  // 9. Multi-Layer Scroll & Pointer Parallax Motion (All Pages)
  // ---------------------------------------------------------------------------
  function initMultiLayerParallaxMotion() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cornerCoil = document.querySelector('.ambient-corner-coil');
    const footerWordmark = document.querySelector('.footer-giant-wordmark');
    const footerEl = document.querySelector('.site-footer');
    const projectThumbImgs = Array.from(document.querySelectorAll('.project-thumb img'));

    // Assign default parallax depth speeds to signature visual layers if not explicitly set
    const autoDepthTargets = [
      { selector: '.hero-artwork-stage', speed: -0.075 },
      { selector: '.cosmic-quote-card', speed: 0.055 },
      { selector: '.comparison-card-engine', speed: 0.045 },
      { selector: '.team-portrait-card', speed: -0.04 },
      { selector: '.contact-email-box', speed: 0.04 }
    ];

    autoDepthTargets.forEach(({ selector, speed }) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!el.hasAttribute('data-parallax-speed')) {
          el.setAttribute('data-parallax-speed', String(speed));
        }
      });
    });

    const parallaxNodes = Array.from(document.querySelectorAll('[data-parallax-speed]'));

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let rafId = 0;
    let scrollDirty = true;

    function scheduleParallax() {
      if (!rafId && !document.hidden) {
        rafId = requestAnimationFrame(updateParallaxFrame);
      }
    }

    window.addEventListener(
      'mousemove',
      (e) => {
        targetMouseX = e.clientX / Math.max(1, window.innerWidth) - 0.5;
        targetMouseY = e.clientY / Math.max(1, window.innerHeight) - 0.5;
        scheduleParallax();
      },
      { passive: true }
    );

    const onScrollOrResize = () => {
      scrollDirty = true;
      scheduleParallax();
    };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    const parallaxItems = parallaxNodes
      .map((node) => ({
        node,
        speed: parseFloat(node.getAttribute('data-parallax-speed')) || 0,
        isReveal: node.classList.contains('parallax-reveal')
      }))
      .filter((item) => item.speed !== 0);

    function updateParallaxFrame() {
      rafId = 0;
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = Math.max(1, window.innerHeight);
      const isDeck = document.body.classList.contains('deck-mode');

      // Batch all geometry reads before style writes to avoid layout thrashing
      let nodeOffsets = null;
      let thumbOffsets = null;
      let footerRect = null;

      if (!isDeck && scrollDirty) {
        nodeOffsets = parallaxItems.map((item) => {
          const rect = item.node.getBoundingClientRect();
          if (rect.bottom < -120 || rect.top > vh + 120) return null;
          const centerOffset = rect.top + rect.height * 0.5 - vh * 0.5;
          return Math.max(-36, Math.min(36, centerOffset * item.speed));
        });

        thumbOffsets = projectThumbImgs.map((img) => {
          const rect = img.getBoundingClientRect();
          if (rect.bottom < -60 || rect.top > vh + 60) return null;
          const norm = (rect.top + rect.height * 0.5 - vh * 0.5) / (vh * 0.6);
          return Math.max(-18, Math.min(18, norm * -16));
        });

        if (footerWordmark && footerEl) {
          footerRect = footerEl.getBoundingClientRect();
        }
      } else if (!isDeck && footerWordmark && footerEl) {
        footerRect = footerEl.getBoundingClientRect();
      }

      // 1. Ambient Backdrop Subtle Parallax
      if (cornerCoil) {
        const cy = scrollY * 0.07 + currentMouseY * 18;
        const cx = currentMouseX * 20;
        const crot = scrollY * 0.045 + currentMouseX * 12;
        cornerCoil.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) rotate(${crot.toFixed(2)}deg)`;
      }

      // 2. Scroll-Driven Depth Parallax on Page Elements
      if (!isDeck && scrollDirty && nodeOffsets) {
        for (let i = 0; i < parallaxItems.length; i++) {
          const offsetY = nodeOffsets[i];
          if (offsetY === null) continue;
          const item = parallaxItems[i];
          if (item.isReveal) {
            item.node.style.setProperty('--parallax-y', `${offsetY.toFixed(1)}px`);
          } else {
            item.node.style.transform = `translate3d(0, ${offsetY.toFixed(1)}px, 0)`;
          }
        }

        // 3. Project Card Thumbnail Window-Curtain Parallax
        for (let i = 0; i < projectThumbImgs.length; i++) {
          const shiftY = thumbOffsets[i];
          if (shiftY === null) continue;
          projectThumbImgs[i].style.setProperty('--thumb-parallax-y', `${shiftY.toFixed(1)}px`);
        }
      }

      // 4. Footer Giant Wordmark Curtain-Rise Parallax
      if (!isDeck && footerWordmark && footerRect && footerRect.top < vh) {
        const progress = Math.min(1, Math.max(0, (vh - footerRect.top) / Math.max(1, footerRect.height)));
        const yPct = 26 - progress * 20; // Rises smoothly from 26% to 6%
        footerWordmark.style.transform = `translate3d(${(currentMouseX * -14).toFixed(1)}px, ${yPct.toFixed(2)}%, 0)`;
      }

      scrollDirty = false;
      const mouseSettled =
        Math.abs(targetMouseX - currentMouseX) < 0.0008 &&
        Math.abs(targetMouseY - currentMouseY) < 0.0008;

      if (!mouseSettled) {
        scheduleParallax();
      }
    }

    scheduleParallax();
  }

  // ---------------------------------------------------------------------------
  // 10. Interactive 3D Magnetic Card Tilt & Specular Spotlight (All Pages)
  // ---------------------------------------------------------------------------
  function initCardTiltParallax() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cardSelectors = [
      '.pillar-card',
      '.process-card',
      '.home-metric-card',
      '.project-card',
      '.cosmic-quote-card',
      '.comparison-card-passive',
      '.comparison-card-engine',
      '.contact-channel-card',
      '.priority-choice-card',
      '.founder-profile-card'
    ];

    const cards = document.querySelectorAll(cardSelectors.join(', '));
    cards.forEach((card) => {
      card.classList.add('parallax-tilt-card');
      let tiltRaf = 0;
      let latestX = 0;
      let latestY = 0;

      card.addEventListener('mousemove', (e) => {
        latestX = e.clientX;
        latestY = e.clientY;
        if (tiltRaf) return;
        tiltRaf = requestAnimationFrame(() => {
          tiltRaf = 0;
          const rect = card.getBoundingClientRect();
          const x = latestX - rect.left;
          const y = latestY - rect.top;
          const nx = x / Math.max(1, rect.width) - 0.5;
          const ny = y / Math.max(1, rect.height) - 0.5;

          const tiltX = (ny * -5.5).toFixed(2);
          const tiltY = (nx * 5.5).toFixed(2);

          card.style.setProperty('--mouse-x', `${x.toFixed(0)}px`);
          card.style.setProperty('--mouse-y', `${y.toFixed(0)}px`);
          card.style.setProperty('--tilt-x', `${tiltX}deg`);
          card.style.setProperty('--tilt-y', `${tiltY}deg`);
        });
      });

      card.addEventListener('mouseleave', () => {
        if (tiltRaf) {
          cancelAnimationFrame(tiltRaf);
          tiltRaf = 0;
        }
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 11. Interactive Matte Ambient Particle Field (All Pages)
  // ---------------------------------------------------------------------------
  function initInteractiveParticleField() {
    const ambientCanvasWrap = document.querySelector('.ambient-canvas');
    if (!ambientCanvasWrap) return;

    let canvas = ambientCanvasWrap.querySelector('.ambient-particle-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'ambient-particle-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      ambientCanvasWrap.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];

    // Sampled matte ice-steel hues matching the studio palette
    const palette = [
      [180, 208, 233], // #b4d0e9
      [156, 183, 212], // #9cb7d4
      [216, 238, 255], // #d8eeff
      [126, 153, 181]  // #7e99b5
    ];

    const pointer = {
      x: -9999,
      y: -9999,
      active: false
    };

    const ripples = [];

    function createParticle(randomPos) {
      const col = palette[Math.floor(Math.random() * palette.length)];
      const depth = 0.45 + Math.random() * 0.85;
      return {
        x: randomPos ? Math.random() * width : (Math.random() < 0.5 ? -10 : width + 10),
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34 * depth,
        vy: (-0.08 - Math.random() * 0.24) * depth,
        baseR: 1.05 + Math.random() * 1.55 * depth,
        depth,
        alpha: 0.22 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        color: col
      };
    }

    function syncParticleCount() {
      const targetCount = Math.min(92, Math.max(34, Math.round((width * height) / 18500)));
      while (particles.length < targetCount) {
        particles.push(createParticle(true));
      }
      if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(320, window.innerWidth);
      height = Math.max(320, window.innerHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      syncParticleCount();
    }

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener(
      'pointermove',
      (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
      },
      { passive: true }
    );

    window.addEventListener('pointerleave', () => {
      pointer.active = false;
    });

    window.addEventListener(
      'pointerdown',
      (e) => {
        if (prefersReduced) return;
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 10,
          maxRadius: 210,
          alpha: 0.38
        });
      },
      { passive: true }
    );

    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    let scrollImpulse = 0;
    window.addEventListener(
      'scroll',
      () => {
        const curY = window.scrollY || window.pageYOffset || 0;
        scrollImpulse = Math.max(-18, Math.min(18, (curY - lastScrollY) * 0.14));
        lastScrollY = curY;
      },
      { passive: true }
    );

    let rafId = null;
    let lastTime = performance.now();

    function render(now) {
      if (document.hidden) {
        rafId = null;
        return;
      }

      const dt = Math.min(0.05, Math.max(0.004, (now - lastTime) / 1000));
      const dtNorm = dt * 60;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const linkDist = width < 640 ? 96 : 128;
      const pointerDist = width < 640 ? 130 : 175;
      const tSec = now * 0.001;
      const wavePhase = prefersReduced ? 0 : tSec * 0.65;
      const pNormX = pointer.active ? pointer.x / Math.max(1, width) : 0.5;
      const pNormY = pointer.active ? pointer.y / Math.max(1, height) : 0.5;

      // Flowing atmospheric studio glows & silk wave ribbons integrated into the background
      const gx1 = width * (0.24 + Math.sin(wavePhase * 0.72) * 0.12 + (pNormX - 0.5) * 0.09);
      const gy1 = height * (0.34 + Math.cos(wavePhase * 0.58) * 0.14 + (pNormY - 0.5) * 0.08);
      const glow1 = ctx.createRadialGradient(gx1, gy1, 0, gx1, gy1, Math.max(width, height) * 0.45);
      glow1.addColorStop(0, 'rgba(180, 208, 233, 0.14)');
      glow1.addColorStop(0.55, 'rgba(58, 106, 147, 0.07)');
      glow1.addColorStop(1, 'rgba(12, 45, 79, 0)');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const gx2 = width * (0.78 + Math.cos(wavePhase * 0.64) * 0.11 - (pNormX - 0.5) * 0.08);
      const gy2 = height * (0.68 + Math.sin(wavePhase * 0.82) * 0.12 - (pNormY - 0.5) * 0.08);
      const glow2 = ctx.createRadialGradient(gx2, gy2, 0, gx2, gy2, Math.max(width, height) * 0.42);
      glow2.addColorStop(0, 'rgba(255, 112, 42, 0.08)');
      glow2.addColorStop(0.5, 'rgba(77, 110, 143, 0.08)');
      glow2.addColorStop(1, 'rgba(2, 11, 40, 0)');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      const scrollShift = (window.scrollY || window.pageYOffset || 0) * 0.04;
      for (let w = 0; w < 5; w++) {
        ctx.beginPath();
        const baseY = height * (0.26 + w * 0.13) - (scrollShift % 60);
        const amp = 18 + w * 5;
        const freq = 0.0042 + w * 0.0008;
        for (let x = 0; x <= width; x += 18) {
          const y =
            baseY +
            Math.sin(x * freq + wavePhase * (0.95 + w * 0.14) + w * 1.1) * amp +
            Math.cos(x * freq * 0.52 - wavePhase * 0.65) * (amp * 0.42);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w === 2
          ? 'rgba(216, 238, 255, 0.11)'
          : 'rgba(156, 183, 212, 0.065)';
        ctx.lineWidth = w === 2 ? 1.4 : 1;
        ctx.stroke();
      }

      // Update active click ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 5.4 * dtNorm;
        rip.alpha *= Math.pow(0.94, dtNorm);
        if (rip.radius > rip.maxRadius || rip.alpha < 0.015) {
          ripples.splice(r, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(180, 208, 233, ${rip.alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      scrollImpulse *= Math.pow(0.88, dtNorm);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReduced) {
          p.x += p.vx * dtNorm;
          p.y += (p.vy - scrollImpulse * 0.08 * p.depth) * dtNorm;

          // Gentle pointer repulsion + tangential drift
          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const distSq = dx * dx + dy * dy;
            if (distSq > 1 && distSq < pointerDist * pointerDist) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / pointerDist) * 0.42 * p.depth * dtNorm;
              p.x += (dx / dist) * force * 2.1 - (dy / dist) * force * 0.55;
              p.y += (dy / dist) * force * 2.1 + (dx / dist) * force * 0.55;
            }
          }

          // Gentle ripple push on click/tap
          for (let r = 0; r < ripples.length; r++) {
            const rip = ripples[r];
            const dx = p.x - rip.x;
            const dy = p.y - rip.y;
            const dist = Math.hypot(dx, dy);
            if (Math.abs(dist - rip.radius) < 26 && dist > 1) {
              const push = (1 - Math.abs(dist - rip.radius) / 26) * 1.45 * p.depth * dtNorm;
              p.x += (dx / dist) * push;
              p.y += (dy / dist) * push;
            }
          }

          // Wrap smoothly across viewport bounds
          if (p.x < -16) p.x = width + 16;
          else if (p.x > width + 16) p.x = -16;
          if (p.y < -16) p.y = height + 16;
          else if (p.y > height + 16) p.y = -16;
        }

        // Constellation links between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < linkDist * linkDist) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / linkDist) * 0.17;
            ctx.strokeStyle = `rgba(156, 183, 212, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        // Interactive pointer-to-particle filament
        let boost = 0;
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < pointerDist * pointerDist) {
            const dist = Math.sqrt(distSq);
            const strength = 1 - dist / pointerDist;
            boost = strength * 0.38;
            ctx.strokeStyle = `rgba(216, 238, 255, ${(strength * 0.24).toFixed(3)})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }

        const twinkle = prefersReduced ? 1 : 0.82 + Math.sin(tSec * 1.4 + p.phase) * 0.18;
        const finalAlpha = Math.min(0.85, (p.alpha + boost) * twinkle);
        const radius = p.baseR * (1 + boost * 0.55);

        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${finalAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReduced) {
        rafId = requestAnimationFrame(render);
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !prefersReduced && rafId === null) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(render);
      }
    });

    rafId = requestAnimationFrame(render);
  }

  // ---------------------------------------------------------------------------
  // Initialize Everything
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initSharedChrome();
    initPillar3DArtworks();
    initMobileNav();
    initHero3DEngine();
    initPitchNavigator();
    initKineticCylinder();
    initProjectFilters();
    initCaseStudyModals();
    initBriefBuilder();
    initCopyEmail();
    initScrollProgressBar();
    initParallaxReveal();
    initMultiLayerParallaxMotion();
    initCardTiltParallax();
    initInteractiveParticleField();
  });
})();
