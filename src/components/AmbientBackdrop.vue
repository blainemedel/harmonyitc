<!-- Gene - Nov, 23, 2026: Fullscreen matte slate-navy backdrop with corner coil and interactive particle canvas -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvasRef = ref(null);
let rafId = null;
let cleanupListeners = null;

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];

  const palette = [
    [180, 208, 233],
    [156, 183, 212],
    [216, 238, 255],
    [126, 153, 181]
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
      x: randomPos ? Math.random() * width : Math.random() < 0.5 ? -10 : width + 10,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.34 * depth,
      vy: (-0.08 - Math.random() * 0.24) * depth,
      baseR: 1.05 + Math.random() * 1.55 * depth,
      depth,
      // Gene - Nov, 24, 2026: Quieted ambient particle alpha so monumental hero waves and editorial typography read crisply
      /* alpha: 0.22 + Math.random() * 0.4, */
      alpha: 0.14 + Math.random() * 0.24,
      phase: Math.random() * Math.PI * 2,
      color: col
    };
  }

  function syncParticleCount() {
    // Gene - Nov, 24, 2026: Reduced particle density ~35% for cleaner studio backdrop breathing room
    /* const targetCount = Math.min(72, Math.max(24, Math.round((width * height) / 22000))); */
    const targetCount = Math.min(46, Math.max(16, Math.round((width * height) / 34000)));
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
    if (prefersReduced) {
      render(performance.now());
    }
  }

  let lastScrollY = window.scrollY || window.pageYOffset || 0;
  let scrollImpulse = 0;
  let lastTime = performance.now();

  function render(now) {
    if (document.hidden && !prefersReduced) {
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
      ctx.strokeStyle = w === 2 ? 'rgba(216, 238, 255, 0.11)' : 'rgba(156, 183, 212, 0.065)';
      ctx.lineWidth = w === 2 ? 1.4 : 1;
      ctx.stroke();
    }

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

        if (p.x < -16) p.x = width + 16;
        else if (p.x > width + 16) p.x = -16;
        if (p.y < -16) p.y = height + 16;
        else if (p.y > height + 16) p.y = -16;
      }

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

  const onPointerMove = (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  };

  const clearPointer = () => {
    pointer.active = false;
  };

  const onPointerDown = (e) => {
    if (prefersReduced) return;
    ripples.push({
      x: e.clientX,
      y: e.clientY,
      radius: 10,
      maxRadius: 210,
      alpha: 0.38
    });
  };

  const onScroll = () => {
    const curY = window.scrollY || window.pageYOffset || 0;
    scrollImpulse = Math.max(-18, Math.min(18, (curY - lastScrollY) * 0.14));
    lastScrollY = curY;
  };

  const onVisibilityChange = () => {
    if (!document.hidden && !prefersReduced && rafId === null) {
      lastTime = performance.now();
      rafId = requestAnimationFrame(render);
    }
  };

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', clearPointer);
  window.addEventListener('blur', clearPointer);
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);

  if (!prefersReduced) {
    rafId = requestAnimationFrame(render);
  }

  cleanupListeners = () => {
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', clearPointer);
    window.removeEventListener('blur', clearPointer);
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
});

onBeforeUnmount(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (cleanupListeners) {
    cleanupListeners();
    cleanupListeners = null;
  }
});
</script>

<template>
  <div class="ambient-canvas" aria-hidden="true">
    <canvas ref="canvasRef" class="ambient-particle-canvas" aria-hidden="true" />
    <svg class="ambient-corner-coil" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="porcelainGrad" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#3a5874" stop-opacity="0.75" />
          <stop offset="55%" stop-color="#274667" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#0c2d4f" stop-opacity="0.18" />
        </radialGradient>
      </defs>
      <circle cx="95" cy="145" r="96" stroke="url(#porcelainGrad)" stroke-width="10" />
      <circle cx="95" cy="145" r="80" stroke="url(#porcelainGrad)" stroke-width="8" />
      <circle cx="95" cy="145" r="64" stroke="url(#porcelainGrad)" stroke-width="7" />
      <circle cx="95" cy="145" r="48" stroke="url(#porcelainGrad)" stroke-width="6" />
      <circle cx="95" cy="145" r="32" stroke="url(#porcelainGrad)" stroke-width="5" />
    </svg>
  </div>
</template>
