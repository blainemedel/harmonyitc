import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * =============================================================================
 * Futuristic Hero Section & Robotic Glassmorphic Composition
 * =============================================================================
 * Replicates the exact layout, visual structure, and aesthetic of the reference
 * graphic composition using React, Tailwind CSS, and Framer Motion.
 *
 * CRITICAL TEXT SPECIFICATIONS ENFORCED:
 * - Line 1: 'TOGETHER' (Light Blue, Bold, All Caps)
 * - Line 2: 'WE BUILD' (Dark Navy, Bold, All Caps)
 * - Line 3: 'THE FUTURE' (Light Blue, Bold, All Caps)
 * - Line 4: 'YOU GROW' (Dark Gray/Navy, Thin/Regular, All Caps, Extra Tracking)
 * - Line 5: 'WE LEAD' (Light Blue, Thin/Regular, All Caps, Extra Tracking)
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// Animation Variants
// -----------------------------------------------------------------------------

// Panel Entrance: floats upward smoothly (y: [40, 0], opacity: [0, 1])
export const panelEntranceVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier
      when: 'beforeChildren',
      staggerChildren: 0.11,
      delayChildren: 0.2,
    },
  },
};

// Continuous Ambient Floating Animation: y: [-4, 4]
export const panelFloatVariants = {
  animate: {
    y: [-4, 4],
    transition: {
      duration: 3.4,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

// Typography Line Stagger with subtle slide-in & tracking transition
export const textLineVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    letterSpacing: '0.08em',
  },
  visible: (customTracking) => ({
    opacity: 1,
    y: 0,
    letterSpacing: customTracking || '-0.015em',
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// -----------------------------------------------------------------------------
// Color Tokens & Constants
// -----------------------------------------------------------------------------
export const THEME = {
  colors: {
    // Primary Vibrant Light Cyan / Sky Blue
    cyan: '#82c9dc',
    cyanBright: '#8de1f3',
    cyanGlow: 'rgba(138, 225, 242, 0.45)',
    // Deep Contrast Dark Navy
    navy: '#0c2637',
    navyDark: '#081a26',
    // Muted Dark Slate / Grey for thin sub-lines
    slate: '#364c5d',
    slateMuted: '#4a6274',
    // Glass surface tokens
    glassBg: 'rgba(255, 255, 255, 0.12)',
    glassBorder: 'rgba(255, 255, 255, 0.65)',
    glassShadow: '0 16px 40px -8px rgba(10, 36, 51, 0.12)',
  },
};

/**
 * =============================================================================
 * Sub-Component: GlassPanelOverlay
 * =============================================================================
 * The vertical frosted glass card with sharp/minimally rounded corners,
 * subtle white border outline, faint neon cyan corner ticks, dynamic cursor sheen,
 * and the exact 5 lines of strictly styled typography.
 */
export function GlassPanelOverlay({
  variantMode = 'standard', // 'standard' (strict prompt) or 'dual' (micro-detail from reference photo)
  fontFamily = 'interTight', // 'interTight' | 'oswald' | 'compact'
  enableFloat = true,
  enableSheen = true,
  enableTilt = true,
  className = '',
  style = {},
}) {
  const cardRef = useRef(null);

  // Mouse position state for dynamic CSS gradient sheen layer & 3D tilt
  const [sheenCoords, setSheenCoords] = useState({ x: 50, y: 50, active: false });

  // Spring physics for smooth tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 180 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setSheenCoords({ x: xPct, y: yPct, active: true });

    if (enableTilt) {
      mouseX.set((x / rect.width) - 0.5);
      mouseY.set((y / rect.height) - 0.5);
    }
  };

  const handleMouseLeave = () => {
    setSheenCoords((prev) => ({ ...prev, active: false }));
    mouseX.set(0);
    mouseY.set(0);
  };

  // Font family selector class
  const fontClass =
    fontFamily === 'oswald'
      ? 'font-["Oswald",sans-serif]'
      : fontFamily === 'compact'
      ? 'font-["Impact","Inter_Tight",sans-serif]'
      : 'font-["Inter_Tight",sans-serif]';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      variants={panelEntranceVariants}
      initial="hidden"
      animate="visible"
      className={`relative select-none overflow-hidden rounded-[6px] border border-white/70 
        backdrop-blur-[10px] bg-white/[0.08] 
        shadow-[0_14px_45px_-6px_rgba(8,30,46,0.14),inset_0_1.5px_1px_0_rgba(255,255,255,0.85)] 
        transition-shadow duration-300 hover:shadow-[0_20px_55px_-4px_rgba(8,30,46,0.2),inset_0_2px_1.5px_0_rgba(255,255,255,0.95)] 
        ${className}`}
    >
      {/* -----------------------------------------------------------------------
          CONTINUOUS AMBIENT FLOATING WRAPPER
          animate={{ y: [-4, 4] }} with infinite ease-in-out transition
      ----------------------------------------------------------------------- */}
      <motion.div
        variants={enableFloat ? panelFloatVariants : {}}
        animate={enableFloat ? 'animate' : undefined}
        className="w-full h-full flex flex-col justify-between p-6 sm:p-7 relative z-10"
      >
        {/* =====================================================================
            TECH UI MARKERS / ACCENT TICKS ON FRAME CORNERS
            Matches reference graphic frame decorations
        ===================================================================== */}
        
        {/* Top-Left Corner Tick & Bracket */}
        <div className="absolute top-2.5 left-2.5 pointer-events-none flex items-start">
          <span className="w-4 h-[1.5px] bg-[#8de1f3] opacity-85" />
          <span className="w-[1.5px] h-3 bg-[#8de1f3] -ml-[1.5px] opacity-85" />
        </div>

        {/* Top Center Digital Indicator Dots (HUD status) */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 pointer-events-none flex items-center space-x-1.5 opacity-75">
          <span className="w-1 h-1 rounded-[1px] bg-[#8de1f3]" />
          <span className="w-1 h-1 rounded-[1px] bg-[#8de1f3]" />
          <span className="w-1 h-1 rounded-[1px] bg-[#8de1f3]" />
          <span className="w-1 h-1 rounded-[1px] bg-[#8de1f3]/50" />
        </div>

        {/* Top-Right Corner Tick & Bracket */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none flex items-start justify-end">
          <span className="w-4 h-[1.5px] bg-[#8de1f3] opacity-85" />
          <span className="w-[1.5px] h-3 bg-[#8de1f3] opacity-85" />
        </div>

        {/* Bottom-Left Cyan Tech Pill Badge (#8ae1f2) */}
        <div className="absolute bottom-3 left-3 pointer-events-none flex items-center">
          <div className="w-7 h-1.5 rounded-full bg-[#8ae1f2] shadow-[0_0_10px_#8ae1f2] opacity-90" />
        </div>

        {/* Bottom-Right Corner Tick */}
        <div className="absolute bottom-2.5 right-2.5 pointer-events-none flex items-end justify-end">
          <span className="w-3 h-[1.5px] bg-[#8de1f3] opacity-60" />
          <span className="w-[1.5px] h-2.5 bg-[#8de1f3] opacity-60" />
        </div>

        {/* =====================================================================
            TYPOGRAPHY CONTENT CONTAINER
            Strictly adhering to exact text strings, weights, and color breakdown
        ===================================================================== */}
        <div className={`w-full pt-4 sm:pt-6 flex flex-col justify-start ${fontClass}`}>
          
          {/* -------------------------------------------------------------------
              TOP BLOCK: Heavy, Compact, Bold Sans-Serif (Leading-none)
          ------------------------------------------------------------------- */}
          <div className="flex flex-col space-y-[2px] sm:space-y-1">
            
            {/* LINE 1 (Light Blue, Bold, All Caps): 'TOGETHER' */}
            <motion.div
              variants={textLineVariants}
              custom="-0.02em"
              className="overflow-hidden"
            >
              <h1 className="text-[32px] sm:text-[40px] md:text-[46px] font-black leading-[0.92] tracking-[-0.02em] text-[#82c9dc] uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                TOGETHER
              </h1>
            </motion.div>

            {/* LINE 2 (Dark Navy, Bold, All Caps): 'WE BUILD' */}
            <motion.div
              variants={textLineVariants}
              custom="-0.02em"
              className="overflow-hidden"
            >
              <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-black leading-[0.92] tracking-[-0.02em] text-[#0c2637] uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                WE BUILD
              </h2>
            </motion.div>

            {/* LINE 3 (Light Blue, Bold, All Caps): 'THE FUTURE' */}
            <motion.div
              variants={textLineVariants}
              custom="-0.02em"
              className="overflow-hidden"
            >
              {variantMode === 'dual' ? (
                // Dual Accent Mode (matching micro photographic detail where 'THE' is Navy and 'FUTURE' is Cyan)
                <h3 className="text-[32px] sm:text-[40px] md:text-[46px] font-black leading-[0.92] tracking-[-0.02em] uppercase">
                  <span className="text-[#0c2637]">THE </span>
                  <span className="text-[#82c9dc]">FUTURE</span>
                </h3>
              ) : (
                // Standard Strict Mode: Exactly Light Blue as requested
                <h3 className="text-[32px] sm:text-[40px] md:text-[46px] font-black leading-[0.92] tracking-[-0.02em] text-[#82c9dc] uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                  THE FUTURE
                </h3>
              )}
            </motion.div>
          </div>

          {/* -------------------------------------------------------------------
              BOTTOM BLOCK: Thin/Regular, All Caps, Extra Letter Spacing
              Significant contrast from the heavy top three lines
          ------------------------------------------------------------------- */}
          <div className="mt-8 sm:mt-11 flex flex-col space-y-1.5 sm:space-y-2">
            
            {/* LINE 4 (Dark Gray/Navy, Thin/Regular, All Caps): 'YOU GROW' */}
            <motion.div
              variants={textLineVariants}
              custom="0.28em"
              className="overflow-hidden"
            >
              {variantMode === 'dual' ? (
                <p className="text-[15px] sm:text-[18px] md:text-[20px] font-light tracking-[0.28em] uppercase">
                  <span className="text-[#364c5d]">YOU </span>
                  <span className="text-[#82c9dc]">GROW</span>
                </p>
              ) : (
                <p className="text-[15px] sm:text-[18px] md:text-[20px] font-light tracking-[0.28em] text-[#364c5d] uppercase">
                  YOU GROW
                </p>
              )}
            </motion.div>

            {/* LINE 5 (Light Blue, Thin/Regular, All Caps): 'WE LEAD' */}
            <motion.div
              variants={textLineVariants}
              custom="0.28em"
              className="overflow-hidden"
            >
              {variantMode === 'dual' ? (
                <p className="text-[15px] sm:text-[18px] md:text-[20px] font-light tracking-[0.28em] uppercase">
                  <span className="text-[#364c5d]">WE </span>
                  <span className="text-[#82c9dc]">LEAD</span>
                </p>
              ) : (
                <p className="text-[15px] sm:text-[18px] md:text-[20px] font-light tracking-[0.28em] text-[#82c9dc] uppercase">
                  WE LEAD
                </p>
              )}
            </motion.div>
          </div>

        </div>

        {/* Empty bottom spacer allowing hand geometry to shine through */}
        <div className="h-10 sm:h-16" />
      </motion.div>

      {/* =====================================================================
          FUTURISTIC MICRO-INTERACTION: DYNAMIC CSS GRADIENT SHEEN LAYER
          Sliding smoothly across the text box container as cursor moves
      ===================================================================== */}
      {enableSheen && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: sheenCoords.active ? 1 : 0.35,
            background: sheenCoords.active
              ? `radial-gradient(400px circle at ${sheenCoords.x}% ${sheenCoords.y}%, rgba(255,255,255,0.55) 0%, rgba(138,225,242,0.18) 35%, transparent 75%)`
              : 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(138,225,242,0.08) 100%)',
          }}
        />
      )}

      {/* Glass Top Bevel Reflection */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />
      {/* Glass Left Edge Specular Line */}
      <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/80 via-white/30 to-transparent pointer-events-none" />
    </motion.div>
  );
}

/**
 * =============================================================================
 * Main Component: RoboticGlassCard
 * =============================================================================
 * Combines the high-resolution metallic robotic hand graphic with the
 * pixel-aligned interactive floating glassmorphic typography panel.
 */
export function RoboticGlassCard({
  variantMode = 'standard',
  fontFamily = 'interTight',
  enableFloat = true,
  enableSheen = true,
  enableTilt = true,
  imageSrc = './assets/robotic-hand-clean-2x.png',
  className = '',
}) {
  return (
    <div className={`relative w-full max-w-[440px] aspect-[436/534] mx-auto select-none ${className}`}>
      
      {/* Ambient background glow beneath robotic hand */}
      <div className="absolute -inset-4 bg-gradient-to-br from-[#8ae1f2]/10 via-[#0c2637]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* -----------------------------------------------------------------------
          GRAPHIC / BACKGROUND ELEMENT
          Highly detailed, metallic, hyper-realistic silver robotic hand mesh
      ----------------------------------------------------------------------- */}
      <img
        src={imageSrc}
        alt="Hyper-realistic metallic silver robotic hand holding holographic glass panel"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_24px_48px_rgba(8,30,46,0.15)]"
        draggable={false}
      />

      {/* -----------------------------------------------------------------------
          TEXT / CARD OVERLAY: VERTICAL GLASSMORPHISM PANEL
          Positioned with exact geometric alignment matching the held glass slate
      ----------------------------------------------------------------------- */}
      <div
        className="absolute"
        style={{
          left: '21.5%',
          top: '4.8%',
          width: '52%',
          height: '71.6%',
        }}
      >
        <GlassPanelOverlay
          variantMode={variantMode}
          fontFamily={fontFamily}
          enableFloat={enableFloat}
          enableSheen={enableSheen}
          enableTilt={enableTilt}
          className="w-full h-full"
        />
      </div>

    </div>
  );
}

