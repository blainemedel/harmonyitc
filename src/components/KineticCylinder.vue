<!-- Gene - Nov, 23, 2026: WebGL 3D kinetic typography cylinder with shader link validation, pointercancel safety, and reduced-motion support -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { HOME_DATA } from '@/data/siteContent';

const stageRef = ref(null);
const canvasRef = ref(null);
const showFallback = ref(false);

let cleanupAll = null;

function createKineticTextCanvas() {
  const texCanvas = document.createElement('canvas');
  texCanvas.width = 2048;
  texCanvas.height = 1024;
  const ctx = texCanvas.getContext('2d');
  ctx.clearRect(0, 0, texCanvas.width, texCanvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  const leftX = 360;
  const fontStack = '"Anton", "Oswald", Impact, "Arial Narrow", sans-serif';

  HOME_DATA.kineticSection.lines.forEach((item) => {
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
    0, 0, 2 * far * near * nf, 0
  ]);
}

function translateZ(z) {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, z, 1
  ]);
}

function rotateX(a) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ]);
}

function rotateY(a) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return new Float32Array([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ]);
}

function rotateZ(a) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return new Float32Array([
    c, s, 0, 0,
    -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

function buildHalfCylinder(isBack) {
  const segX = 40;
  const segT = 48;
  const radius = 0.86;
  const halfLen = 1.08;
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let iy = 0; iy <= segT; iy++) {
    const tFrac = iy / segT;
    const theta = isBack ? Math.PI * 0.5 + tFrac * Math.PI : Math.PI * 0.5 - tFrac * Math.PI;
    const y = radius * Math.sin(theta);
    const z = radius * Math.cos(theta);
    const v = tFrac;

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
    indices: new Uint16Array(indices)
  };
}

onMounted(() => {
  const canvas = canvasRef.value;
  const stage = stageRef.value;
  if (!canvas || !stage) return;

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true
  });

  if (!gl) {
    showFallback.value = true;
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
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = compileShader(gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    showFallback.value = true;
    return;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    showFallback.value = true;
    return;
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    showFallback.value = true;
    return;
  }

  gl.useProgram(program);

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
  let disposed = false;

  function uploadTexture() {
    if (disposed) return;
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

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let scrollOffset = 0.8;
  let targetRotY = 0.5;
  let currentRotY = 0.5;
  let targetRotX = 0.06;
  let currentRotX = 0.06;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let lastTime = performance.now();
  let isCylinderActive = true;
  let cylinderRafId = 0;
  let io = null;

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

  function renderFrame(now) {
    cylinderRafId = 0;
    if (disposed) return;

    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    if (!prefersReduced && !isDragging) {
      scrollOffset += dt * 0.045;
    }

    currentRotY += (targetRotY - currentRotY) * (prefersReduced ? 1 : 0.08);
    currentRotX += (targetRotX - currentRotX) * (prefersReduced ? 1 : 0.08);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.CULL_FACE);

    const aspect = canvas.width / Math.max(1, canvas.height);
    const proj = perspective((34 * Math.PI) / 180, aspect, 0.1, 20.0);
    const view = translateZ(-3.95);
    const model = multiplyMat4(rotateZ(0.11), multiplyMat4(rotateX(currentRotX), rotateY(currentRotY)));
    const mvp = multiplyMat4(proj, multiplyMat4(view, model));

    gl.uniformMatrix4fv(uMvp, false, mvp);
    gl.uniform1i(uTex, 0);
    gl.uniform1f(uScroll, scrollOffset);

    drawMesh(backMesh, [0.373, 0.486, 0.596], 0.72, 1.0);
    drawMesh(frontMesh, [0.992, 1.0, 1.0], 1.0, 0.0);

    if (!prefersReduced && isCylinderActive && !document.hidden) {
      cylinderRafId = requestAnimationFrame(renderFrame);
    }
  }

  function resize() {
    if (disposed) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (prefersReduced) {
      renderFrame(performance.now());
    }
  }

  uploadTexture();
  resize();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (disposed) return;
      uploadTexture();
      if (prefersReduced) {
        renderFrame(performance.now());
      }
    });
  }

  const onPointerDown = (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    try {
      stage.setPointerCapture(e.pointerId);
    } catch (_) {
      // Ignore if pointer capture is unsupported for synthetic events
    }
  };

  const onPointerMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      targetRotY = Math.max(0.1, Math.min(0.95, targetRotY + dx * 0.004));
      scrollOffset += dy * 0.0016;
      lastX = e.clientX;
      lastY = e.clientY;
      if (prefersReduced) renderFrame(performance.now());
    } else if (!prefersReduced) {
      const rect = stage.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      targetRotY = 0.5 + nx * 0.18;
      targetRotX = 0.06 + ny * 0.14;
    }
  };

  const resetDrag = () => {
    isDragging = false;
  };

  const onMouseLeave = () => {
    isDragging = false;
    targetRotY = 0.5;
    targetRotX = 0.06;
  };

  const syncAnimationState = () => {
    if (prefersReduced || disposed) return;
    const shouldRun = isCylinderActive && !document.hidden;
    if (shouldRun && !cylinderRafId) {
      lastTime = performance.now();
      cylinderRafId = requestAnimationFrame(renderFrame);
    } else if (!shouldRun && cylinderRafId) {
      cancelAnimationFrame(cylinderRafId);
      cylinderRafId = 0;
    }
  };

  const onVisibilityChange = () => syncAnimationState();

  if (!prefersReduced && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === stage) {
            isCylinderActive = entry.isIntersecting;
            syncAnimationState();
          }
        });
      },
      { rootMargin: '80px 0px', threshold: 0.01 }
    );
    io.observe(stage);
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibilityChange);
  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', resetDrag);
  stage.addEventListener('pointercancel', resetDrag);
  stage.addEventListener('mouseleave', onMouseLeave);

  if (prefersReduced) {
    renderFrame(performance.now());
  } else {
    cylinderRafId = requestAnimationFrame(renderFrame);
  }

  cleanupAll = () => {
    disposed = true;
    if (cylinderRafId) {
      cancelAnimationFrame(cylinderRafId);
      cylinderRafId = 0;
    }
    if (io) {
      io.disconnect();
      io = null;
    }
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    stage.removeEventListener('pointerdown', onPointerDown);
    stage.removeEventListener('pointermove', onPointerMove);
    stage.removeEventListener('pointerup', resetDrag);
    stage.removeEventListener('pointercancel', resetDrag);
    stage.removeEventListener('mouseleave', onMouseLeave);

    gl.deleteBuffer(frontMesh.posBuf);
    gl.deleteBuffer(frontMesh.uvBuf);
    gl.deleteBuffer(frontMesh.idxBuf);
    gl.deleteBuffer(backMesh.posBuf);
    gl.deleteBuffer(backMesh.uvBuf);
    gl.deleteBuffer(backMesh.idxBuf);
    gl.deleteTexture(texture);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };
});

onBeforeUnmount(() => {
  if (cleanupAll) {
    cleanupAll();
    cleanupAll = null;
  }
});
</script>

<template>
  <div ref="stageRef" class="kinetic-stage">
    <canvas v-if="!showFallback" ref="canvasRef" class="kinetic-cylinder-canvas" aria-hidden="true" />
    <div v-else class="kinetic-fallback" aria-hidden="true">
      THE WAIT<br />
      WE PROMISE<br />
      IT WILL BE<br />
      WORTH
    </div>
  </div>
</template>
