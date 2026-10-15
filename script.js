/**
 * HarmonyITC &mdash; Work in Progress Landing Page
 * Vanilla JavaScript (ES6+) - 100% native, zero dependencies
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Mode)
  // ---------------------------------------------------------------------------
  const STORAGE_THEME_KEY = 'harmony_theme_preference';
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);
    // Update theme meta color tag
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'light' ? '#f8fafc' : '#070a12');
    }
    // Update canvas particle colors if canvas is active
    if (window.updateCanvasTheme) {
      window.updateCanvasTheme(theme);
    }
  }

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // Listen for system color scheme changes if user hasn't explicitly set preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_THEME_KEY)) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Dynamic Year in Footer
  // ---------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ---------------------------------------------------------------------------
  // 3. Email Notification Form Handling
  // ---------------------------------------------------------------------------
  const notifyForm = document.getElementById('notify-form');
  const emailInput = document.getElementById('email-input');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');
  const STORAGE_SUBSCRIBED_KEY = 'harmony_subscriber_email';

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  // Check if user already subscribed previously
  const previouslySubscribed = localStorage.getItem(STORAGE_SUBSCRIBED_KEY);
  if (previouslySubscribed && emailInput && submitBtn) {
    emailInput.value = previouslySubscribed;
    emailInput.disabled = true;
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Subscribed';
    formFeedback.textContent = "You're already on the priority launch list. We'll be in touch soon!";
    formFeedback.className = 'form-feedback success';
  }

  if (notifyForm) {
    notifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!email) {
        showFeedback('Please enter your email address.', 'error');
        emailInput.focus();
        return;
      }

      if (!isValidEmail(email)) {
        showFeedback('Please enter a valid email address (e.g. name@company.com).', 'error');
        emailInput.focus();
        return;
      }

      // UI Loading State
      const btnText = submitBtn.querySelector('.btn-text');
      const originalText = btnText.textContent;
      submitBtn.disabled = true;
      btnText.textContent = 'Registering...';

      // Simulate network submission delay
      setTimeout(() => {
        localStorage.setItem(STORAGE_SUBSCRIBED_KEY, email);
        emailInput.disabled = true;
        btnText.textContent = 'Subscribed';
        showFeedback('Thank you! You have been added to the early access list.', 'success');
      }, 750);
    });
  }

  function showFeedback(message, type) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
  }

  // ---------------------------------------------------------------------------
  // 4. Copy Email Address to Clipboard
  // ---------------------------------------------------------------------------
  const copyBtn = document.getElementById('copy-email-btn');
  const copyToast = document.getElementById('copy-toast');
  let copyTimeoutId = null;

  if (copyBtn && copyToast) {
    copyBtn.addEventListener('click', async () => {
      const emailText = 'inquiries@harmonyitc.com';

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailText);
        } else {
          // Fallback for non-secure or older contexts
          const textArea = document.createElement('textarea');
          textArea.value = emailText;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        // Show Copied Toast
        copyToast.classList.add('show');
        if (copyTimeoutId) clearTimeout(copyTimeoutId);
        copyTimeoutId = setTimeout(() => {
          copyToast.classList.remove('show');
        }, 2200);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Interactive Network Canvas Background
  // ---------------------------------------------------------------------------
  const canvas = document.getElementById('network-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animationFrameId = null;
    let particles = [];

    // Configuration
    const mouse = { x: null, y: null, maxDistance: 130 };
    let particleColor = 'rgba(56, 189, 248, 0.45)';
    let lineColor = 'rgba(56, 189, 248, 0.12)';

    window.updateCanvasTheme = function (theme) {
      if (theme === 'light') {
        particleColor = 'rgba(2, 132, 199, 0.4)';
        lineColor = 'rgba(2, 132, 199, 0.08)';
      } else {
        particleColor = 'rgba(56, 189, 248, 0.45)';
        lineColor = 'rgba(56, 189, 248, 0.12)';
      }
    };
    window.updateCanvasTheme(htmlElement.getAttribute('data-theme') || 'dark');

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    }

    function initParticles() {
      // Calculate responsive count
      const area = width * height;
      const count = Math.min(Math.floor(area / 24000), 55);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDist = 120;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const opacity = 1 - Math.sqrt(distSq) / maxDist;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${(opacity * 0.18).toFixed(3)})`);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect to mouse pointer
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const mouseDist = Math.sqrt(dx * dx + dy * dy);

          if (mouseDist < mouse.maxDistance) {
            const mouseOpacity = 1 - mouseDist / mouse.maxDistance;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${(mouseOpacity * 0.28).toFixed(3)})`);
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }

    // Event listeners
    window.addEventListener('resize', debounce(resizeCanvas, 150));
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Pause animation when tab is inactive to save battery/CPU
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    });

    // Initialize and start
    resizeCanvas();
    animate();
  }

  // ---------------------------------------------------------------------------
  // Helper: Debounce
  // ---------------------------------------------------------------------------
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
})();