/**
 * =============================================================================
 * Full Section Component: FuturisticHero
 * =============================================================================
 * Complete, responsive premium hero section featuring executive copy,
 * interactive CTA controls, status telemetries, and the robotic glass composition.
 */
export default function FuturisticHero() {
  const [variantMode, setVariantMode] = useState('standard'); // 'standard' | 'dual'
  const [fontFamily, setFontFamily] = useState('interTight'); // 'interTight' | 'oswald'
  const [enableFloat, setEnableFloat] = useState(true);
  const [enableSheen, setEnableSheen] = useState(true);
  const [viewMode, setViewMode] = useState('hero'); // 'hero' | 'focus'

  return (
    <section className="relative min-h-screen w-full bg-[#f8fafc] text-[#0c2637] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden flex flex-col justify-between selection:bg-[#8de1f3]/30">
      
      {/* -----------------------------------------------------------------------
          BACKGROUND CANVAS: Clean, Minimalist White / Light Grey Studio Vignette
      ----------------------------------------------------------------------- */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,#ffffff_30%,#f0f4f8_80%,#e6ecf2_100%)] pointer-events-none" />
      
      {/* Subtle Micro-Grid Cybernetic Grid */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#0c2637 1px, transparent 1px), linear-gradient(90deg, #0c2637 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Atmospheric Cyan Ambient Glow Accents */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#8de1f3]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#0c2637]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* -----------------------------------------------------------------------
          HEADER / TOP NAVIGATION BAR
      ----------------------------------------------------------------------- */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0c2637] to-[#1e4863] flex items-center justify-center shadow-[0_4px_14px_rgba(12,38,55,0.2)] border border-white/40 group-hover:scale-105 transition-transform">
            <span className="text-[#8de1f3] font-black text-lg tracking-wider">H</span>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#0c2637] block leading-tight">
              HARMONY<span className="text-[#82c9dc]">ITC</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#536d7f] font-semibold">
              SYNTHETIC SYSTEMS
            </span>
          </div>
        </div>

        {/* Center Nav Badges */}
        <nav className="hidden md:flex items-center space-x-1 p-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => setViewMode('hero')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'hero'
                ? 'bg-[#0c2637] text-white shadow-sm'
                : 'text-[#486377] hover:text-[#0c2637]'
            }`}
          >
            Full Hero Section
          </button>
          <button
            onClick={() => setViewMode('focus')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'focus'
                ? 'bg-[#0c2637] text-white shadow-sm'
                : 'text-[#486377] hover:text-[#0c2637]'
            }`}
          >
            Focused Composition
          </button>
        </nav>

        {/* CTA Launch Button */}
        <div className="flex items-center space-x-3">
          <a
            href="#explore"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#0c2637] bg-white/80 hover:bg-white border border-[#0c2637]/10 shadow-sm transition-all"
          >
            Specifications
          </a>
          <button className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#0c2637] hover:bg-[#13374f] shadow-[0_4px_16px_rgba(12,38,55,0.25)] border border-[#8de1f3]/30 transition-all flex items-center space-x-2">
            <span>Explore Stack</span>
            <span className="text-[#8de1f3]">→</span>
          </button>
        </div>
      </header>

      {/* -----------------------------------------------------------------------
          MAIN HERO CONTENT
      ----------------------------------------------------------------------- */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 md:py-12 flex-1 flex flex-col justify-center">
        
        {viewMode === 'hero' ? (
          /* ===================================================================
             MODE 1: SPLIT HERO SECTION LAYOUT
             Left: High-Impact Typography, Narrative & Metrics
             Right: Robotic Hand Glassmorphism Composition
          =================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: HERO NARRATIVE & TELEMETRY */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              
              {/* Top Innovation Pill */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#8de1f3]/50 shadow-[0_2px_12px_rgba(141,225,243,0.15)] self-start">
                <span className="w-2 h-2 rounded-full bg-[#8de1f3] animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0c2637]">
                  CYBERNETIC CO-PILOT 4.0
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#0c2637] tracking-tight leading-[1.05]">
                  Pioneering The Symbiosis Of Human Vision &{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0c2637] via-[#2f6688] to-[#82c9dc]">
                    Synthetic Precision.
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-[#4a6477] font-normal leading-relaxed pt-2 max-w-xl">
                  Empowering forward-thinking enterprises with hyper-fluid autonomous agent orchestration,
                  tactile glass UI physics, and uncompromising computational precision.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button className="px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-[#0c2637] hover:bg-[#143a53] shadow-[0_8px_24px_rgba(12,38,55,0.22)] border border-[#8de1f3]/40 flex items-center space-x-3 transition-transform hover:-translate-y-0.5">
                  <span>Deploy Neural Node</span>
                  <span className="text-[#8de1f3]">↗</span>
                </button>
                <button className="px-6 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-[#0c2637] bg-white/70 hover:bg-white border border-[#0c2637]/15 shadow-sm transition-all">
                  Documentation
                </button>
              </div>

              {/* Key Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#0c2637]/10 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0c2637] font-['Inter_Tight',sans-serif]">
                    99.98<span className="text-[#82c9dc]">%</span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#577285] uppercase tracking-wider mt-0.5">
                    Neural Uptime
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0c2637] font-['Inter_Tight',sans-serif]">
                    &lt;12<span className="text-[#82c9dc]">ms</span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#577285] uppercase tracking-wider mt-0.5">
                    Frame Latency
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0c2637] font-['Inter_Tight',sans-serif]">
                    10<span className="text-[#82c9dc]">x</span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#577285] uppercase tracking-wider mt-0.5">
                    Scale Factor
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: ROBOTIC HAND & GLASS COMPOSITION */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <RoboticGlassCard
                variantMode={variantMode}
                fontFamily={fontFamily}
                enableFloat={enableFloat}
                enableSheen={enableSheen}
                enableTilt={true}
              />
            </div>

          </div>
        ) : (
          /* ===================================================================
             MODE 2: FOCUSED 1:1 COMPOSITION STUDY
             Clean, maximized showcase of the reference composition
          =================================================================== */
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-4 text-center">
              <span className="text-xs font-bold tracking-[0.25em] text-[#82c9dc] uppercase">
                Composition Fidelity Study
              </span>
              <h2 className="text-2xl font-black text-[#0c2637] tracking-tight">
                Robotic Cybernetic Arm & Holographic Glass Panel
              </h2>
            </div>
            
            <RoboticGlassCard
              variantMode={variantMode}
              fontFamily={fontFamily}
              enableFloat={enableFloat}
              enableSheen={enableSheen}
              enableTilt={true}
              className="max-w-[480px]"
            />
          </div>
        )}

      </main>

      {/* -----------------------------------------------------------------------
          BOTTOM DOCK: INTERACTIVE PARAMETER CONTROLLER
          Allows instantaneous toggling of motion, micro-interactions & variants
      ----------------------------------------------------------------------- */}
      <footer className="relative z-20 w-full max-w-4xl mx-auto px-6 pb-6 pt-2">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-wrap items-center justify-between gap-4">
          
          {/* Variant Color Scheme Mode */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#526c7e]">
              Scheme:
            </span>
            <div className="flex bg-[#edf3f8] p-0.5 rounded-lg">
              <button
                onClick={() => setVariantMode('standard')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  variantMode === 'standard'
                    ? 'bg-white text-[#0c2637] shadow-xs'
                    : 'text-[#627d91] hover:text-[#0c2637]'
                }`}
              >
                Strict Prompt
              </button>
              <button
                onClick={() => setVariantMode('dual')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  variantMode === 'dual'
                    ? 'bg-white text-[#0c2637] shadow-xs'
                    : 'text-[#627d91] hover:text-[#0c2637]'
                }`}
              >
                Dual Accent
              </button>
            </div>
          </div>

          {/* Typography Family Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#526c7e]">
              Font:
            </span>
            <div className="flex bg-[#edf3f8] p-0.5 rounded-lg">
              <button
                onClick={() => setFontFamily('interTight')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  fontFamily === 'interTight'
                    ? 'bg-white text-[#0c2637] shadow-xs'
                    : 'text-[#627d91] hover:text-[#0c2637]'
                }`}
              >
                Inter Tight
              </button>
              <button
                onClick={() => setFontFamily('oswald')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  fontFamily === 'oswald'
                    ? 'bg-white text-[#0c2637] shadow-xs'
                    : 'text-[#627d91] hover:text-[#0c2637]'
                }`}
              >
                Oswald
              </button>
            </div>
          </div>

          {/* Micro-Interactions Toggles */}
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-semibold text-[#0c2637]">
              <input
                type="checkbox"
                checked={enableFloat}
                onChange={(e) => setEnableFloat(e.target.checked)}
                className="rounded text-[#0c2637] focus:ring-[#8de1f3]"
              />
              <span>Ambient Float</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-semibold text-[#0c2637]">
              <input
                type="checkbox"
                checked={enableSheen}
                onChange={(e) => setEnableSheen(e.target.checked)}
                className="rounded text-[#0c2637] focus:ring-[#8de1f3]"
              />
              <span>Dynamic Sheen</span>
            </label>
          </div>

        </div>
      </footer>

    </section>
  );
}
