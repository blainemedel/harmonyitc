<!-- Gene - Nov, 24, 2026: Interactive 3D Canvas particle orb positioned on the hero right/background with harmonic breathing, orbital rings, and cursor physics -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  computeOrbLayout,
  createOrbParticles,
  buildShellEdges
} from '@/utils/particleOrbGeometry';

const canvasRef = ref(null);
let cleanup = null;

function easeOutCubic(t) {
  const inv = 1 - t;
  return 1 - inv * inv * inv;
}

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
  let layout = computeOrbLayout(width, height);
  let activeCompactMode = null;

  let particles = [];
  let shellCount = 0;
  let shellEdges = [];
  let projected = [];
  let drawOrder = [];
  let dispX = new Float32Array(0);
  let dispY = new Float32Array(0);

  const RING_SEGMENTS = 72;
  const ringData = [
    {
      radiusFactor: 1.18,
      tiltX: 0.42,
      tiltZ: -0.34,
      spinRate: 0.14,
      frontRgb: '180, 208, 233',
      frontAlpha: 0.17,
      frontWidth: 1.05,
      px: new Float32Array(RING_SEGMENTS + 1),
      py: new Float32Array(RING_SEGMENTS + 1),
      pz: new Float32Array(RING_SEGMENTS + 1)
    },
    {
      radiusFactor: 1.29,
      tiltX: -0.56,
      tiltZ: 0.48,
      spinRate: -0.11,
      frontRgb: '255, 132, 66',
      frontAlpha: 0.12,
      frontWidth: 0.95,
      px: new Float32Array(RING_SEGMENTS + 1),
      py: new Float32Array(RING_SEGMENTS + 1),
      pz: new Float32Array(RING_SEGMENTS + 1)
    }
  ];

  function syncParticleBuffers(isCompact) {
    if (activeCompactMode === isCompact && particles.length > 0) return;
    activeCompactMode = isCompact;

    const created = createOrbParticles({ compact: isCompact });
    particles = created.particles;
    shellCount = created.shellCount;
    shellEdges = buildShellEdges(particles, shellCount, 2, 0.48);

    const count = particles.length;
    projected = new Array(count);
    drawOrder = new Array(count);
    dispX = new Float32Array(count);
    dispY = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      projected[i] = {
        sx: 0,
        sy: 0,
        z: 0,
        normZ: 0,
        perspective: 1,
        hoverBoost: 0
      };
      drawOrder[i] = i;
    }
  }

  let time = 0;
  let rotY = 0.45;
  let coreRotY = -0.3;
  let scrollBoost = 0;
  let lastScrollY = window.scrollY || window.pageYOffset || 0;

  let pointerActive = false;
  let pointerPxX = 0;
  let pointerPxY = 0;
  let targetTiltX = 0;
  let targetTiltY = 0;
  let curTiltX = 0;
  let curTiltY = 0;
  let targetShiftX = 0;
  let targetShiftY = 0;
  let curShiftX = 0;
  let curShiftY = 0;

  let isInView = true;
  let rafId = 0;
  const startedAt = performance.now();
  let lastTime = startedAt;
  let io = null;
  let ro = null;

  function drawFrame(now) {
    rafId = 0;
    const dt = Math.min(0.05, Math.max(0.004, (now - lastTime) / 1000));
    lastTime = now;

    if (!prefersReduced) {
      time += dt;
      rotY += dt * (0.26 + scrollBoost * 0.055);
      coreRotY -= dt * (0.18 + scrollBoost * 0.04);
      scrollBoost *= Math.pow(0.9, dt * 60);

      const tiltLerp = 1 - Math.exp(-7.5 * dt);
      const shiftLerp = 1 - Math.exp(-6.5 * dt);
      curTiltX += (targetTiltX - curTiltX) * tiltLerp;
      curTiltY += (targetTiltY - curTiltY) * tiltLerp;
      curShiftX += (targetShiftX - curShiftX) * shiftLerp;
      curShiftY += (targetShiftY - curShiftY) * shiftLerp;
    }

    const intro = prefersReduced ? 1 : easeOutCubic(Math.min(1, (now - startedAt) / 950));
    const introScale = 0.86 + 0.14 * intro;
    const R = layout.radius * introScale;
    const globalAlpha = layout.intensity * intro;

    const floatY = prefersReduced ? 0 : Math.sin(time * 1.05) * 7.5;
    const orbX = layout.cx + curShiftX;
    const orbY = layout.cy + curShiftY + floatY;
    const fov = Math.max(180, R * 3.2);

    const effRotY = rotY + curTiltY;
    const effCoreRotY = coreRotY + curTiltY * 0.65;
    const rotX = 0.24 + Math.sin(time * 0.42) * 0.14 + curTiltX;
    const rotZ = -0.14 + Math.cos(time * 0.31) * 0.06;

    const cosSY = Math.cos(effRotY);
    const sinSY = Math.sin(effRotY);
    const cosCY = Math.cos(effCoreRotY);
    const sinCY = Math.sin(effCoreRotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosZ = Math.cos(rotZ);
    const sinZ = Math.sin(rotZ);

    const distToOrb = Math.hypot(pointerPxX - orbX, pointerPxY - orbY);
    const pointerNearOrb = !prefersReduced && pointerActive && distToOrb < R * 1.45;
    const repelR = R * 0.44;
    const springLerp = 1 - Math.exp(-12 * dt);

    const count = particles.length;
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      let lx = 0;
      let ly = 0;
      let lz = 0;

      if (p.layer === 'halo') {
        const ringSpin = p.ringIndex === 0 ? time * 0.14 : -time * 0.11;
        const a = p.angle + (prefersReduced ? 0 : time * p.orbitSpeed + ringSpin);
        const rOrbit = R * p.orbitRadius;
        const rx0 = Math.cos(a) * rOrbit;
        const rz0 = Math.sin(a) * rOrbit;

        const cosTX = Math.cos(p.tiltX);
        const sinTX = Math.sin(p.tiltX);
        const cosTZ = Math.cos(p.tiltZ);
        const sinTZ = Math.sin(p.tiltZ);

        const y1 = -rz0 * sinTX;
        const z1 = rz0 * cosTX;
        const x2 = rx0 * cosTZ - y1 * sinTZ;
        const y2 = rx0 * sinTZ + y1 * cosTZ;

        const x3 = x2 * cosSY + z1 * sinSY;
        const z3 = -x2 * sinSY + z1 * cosSY;
        const y4 = y2 * cosX - z3 * sinX;
        const z4 = y2 * sinX + z3 * cosX;

        lx = x3 * cosZ - y4 * sinZ;
        ly = x3 * sinZ + y4 * cosZ;
        lz = z4;
      } else if (p.layer === 'core') {
        const coreBreath = prefersReduced ? 1 : 1 + Math.sin(p.phase + time * p.waveFreq) * 0.06;
        const rCore = R * p.radiusScale * coreBreath;
        const px = p.bx * rCore;
        const py = p.by * rCore;
        const pz = p.bz * rCore;

        const x1 = px * cosCY + pz * sinCY;
        const z1 = -px * sinCY + pz * cosCY;
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        lx = x1 * cosZ - y2 * sinZ;
        ly = x1 * sinZ + y2 * cosZ;
        lz = z2;
      } else {
        const breath = prefersReduced
          ? 1
          : 1 +
            Math.sin(p.by * 3.1 + time * 1.35 + p.phase * 0.35) * 0.048 +
            Math.cos(p.bx * 2.4 - time * 0.95) * 0.025;
        const rShell = R * p.radiusScale * breath;
        const px = p.bx * rShell;
        const py = p.by * rShell;
        const pz = p.bz * rShell;

        const x1 = px * cosSY + pz * sinSY;
        const z1 = -px * sinSY + pz * cosSY;
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        lx = x1 * cosZ - y2 * sinZ;
        ly = x1 * sinZ + y2 * cosZ;
        lz = z2;
      }

      const perspective = fov / Math.max(40, fov - lz);
      const baseSx = orbX + lx * perspective;
      const baseSy = orbY + ly * perspective;

      let targetDx = 0;
      let targetDy = 0;
      let hoverBoost = 0;

      if (pointerNearOrb) {
        const dx = baseSx - pointerPxX;
        const dy = baseSy - pointerPxY;
        const dist = Math.hypot(dx, dy);
        if (dist < repelR) {
          const strength = 1 - dist / repelR;
          const push = strength * strength * 15;
          if (dist > 0.001) {
            targetDx = (dx / dist) * push;
            targetDy = (dy / dist) * push;
          } else {
            targetDx = Math.cos(p.phase) * push;
            targetDy = Math.sin(p.phase) * push;
          }
          hoverBoost = strength;
        }
      }

      if (prefersReduced) {
        dispX[i] = 0;
        dispY[i] = 0;
      } else {
        dispX[i] += (targetDx - dispX[i]) * springLerp;
        dispY[i] += (targetDy - dispY[i]) * springLerp;
      }

      const proj = projected[i];
      proj.sx = baseSx + dispX[i];
      proj.sy = baseSy + dispY[i];
      proj.z = lz;
      proj.normZ = lz / Math.max(1, R);
      proj.perspective = perspective;
      proj.hoverBoost = hoverBoost;
    }

    drawOrder.sort((a, b) => projected[a].z - projected[b].z);

    for (let rIdx = 0; rIdx < ringData.length; rIdx++) {
      const ring = ringData[rIdx];
      const rOrbit = R * ring.radiusFactor;
      const cosTX = Math.cos(ring.tiltX);
      const sinTX = Math.sin(ring.tiltX);
      const cosTZ = Math.cos(ring.tiltZ);
      const sinTZ = Math.sin(ring.tiltZ);
      const spin = prefersReduced ? 0 : time * ring.spinRate;

      for (let s = 0; s <= RING_SEGMENTS; s++) {
        const a = (s / RING_SEGMENTS) * Math.PI * 2 + spin;
        const rx0 = Math.cos(a) * rOrbit;
        const rz0 = Math.sin(a) * rOrbit;

        const y1 = -rz0 * sinTX;
        const z1 = rz0 * cosTX;
        const x2 = rx0 * cosTZ - y1 * sinTZ;
        const y2 = rx0 * sinTZ + y1 * cosTZ;

        const x3 = x2 * cosSY + z1 * sinSY;
        const z3 = -x2 * sinSY + z1 * cosSY;
        const y4 = y2 * cosX - z3 * sinX;
        const z4 = y2 * sinX + z3 * cosX;

        const lx = x3 * cosZ - y4 * sinZ;
        const ly = x3 * sinZ + y4 * cosZ;
        const perspective = fov / Math.max(40, fov - z4);

        ring.px[s] = orbX + lx * perspective;
        ring.py[s] = orbY + ly * perspective;
        ring.pz[s] = z4;
      }
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Ambient outer aura
    const auraR = R * 1.95;
    const aura = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, auraR);
    aura.addColorStop(0, `rgba(180, 208, 233, ${(0.14 * globalAlpha).toFixed(4)})`);
    aura.addColorStop(0.38, `rgba(58, 106, 147, ${(0.11 * globalAlpha).toFixed(4)})`);
    aura.addColorStop(0.72, `rgba(255, 132, 66, ${(0.03 * globalAlpha).toFixed(4)})`);
    aura.addColorStop(1, 'rgba(23, 57, 92, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(orbX, orbY, auraR, 0, Math.PI * 2);
    ctx.fill();

    // 2. Back 3D orbital rings (z < 0)
    ctx.strokeStyle = `rgba(180, 208, 233, ${(0.08 * globalAlpha).toFixed(4)})`;
    ctx.lineWidth = 0.9;
    for (let rIdx = 0; rIdx < ringData.length; rIdx++) {
      const ring = ringData[rIdx];
      ctx.beginPath();
      for (let s = 0; s < RING_SEGMENTS; s++) {
        if ((ring.pz[s] + ring.pz[s + 1]) * 0.5 < 0) {
          ctx.moveTo(ring.px[s], ring.py[s]);
          ctx.lineTo(ring.px[s + 1], ring.py[s + 1]);
        }
      }
      ctx.stroke();
    }

    // 3. Back hemisphere shell edges & particles (z < 0)
    ctx.lineWidth = 0.7;
    for (let e = 0; e < shellEdges.length; e++) {
      const [aIdx, bIdx] = shellEdges[e];
      const pa = projected[aIdx];
      const pb = projected[bIdx];
      const avgZ = (pa.normZ + pb.normZ) * 0.5;
      if (avgZ <= -0.15) {
        const edgeAlpha = Math.max(0.015, Math.min(0.05, 0.05 * (1 + avgZ * 0.6))) * globalAlpha;
        ctx.strokeStyle = `rgba(180, 208, 233, ${edgeAlpha.toFixed(4)})`;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      }
    }

    let frontStart = count;
    for (let o = 0; o < count; o++) {
      const idx = drawOrder[o];
      const pr = projected[idx];
      if (pr.z >= 0) {
        frontStart = o;
        break;
      }

      const p = particles[idx];
      const backDepth = Math.min(1, Math.max(0, 1 + pr.normZ));
      const dotR = Math.max(0.85, p.size * pr.perspective * (0.78 + backDepth * 0.16));
      const dotAlpha = (0.12 + backDepth * 0.26) * globalAlpha;

      ctx.fillStyle = `rgba(${p.rgb[0]}, ${p.rgb[1]}, ${p.rgb[2]}, ${dotAlpha.toFixed(4)})`;
      ctx.beginPath();
      ctx.arc(pr.sx, pr.sy, dotR, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Translucent frosted-glass volumetric core
    const glassR = R * 0.96;
    const glassGrad = ctx.createRadialGradient(
      orbX - R * 0.24,
      orbY - R * 0.26,
      0,
      orbX,
      orbY,
      glassR
    );
    glassGrad.addColorStop(0, `rgba(216, 238, 255, ${(0.13 * globalAlpha).toFixed(4)})`);
    glassGrad.addColorStop(0.45, `rgba(63, 99, 134, ${(0.09 * globalAlpha).toFixed(4)})`);
    glassGrad.addColorStop(0.78, `rgba(12, 45, 79, ${(0.14 * globalAlpha).toFixed(4)})`);
    glassGrad.addColorStop(1, 'rgba(23, 57, 92, 0)');
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.arc(orbX, orbY, glassR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(216, 238, 255, ${(0.14 * globalAlpha).toFixed(4)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(orbX, orbY, R * 0.93, Math.PI * 1.05, Math.PI * 1.62);
    ctx.stroke();

    // 5. Front hemisphere shell edges & particles (z >= 0)
    for (let e = 0; e < shellEdges.length; e++) {
      const [aIdx, bIdx] = shellEdges[e];
      const pa = projected[aIdx];
      const pb = projected[bIdx];
      const avgZ = (pa.normZ + pb.normZ) * 0.5;
      if (avgZ > -0.15) {
        const depthFactor = Math.min(1, Math.max(0, (avgZ + 0.15) / 1.15));
        const boost = Math.max(pa.hoverBoost, pb.hoverBoost);
        const edgeAlpha = (0.04 + depthFactor * 0.13 + boost * 0.12) * globalAlpha;
        ctx.strokeStyle = `rgba(180, 208, 233, ${edgeAlpha.toFixed(4)})`;
        ctx.lineWidth = 0.7 + depthFactor * 0.45;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      }
    }

    for (let o = frontStart; o < count; o++) {
      const idx = drawOrder[o];
      const pr = projected[idx];
      const p = particles[idx];
      const normDepth = Math.min(1, Math.max(0, pr.normZ));
      const dotR = Math.max(0.95, p.size * pr.perspective * (0.85 + normDepth * 0.3));
      const dotAlpha = Math.min(0.95, (0.42 + normDepth * 0.48 + pr.hoverBoost * 0.22) * globalAlpha);
      const [cr, cg, cb] = p.rgb;

      if (p.glow && normDepth > 0.35) {
        const bloomR = dotR * 3.4;
        const bloom = ctx.createRadialGradient(pr.sx, pr.sy, 0, pr.sx, pr.sy, bloomR);
        bloom.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${(dotAlpha * 0.42).toFixed(4)})`);
        bloom.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(pr.sx, pr.sy, bloomR, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${dotAlpha.toFixed(4)})`;
      ctx.beginPath();
      ctx.arc(pr.sx, pr.sy, dotR, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Front 3D orbital rings (z >= 0)
    for (let rIdx = 0; rIdx < ringData.length; rIdx++) {
      const ring = ringData[rIdx];
      ctx.strokeStyle = `rgba(${ring.frontRgb}, ${(ring.frontAlpha * globalAlpha).toFixed(4)})`;
      ctx.lineWidth = ring.frontWidth;
      ctx.beginPath();
      for (let s = 0; s < RING_SEGMENTS; s++) {
        if ((ring.pz[s] + ring.pz[s + 1]) * 0.5 >= 0) {
          ctx.moveTo(ring.px[s], ring.py[s]);
          ctx.lineTo(ring.px[s + 1], ring.py[s + 1]);
        }
      }
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

    layout = computeOrbLayout(width, height);
    syncParticleBuffers(layout.isCompact);
    drawFrame(performance.now());
  }

  const onPointerMove = (e) => {
    const rect = host.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const normX = Math.min(1, Math.max(0, relX / Math.max(1, rect.width)));
    const normY = Math.min(1, Math.max(0, relY / Math.max(1, rect.height)));

    pointerPxX = relX;
    pointerPxY = relY;
    pointerActive = true;
    targetTiltY = (normX - 0.5) * 0.76;
    targetTiltX = (normY - 0.5) * 0.56;
    targetShiftX = (normX - 0.5) * 30;
    targetShiftY = (normY - 0.5) * 22;
  };

  const onPointerLeave = () => {
    pointerActive = false;
    targetTiltX = 0;
    targetTiltY = 0;
    targetShiftX = 0;
    targetShiftY = 0;
  };

  const onScroll = () => {
    const curY = window.scrollY || window.pageYOffset || 0;
    scrollBoost = Math.max(-10, Math.min(10, (curY - lastScrollY) * 0.25));
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

  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(() => resize());
    ro.observe(host);
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
    if (ro) {
      ro.disconnect();
      ro = null;
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
  <canvas ref="canvasRef" class="hero-orb-canvas" aria-hidden="true" />
</template>
