<!-- Gene - Nov, 24, 2026: Full-bleed cursor-reactive harmonic wave field backing the monumental editorial Hero -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvasRef = ref(null);
let cleanup = null;

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const host = canvas.parentElement || canvas;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 1200;
  let height = 720;
  let dpr = 1;
  let phase = 0.4;
  let scrollBoost = 0;
  let lastScrollY = window.scrollY || window.pageYOffset || 0;
  let targetPointerX = 0.62;
  let targetPointerY = 0.44;
  let currentPointerX = 0.62;
  let currentPointerY = 0.44;
  let pointerActive = false;
  let isInView = true;
  let rafId = 0;
  let lastTime = performance.now();
  let io = null;

  const waveSpecs = [
    { color: 'rgba(156, 183, 212, 0.16)', width: 1.0, freq: 0.0046, speed: 0.72, shift: 0.0, amp: 32, yRatio: 0.44 },
    { color: 'rgba(180, 208, 233, 0.24)', width: 1.4, freq: 0.0038, speed: 0.94, shift: 1.2, amp: 44, yRatio: 0.5 },
    { color: 'rgba(216, 238, 255, 0.34)', width: 1.85, freq: 0.0031, speed: 1.1, shift: 2.35, amp: 52, yRatio: 0.54 },
    { color: 'rgba(255, 132, 66, 0.22)', width: 1.15, freq: 0.0052, speed: 1.32, shift: 3.4, amp: 28, yRatio: 0.58 },
    { color: 'rgba(126, 178, 224, 0.15)', width: 0.95, freq: 0.0061, speed: 0.65, shift: 4.5, amp: 24, yRatio: 0.63 }
  ];

  function drawFrame(now) {
    rafId = 0;
    const dt = Math.min(0.05, Math.max(0.004, (now - lastTime) / 1000));
    lastTime = now;

    if (!prefersReduced) {
      phase += dt * (0.95 + Math.abs(scrollBoost) * 0.12);
      scrollBoost *= Math.pow(0.9, dt * 60);
      currentPointerX += (targetPointerX - currentPointerX) * 0.06;
      currentPointerY += (targetPointerY - currentPointerY) * 0.06;
    }

    ctx.clearRect(0, 0, width, height);

    // Soft studio ambient glow anchored around pointer / right composition balance
    const gx = width * currentPointerX;
    const gy = height * currentPointerY;
    const glowR = Math.max(width, height) * 0.52;
    const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowR);
    glow.addColorStop(0, pointerActive ? 'rgba(180, 208, 233, 0.22)' : 'rgba(180, 208, 233, 0.15)');
    glow.addColorStop(0.42, 'rgba(58, 106, 147, 0.12)');
    glow.addColorStop(0.75, 'rgba(255, 132, 66, 0.035)');
    glow.addColorStop(1, 'rgba(23, 57, 92, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    const stepX = width < 640 ? 10 : 8;

    for (let w = 0; w < waveSpecs.length; w++) {
      const spec = waveSpecs[w];
      ctx.beginPath();

      for (let x = 0; x <= width; x += stepX) {
        const normX = x / Math.max(1, width);
        const envelope = Math.sin(normX * Math.PI);
        const distPointer = Math.abs(normX - currentPointerX);
        const pointerLift =
          distPointer < 0.28
            ? (1 - distPointer / 0.28) * (currentPointerY - 0.5) * (pointerActive ? 54 : 18)
            : 0;

        const wave1 = Math.sin(x * spec.freq - phase * spec.speed + spec.shift) * spec.amp;
        const wave2 = Math.cos(x * spec.freq * 0.55 + phase * 0.62 + w) * (spec.amp * 0.36);
        const y = height * spec.yRatio + (wave1 + wave2) * (0.38 + 0.62 * envelope) + pointerLift;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = spec.color;
      ctx.lineWidth = spec.width;
      ctx.stroke();
    }

    if (!prefersReduced && isInView && !document.hidden) {
      rafId = requestAnimationFrame(drawFrame);
    }
  }

  function syncLoop() {
    const shouldRun = !prefersReduced && isInView && !document.hidden;
    if (shouldRun && !rafId) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(drawFrame);
    } else if (!shouldRun && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function resize() {
    const rect = host.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(320, Math.round(rect.width));
    height = Math.max(360, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFrame(performance.now());
  }

  const onPointerMove = (e) => {
    const rect = host.getBoundingClientRect();
    targetPointerX = Math.min(0.95, Math.max(0.05, (e.clientX - rect.left) / Math.max(1, rect.width)));
    targetPointerY = Math.min(0.85, Math.max(0.15, (e.clientY - rect.top) / Math.max(1, rect.height)));
    pointerActive = true;
  };

  const onPointerLeave = () => {
    pointerActive = false;
    targetPointerX = 0.62;
    targetPointerY = 0.44;
  };

  const onScroll = () => {
    const curY = window.scrollY || window.pageYOffset || 0;
    scrollBoost = Math.max(-12, Math.min(12, (curY - lastScrollY) * 0.25));
    lastScrollY = curY;
  };

  const onVisibilityChange = () => syncLoop();

  if (!prefersReduced && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === host) {
            isInView = entry.isIntersecting;
            syncLoop();
          }
        });
      },
      { rootMargin: '80px 0px', threshold: 0.01 }
    );
    io.observe(host);
  }

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  host.addEventListener('pointermove', onPointerMove, { passive: true });
  host.addEventListener('pointerleave', onPointerLeave);

  syncLoop();

  cleanup = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    if (io) {
      io.disconnect();
      io = null;
    }
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    host.removeEventListener('pointermove', onPointerMove);
    host.removeEventListener('pointerleave', onPointerLeave);
  };
});

onBeforeUnmount(() => {
  cleanup?.();
  cleanup = null;
});
</script>

<template>
  <canvas ref="canvasRef" class="hero-wave-canvas" aria-hidden="true" />
</template>
