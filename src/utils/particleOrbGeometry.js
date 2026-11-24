// Gene - Nov, 24, 2026: Pure 3D Fibonacci-sphere particle orb geometry, geodesic shell edges, and responsive hero layout helpers

const ORB_PALETTE = Object.freeze({
  bright: Object.freeze([253, 255, 255]),
  ice: Object.freeze([216, 238, 255]),
  steel: Object.freeze([180, 208, 233]),
  amber: Object.freeze([255, 132, 66])
});

function createSeededRandom(seed) {
  let state = (seed >>> 0) || 1;
  return function nextRandom() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fibonacciSphereDirection(index, total) {
  const safeTotal = Math.max(1, total);
  const y = safeTotal === 1 ? 0 : 1 - (index / (safeTotal - 1)) * 2;
  const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const theta = goldenAngle * index;
  const x = Math.cos(theta) * ringRadius;
  const z = Math.sin(theta) * ringRadius;
  const mag = Math.hypot(x, y, z) || 1;
  return {
    bx: x / mag,
    by: y / mag,
    bz: z / mag
  };
}

function pickTone(rand, weights) {
  const roll = rand();
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i].weight;
    if (roll <= acc) return weights[i].tone;
  }
  return weights[weights.length - 1].tone;
}

export function computeOrbLayout(width, height) {
  const w = Math.max(320, Number(width) || 1200);
  const h = Math.max(360, Number(height) || 720);
  const isCompact = w < 640;

  if (w >= 960) {
    const contentW = Math.min(w - 64, 1200);
    const contentLeft = (w - contentW) * 0.5;
    const radius = Math.min(228, Math.max(148, Math.min(contentW * 0.19, h * 0.285)));
    const cx = Math.min(w - radius * 1.12, contentLeft + contentW * 0.785);
    const cy = Math.max(radius * 1.12, Math.min(h * 0.44, h - radius * 1.25));
    return {
      cx,
      cy,
      radius,
      intensity: 1,
      isCompact
    };
  }

  if (w >= 640) {
    const radius = Math.min(185, Math.max(125, Math.min(w * 0.25, h * 0.26)));
    const cx = Math.min(w - radius * 0.92, w * 0.72);
    const cy = h * 0.39;
    return {
      cx,
      cy,
      radius,
      intensity: 0.82,
      isCompact
    };
  }

  const radius = Math.min(148, Math.max(96, Math.min(w * 0.34, h * 0.24)));
  const cx = w * 0.66;
  const cy = h * 0.34;
  return {
    cx,
    cy,
    radius,
    intensity: 0.68,
    isCompact
  };
}

export function createOrbParticles({ compact = false, seed = 20261124 } = {}) {
  const rand = createSeededRandom(seed);
  const shellCount = compact ? 104 : 168;
  const coreCount = compact ? 34 : 56;
  const haloCount = compact ? 18 : 32;
  const particles = [];

  const shellWeights = [
    { tone: 'amber', weight: 0.12 },
    { tone: 'bright', weight: 0.24 },
    { tone: 'ice', weight: 0.36 },
    { tone: 'steel', weight: 0.28 }
  ];

  for (let i = 0; i < shellCount; i++) {
    const { bx, by, bz } = fibonacciSphereDirection(i, shellCount);
    const tone = pickTone(rand, shellWeights);
    particles.push({
      layer: 'shell',
      bx,
      by,
      bz,
      radiusScale: 0.97 + rand() * 0.07,
      size: 1.25 + rand() * 1.45,
      phase: rand() * Math.PI * 2,
      waveFreq: 1.6 + rand() * 1.4,
      tone,
      rgb: ORB_PALETTE[tone],
      glow: tone === 'amber' || (tone === 'bright' && rand() > 0.5)
    });
  }

  const coreWeights = [
    { tone: 'amber', weight: 0.18 },
    { tone: 'bright', weight: 0.32 },
    { tone: 'ice', weight: 0.5 }
  ];

  for (let i = 0; i < coreCount; i++) {
    const { bx, by, bz } = fibonacciSphereDirection(i, coreCount);
    const tone = pickTone(rand, coreWeights);
    particles.push({
      layer: 'core',
      bx,
      by,
      bz,
      radiusScale: 0.36 + rand() * 0.28,
      size: 1.0 + rand() * 1.3,
      phase: rand() * Math.PI * 2,
      waveFreq: 1.3 + rand() * 1.2,
      tone,
      rgb: ORB_PALETTE[tone],
      glow: tone === 'amber' || rand() > 0.55
    });
  }

  const haloWeights = [
    { tone: 'amber', weight: 0.14 },
    { tone: 'bright', weight: 0.22 },
    { tone: 'ice', weight: 0.36 },
    { tone: 'steel', weight: 0.28 }
  ];

  const ringZeroCount = Math.ceil(haloCount * 0.5);
  const ringOneCount = haloCount - ringZeroCount;

  for (let i = 0; i < haloCount; i++) {
    const ringIndex = i < ringZeroCount ? 0 : 1;
    const localIdx = ringIndex === 0 ? i : i - ringZeroCount;
    const localTotal = ringIndex === 0 ? ringZeroCount : ringOneCount;
    const angle = (localIdx / Math.max(1, localTotal)) * Math.PI * 2 + (rand() - 0.5) * 0.22;
    const tone = pickTone(rand, haloWeights);

    const isRingZero = ringIndex === 0;
    const tiltX = isRingZero ? 0.42 : -0.56;
    const tiltZ = isRingZero ? -0.34 : 0.48;
    const orbitRadius = isRingZero ? 1.14 + rand() * 0.16 : 1.18 + rand() * 0.18;
    const orbitSpeed = isRingZero ? 0.24 + rand() * 0.2 : -(0.22 + rand() * 0.2);

    particles.push({
      layer: 'halo',
      ringIndex,
      angle,
      orbitRadius,
      orbitSpeed,
      tiltX,
      tiltZ,
      size: 0.95 + rand() * 1.15,
      phase: rand() * Math.PI * 2,
      tone,
      rgb: ORB_PALETTE[tone],
      glow: rand() > 0.72
    });
  }

  return { particles, shellCount };
}

export function buildShellEdges(particles, shellCount, maxNeighbors = 2, maxChordDist = 0.48) {
  const safeShellCount = Math.min(shellCount, particles.length);
  if (safeShellCount < 2 || maxNeighbors <= 0) return [];

  const maxDistSq = maxChordDist * maxChordDist;
  const edgeKeys = new Set();
  const edges = [];

  for (let i = 0; i < safeShellCount; i++) {
    const a = particles[i];
    const candidates = [];

    for (let j = 0; j < safeShellCount; j++) {
      if (i === j) continue;
      const b = particles[j];
      const dx = a.bx - b.bx;
      const dy = a.by - b.by;
      const dz = a.bz - b.bz;
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq <= maxDistSq) {
        candidates.push({ index: j, distSq });
      }
    }

    candidates.sort((u, v) => u.distSq - v.distSq);
    const limit = Math.min(maxNeighbors, candidates.length);
    for (let k = 0; k < limit; k++) {
      const nIdx = candidates[k].index;
      const lo = i < nIdx ? i : nIdx;
      const hi = i < nIdx ? nIdx : i;
      const key = `${lo}:${hi}`;
      if (!edgeKeys.has(key)) {
        edgeKeys.add(key);
        edges.push([lo, hi]);
      }
    }
  }

  return edges;
}
