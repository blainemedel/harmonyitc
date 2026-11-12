/**
 * Harmony IT Consultancy — Multi-Page Interactivity & 3D Kinetic Typography
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
  // 2. Hero 3D Sculpture Subtle Mouse Parallax (index.html)
  // ---------------------------------------------------------------------------
  function initHeroParallax() {
    const stage = document.getElementById('hero-artwork-stage');
    if (!stage) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const square = stage.querySelector('.hero-dark-square');
    const letterD = stage.querySelector('.hero-letter-d');
    const coil = stage.querySelector('.hero-coil-img');
    const letterS = stage.querySelector('.hero-letter-s');

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      if (square) square.style.transform = `translate3d(${nx * -10}px, ${ny * -10}px, 0)`;
      if (letterD) letterD.style.transform = `translate3d(${nx * 14}px, ${ny * 12}px, 0)`;
      if (coil) coil.style.transform = `translate(-4%, 2%) rotate(${-10 + nx * 5}deg) translate3d(${nx * 20}px, ${ny * 18}px, 0)`;
      if (letterS) letterS.style.transform = `translate3d(${nx * 28}px, ${ny * 24}px, 0)`;
    });

    stage.addEventListener('mouseleave', () => {
      if (square) square.style.transform = '';
      if (letterD) letterD.style.transform = '';
      if (coil) coil.style.transform = '';
      if (letterS) letterS.style.transform = '';
    });
  }

  // ---------------------------------------------------------------------------
  // 2.5 Interactive Pitch Focus Navigator (index.html)
  // ---------------------------------------------------------------------------
  const pitchPillarsCopy = {
    problem:
      '<strong>Pillar 01 / Problem-Solving Engine:</strong> We diagnose where your current workflow leaks customers, time, or revenue&mdash;then build custom digital solutions that eliminate those friction points permanently.',
    promo:
      '<strong>Pillar 02 / 24/7 Digital Flagship:</strong> We establish commanding search authority, instant mobile performance, and high-trust storytelling so your brand captures qualified buyers around the clock.',
    operations:
      '<strong>Pillar 03 / Daily Operations Hub:</strong> We replace manual spreadsheets and chat bookings with automated scheduling, client self-service portals, live dispatch queues, and recurring billing.',
    income:
      '<strong>Pillar 04 / Revenue-Generating Engine:</strong> We engineer conversion funnels, interactive service estimators, and digital payment flows designed to turn website traffic into measurable ROI.'
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

    function render(now) {
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

      // Pass 1: Back translucent white wall
      drawMesh(backMesh, [1.0, 1.0, 1.0], 0.96, 1.0);
      // Pass 2: Front crisp deep charcoal wall
      drawMesh(frontMesh, [0.137, 0.145, 0.173], 1.0, 0.0);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
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

        projectCards.forEach((card) => {
          const cardCategories = (card.getAttribute('data-category') || '').split(' ');
          if (selectedCategory === 'all' || cardCategories.includes(selectedCategory)) {
            card.style.display = 'flex';
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
      tech: 'Semantic Modern HTML, Tailwind CSS Architecture, Node Gateway, Web Vitals Optimization',
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
        summaryText.textContent = selected.map((p) => priorityLabels[p]).join(', ');
      }

      if (mailtoBtn) {
        const subject = encodeURIComponent('Project Consultation Brief — Harmony IT Consultancy');
        const priorityList = selected.length > 0
          ? selected.map((p, idx) => `  ${idx + 1}. ${priorityLabels[p]}`).join('\n')
          : '  - General Consultation';
        const body = encodeURIComponent(
          `Hello HarmonyITC Team,\n\nI would like to schedule a consultation. Here are the core priorities for our project:\n\n${priorityList}\n\nCompany Name:\nContact Person:\nPreferred Consultation Time:\n\nThank you!`
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
        const badge = copyBriefBtn.querySelector('.copied-badge');
        if (badge) {
          badge.classList.add('show');
          setTimeout(() => badge.classList.remove('show'), 2500);
        }
        const toast = document.getElementById('copied-toast');
        if (toast) {
          toast.querySelector('.toast-text').textContent = copied
            ? 'Project brief copied to clipboard!'
            : 'Brief prepared — email inquiries@harmonyitc.com';
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 3000);
        }
      });
    }

    updateBrief();
  }

  function initCopyEmail() {
    const copyBtns = document.querySelectorAll('.copy-email-trigger');
    const toast = document.getElementById('copied-toast');
    if (!copyBtns.length) return;

    let toastTimer = null;
    function showToast(message) {
      if (!toast) return;
      const textSpan = toast.querySelector('.toast-text');
      if (textSpan && message) textSpan.textContent = message;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    copyBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email') || 'inquiries@harmonyitc.com';
        const copied = await copyTextToClipboard(email);
        const badge = btn.querySelector('.copied-badge');
        if (badge) {
          badge.classList.add('show');
          setTimeout(() => badge.classList.remove('show'), 2500);
        }
        showToast(copied ? `Copied ${email} to clipboard!` : `Direct email: ${email}`);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Initialize Everything
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initHeroParallax();
    initPitchNavigator();
    initKineticCylinder();
    initProjectFilters();
    initCaseStudyModals();
    initBriefBuilder();
    initCopyEmail();
  });
})();
