<!-- Gene - Nov, 23, 2026: Sculpted matte 3D SVG artwork per pillar shape with unique gradient IDs -->
<script setup>
import { useId } from 'vue';

defineProps({
  shape: {
    type: String,
    required: true
  }
});

const uid = useId();
</script>

<template>
  <div class="pillar-3d-showcase" aria-hidden="true">
    <svg v-if="shape === 'core'" viewBox="0 0 320 156" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient :id="`${uid}-sphere`" cx="64%" cy="32%" r="65%">
          <stop offset="0%" stop-color="#9eb0bf" />
          <stop offset="28%" stop-color="#8198ae" />
          <stop offset="58%" stop-color="#193c5e" />
          <stop offset="84%" stop-color="#0b2c49" />
          <stop offset="100%" stop-color="#010a27" />
        </radialGradient>
        <linearGradient :id="`${uid}-torus`" x1="25%" y1="15%" x2="78%" y2="88%">
          <stop offset="0%" stop-color="#9eb9d6" />
          <stop offset="35%" stop-color="#284a6d" />
          <stop offset="72%" stop-color="#193c5e" />
          <stop offset="100%" stop-color="#021d3c" />
        </linearGradient>
        <linearGradient :id="`${uid}-line`" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#345f87" stop-opacity="0" />
          <stop offset="50%" stop-color="#91b5d6" stop-opacity="0.45" />
          <stop offset="100%" stop-color="#345f87" stop-opacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="124" rx="54" ry="9" fill="#010a27" opacity="0.52" />
      <line x1="36" y1="126" x2="284" y2="126" :stroke="`url(#${uid}-line)`" stroke-width="1.2" />
      <line x1="56" y1="133" x2="264" y2="133" :stroke="`url(#${uid}-line)`" stroke-width="1" />
      <path
        d="M96 86 C96 60 125 42 160 42 C195 42 224 60 224 86 C224 108 195 122 160 122 C125 122 96 108 96 86 Z"
        :stroke="`url(#${uid}-torus)`"
        stroke-width="16"
        fill="none"
        transform="rotate(-14 160 82)"
      />
      <circle cx="160" cy="74" r="31" :fill="`url(#${uid}-sphere)`" />
      <path
        d="M110 100 C134 118 186 118 212 96"
        stroke="#7e99b5"
        stroke-width="6"
        stroke-linecap="round"
        opacity="0.32"
        transform="rotate(-14 160 82)"
      />
    </svg>

    <svg v-else-if="shape === 'sphere'" viewBox="0 0 320 156" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient :id="`${uid}-sphere`" cx="66%" cy="32%" r="66%">
          <stop offset="0%" stop-color="#9eb0bf" />
          <stop offset="22%" stop-color="#8198ae" />
          <stop offset="52%" stop-color="#284a6d" />
          <stop offset="78%" stop-color="#0b2c49" />
          <stop offset="100%" stop-color="#010a27" />
        </radialGradient>
        <linearGradient :id="`${uid}-bar`" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#345f87" stop-opacity="0" />
          <stop offset="50%" stop-color="#91b5d6" stop-opacity="0.72" />
          <stop offset="100%" stop-color="#345f87" stop-opacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="116" rx="46" ry="9" fill="#010a27" opacity="0.68" />
      <line x1="28" y1="120" x2="292" y2="120" :stroke="`url(#${uid}-bar)`" stroke-width="1.5" />
      <line x1="36" y1="127" x2="284" y2="127" :stroke="`url(#${uid}-bar)`" stroke-width="1.3" />
      <line x1="48" y1="134" x2="272" y2="134" :stroke="`url(#${uid}-bar)`" stroke-width="1.1" />
      <circle cx="160" cy="70" r="46" :fill="`url(#${uid}-sphere)`" />
    </svg>

    <svg v-else-if="shape === 'torus'" viewBox="0 0 320 156" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient :id="`${uid}-body`" cx="68%" cy="32%" r="68%">
          <stop offset="0%" stop-color="#9eb9d6" />
          <stop offset="28%" stop-color="#7e99b5" />
          <stop offset="56%" stop-color="#284a6d" />
          <stop offset="80%" stop-color="#193c5e" />
          <stop offset="100%" stop-color="#021d3c" />
        </radialGradient>
        <linearGradient :id="`${uid}-inner`" x1="15%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stop-color="#021d3c" />
          <stop offset="55%" stop-color="#284a6d" />
          <stop offset="100%" stop-color="#9eb9d6" stop-opacity="0.75" />
        </linearGradient>
        <linearGradient :id="`${uid}-floor`" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#345f87" stop-opacity="0" />
          <stop offset="50%" stop-color="#345f87" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#345f87" stop-opacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="122" rx="54" ry="8" fill="#010a27" opacity="0.52" />
      <line x1="36" y1="125" x2="284" y2="125" :stroke="`url(#${uid}-floor)`" stroke-width="1.2" />
      <g transform="rotate(-18 160 74)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M160 27 C204 27 232 48 232 74 C232 100 204 121 160 121 C116 121 88 100 88 74 C88 48 116 27 160 27 Z M160 52 C136 52 120 61 120 74 C120 87 136 96 160 96 C184 96 200 87 200 74 C200 61 184 52 160 52 Z"
          :fill="`url(#${uid}-body)`"
        />
        <path
          d="M116 74 C116 58 135 48 160 48 C185 48 204 58 204 74"
          :stroke="`url(#${uid}-inner)`"
          stroke-width="5.5"
          stroke-linecap="round"
          fill="none"
          opacity="0.68"
        />
        <path
          d="M102 91 C118 109 144 116 174 114"
          stroke="#021d3c"
          stroke-width="8"
          stroke-linecap="round"
          fill="none"
          opacity="0.55"
        />
        <path
          d="M188 41 C208 48 220 60 221 75"
          stroke="#9eb9d6"
          stroke-width="4"
          stroke-linecap="round"
          fill="none"
          opacity="0.48"
        />
      </g>
    </svg>

    <svg v-else viewBox="0 0 320 156" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient :id="`${uid}-face`" x1="15%" y1="80%" x2="88%" y2="18%">
          <stop offset="0%" stop-color="#0f3254" />
          <stop offset="35%" stop-color="#204467" />
          <stop offset="72%" stop-color="#31547a" />
          <stop offset="100%" stop-color="#7e99b5" />
        </linearGradient>
        <linearGradient :id="`${uid}-edge`" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#021d3c" />
          <stop offset="100%" stop-color="#113153" />
        </linearGradient>
      </defs>
      <g stroke="#21486c" stroke-width="1.25" opacity="0.82" fill="none">
        <path d="M16 118 Q88 106 160 118 T304 118" />
        <path d="M16 125 Q88 113 160 125 T304 125" />
        <path d="M16 132 Q88 120 160 132 T304 132" />
        <path d="M16 139 Q88 127 160 139 T304 139" />
      </g>
      <ellipse cx="152" cy="112" rx="52" ry="8" fill="#010a27" opacity="0.56" />
      <path
        d="M98 99 C136 96 164 78 182 54 L167 45 C163 42 165 36 170 36 L214 33 C219 33 223 37 222 42 L216 84 C215 89 209 90 205 86 L195 75 C172 103 136 112 96 105 C92 104 93 99 98 99 Z"
        :fill="`url(#${uid}-edge)`"
        transform="translate(-5, 6)"
      />
      <path
        d="M98 99 C136 96 164 78 182 54 L167 45 C163 42 165 36 170 36 L214 33 C219 33 223 37 222 42 L216 84 C215 89 209 90 205 86 L195 75 C172 103 136 112 96 105 C92 104 93 99 98 99 Z"
        :fill="`url(#${uid}-face)`"
      />
      <path
        d="M170 37 L214 34 C218 34 221 37 220 42 L215 80"
        stroke="#b4d0e9"
        stroke-width="2"
        stroke-linecap="round"
        opacity="0.65"
      />
    </svg>
  </div>
</template>
