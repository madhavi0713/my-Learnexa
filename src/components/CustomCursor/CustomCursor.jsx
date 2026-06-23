import { useEffect, useRef } from "react";
import "./CustomCursor.css";

// ─── Constants ────────────────────────────────────────────────────────────────
const COLORS = {
  cyan:   "#00E5FF",
  purple: "#A855F7",
};

const TRAIL_LENGTH     = 28;   // max trail segments
const PARTICLE_LIMIT   = 60;   // max live particles
const EASING           = 0.14; // cursor lag factor (lower = more lag)
const TRAIL_EASING     = 0.08; // trail head lag

// ─── Helpers ──────────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

const cyan   = hexToRgb(COLORS.cyan);
const purple = hexToRgb(COLORS.purple);

/** Blend cyan→purple by t ∈ [0,1] */
const blendColor = (t, a = 0) => {
  const r = Math.round(lerp(cyan.r, purple.r, t));
  const g = Math.round(lerp(cyan.g, purple.g, t));
  const b = Math.round(lerp(cyan.b, purple.b, t));
  return `rgba(${r},${g},${b},${a})`;
};

// Draw the classic arrow-pointer silhouette (stroked + filled with neon glow)
const drawArrowCursor = (ctx, x, y, scale, glowStrength, isHovering) => {
  // Arrow path (local coords, tip at 0,0)
  const arrow = [
    [0, 0],
    [0, 20],
    [4.5, 15.5],
    [8.5, 23],
    [11, 21.5],
    [7, 14],
    [13, 14],
  ];

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const baseGlow = isHovering ? glowStrength * 1.6 : glowStrength;

  // ── Outer soft bloom ─────────────────────────────────────────────────────
  ctx.shadowColor  = blendColor(0.5, 1);
  ctx.shadowBlur   = baseGlow * 22;
  ctx.strokeStyle  = blendColor(0.5, 0.18);
  ctx.lineWidth    = 6;
  ctx.lineJoin     = "round";

  ctx.beginPath();
  arrow.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
  ctx.closePath();
  ctx.stroke();

  // ── Mid glow layer ───────────────────────────────────────────────────────
  ctx.shadowBlur   = baseGlow * 12;
  ctx.shadowColor  = blendColor(0.3, 1);
  ctx.strokeStyle  = blendColor(0.3, 0.4);
  ctx.lineWidth    = 2.5;

  ctx.beginPath();
  arrow.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
  ctx.closePath();
  ctx.stroke();

  // ── Filled core gradient ─────────────────────────────────────────────────
  const grad = ctx.createLinearGradient(0, 0, 0, 23);
  grad.addColorStop(0,   blendColor(0,   1));
  grad.addColorStop(0.5, blendColor(0.45, 0.95));
  grad.addColorStop(1,   blendColor(1,   0.85));

  ctx.shadowBlur   = baseGlow * 8;
  ctx.shadowColor  = blendColor(0.5, 0.9);
  ctx.fillStyle    = grad;
  ctx.lineWidth    = 1;
  ctx.strokeStyle  = blendColor(0, 0.6);

  ctx.beginPath();
  arrow.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // ── Bright tip dot ───────────────────────────────────────────────────────
  ctx.shadowBlur   = baseGlow * 16;
  ctx.shadowColor  = COLORS.cyan;
  ctx.fillStyle    = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, isHovering ? 2.2 : 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

// Draw one trail segment
const drawTrailSegment = (ctx, seg, alpha, velocity) => {
  const size   = Math.max(0.01, 3 + velocity * 3) * Math.max(0, alpha);
  if (size <= 0) return;
  const t      = seg.colorT;
  const blur   = (6 + velocity * 14) * Math.max(0, alpha);

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.9));
  ctx.shadowBlur  = blur;
  ctx.shadowColor = blendColor(t, 1);
  ctx.fillStyle   = blendColor(t, 1);
  ctx.beginPath();
  ctx.arc(seg.x, seg.y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// Spawn a particle
const spawnParticle = (x, y, velocity) => {
  const speed = 0.8 + Math.random() * 2.5 + velocity * 1.5;
  const angle = Math.random() * Math.PI * 2;
  return {
    x,
    y,
    vx:      Math.cos(angle) * speed,
    vy:      Math.sin(angle) * speed,
    life:    1,
    decay:   0.025 + Math.random() * 0.04,
    size:    0.8 + Math.random() * 2.2,
    colorT:  Math.random(),
  };
};

const drawParticle = (ctx, p) => {
  const life  = Math.max(0, p.life);           // clamp — never let life go negative
  const alpha = life * life;                   // quadratic fade
  const r     = Math.max(0.01, p.size * life); // guard: radius must be > 0
  if (alpha < 0.001) return;                   // skip invisible particles
  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha * 0.85);
  ctx.shadowBlur  = 8 * life;
  ctx.shadowColor = blendColor(p.colorT, 1);
  ctx.fillStyle   = blendColor(p.colorT, 1);
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// ─── Component ────────────────────────────────────────────────────────────────
const CustomCursor = () => {
  const canvasRef     = useRef(null);
  const stateRef      = useRef({
    // raw mouse
    mouseX: -200, mouseY: -200,
    // smoothed cursor
    cursorX: -200, cursorY: -200,
    // smoothed trail head (lags more)
    trailX: -200, trailY: -200,
    prevX: -200, prevY: -200,
    velocity: 0,
    trail: [],
    particles: [],
    isHovering: false,
    visible: false,
    raf: null,
    particleTimer: 0,
    hoverPulse: 0,
  });

  useEffect(() => {
    // Touch / pointer check
    if (window.matchMedia("(pointer: coarse)").matches) return;
    // Reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const state = stateRef.current;

    // ── Mouse listeners ────────────────────────────────────────────────────
    const onMove = (e) => {
      state.mouseX   = e.clientX;
      state.mouseY   = e.clientY;
      state.visible  = true;
    };

    const onOver = (e) => {
      const tags = ["button", "a", "input", "textarea", "select", "label"];
      const el   = e.target;
      state.isHovering =
        tags.some((t) => el.tagName.toLowerCase() === t || el.closest(t)) ||
        el.classList.contains("interactive") ||
        el.closest("[data-interactive]") !== null ||
        el.closest(".hierarchy-item-card") !== null ||
        el.closest(".course-card") !== null ||
        el.closest(".user-card") !== null ||
        el.closest(".nav-link") !== null;
    };

    const onLeave  = () => { state.visible = false; };
    const onEnter  = () => { state.visible = true; };

    document.addEventListener("mousemove",  onMove,  { passive: true });
    document.addEventListener("mouseover",  onOver,  { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    // ── Animation loop ─────────────────────────────────────────────────────
    const ctx = canvas.getContext("2d");

    const tick = () => {
      const s = stateRef.current;
      s.raf = requestAnimationFrame(tick);

      const W = canvas.width;
      const H = canvas.height;

      // Clear
      ctx.clearRect(0, 0, W, H);

      if (!s.visible) return;

      // Smooth cursor position
      s.cursorX = lerp(s.cursorX, s.mouseX, EASING);
      s.cursorY = lerp(s.cursorY, s.mouseY, EASING);

      // Smoother trail head (extra lag for visual depth)
      s.trailX = lerp(s.trailX, s.mouseX, TRAIL_EASING);
      s.trailY = lerp(s.trailY, s.mouseY, TRAIL_EASING);

      // Velocity
      const dx  = s.cursorX - s.prevX;
      const dy  = s.cursorY - s.prevY;
      const spd = Math.sqrt(dx * dx + dy * dy);
      s.velocity = lerp(s.velocity, Math.min(spd / 20, 1), 0.15);
      s.prevX    = s.cursorX;
      s.prevY    = s.cursorY;

      if (!prefersReduced) {
        // ── Trail ────────────────────────────────────────────────────────────
        const trailSegLen = TRAIL_LENGTH + Math.round(s.velocity * 14);
        s.trail.unshift({
          x: s.trailX,
          y: s.trailY,
          colorT: 0.3 + s.velocity * 0.7,
        });
        if (s.trail.length > trailSegLen) s.trail.length = trailSegLen;

        s.trail.forEach((seg, i) => {
          const alpha = (1 - i / s.trail.length) * 0.55 * (0.5 + s.velocity * 0.5);
          drawTrailSegment(ctx, seg, alpha, s.velocity);
        });

        // ── Particles ────────────────────────────────────────────────────────
        s.particleTimer += s.velocity;
        const spawnThresh = s.isHovering ? 0.4 : 0.7;
        if (s.particleTimer > spawnThresh && s.particles.length < PARTICLE_LIMIT) {
          s.particleTimer = 0;
          const count = s.isHovering
            ? 2 + Math.round(s.velocity * 2)
            : 1 + Math.round(s.velocity * 1.5);
          for (let i = 0; i < count; i++) {
            s.particles.push(spawnParticle(s.cursorX, s.cursorY, s.velocity));
          }
        }

        // Update + draw particles
        s.particles = s.particles.filter((p) => p.life > 0.02);
        s.particles.forEach((p) => {
          p.x    += p.vx;
          p.y    += p.vy;
          p.vx   *= 0.95;
          p.vy   *= 0.95;
          p.life -= p.decay;
          drawParticle(ctx, p);
        });
      }

      // ── Hover pulse ring ──────────────────────────────────────────────────
      if (s.isHovering) {
        s.hoverPulse += 0.07;
        const pulseR = 28 + Math.sin(s.hoverPulse) * 6;
        const pulseA = 0.35 + Math.sin(s.hoverPulse) * 0.15;

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.cursorX, s.cursorY, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = blendColor(0.5, pulseA);
        ctx.lineWidth   = 1.2;
        ctx.shadowBlur  = 12;
        ctx.shadowColor = blendColor(0.5, 0.8);
        ctx.stroke();
        ctx.restore();

        // Second ring, slightly larger, opposite phase
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.cursorX, s.cursorY, pulseR + 10 + Math.sin(s.hoverPulse + Math.PI) * 4, 0, Math.PI * 2);
        ctx.strokeStyle = blendColor(0.2, pulseA * 0.4);
        ctx.lineWidth   = 0.6;
        ctx.shadowBlur  = 6;
        ctx.shadowColor = blendColor(0.2, 0.5);
        ctx.stroke();
        ctx.restore();
      } else {
        s.hoverPulse = 0;
      }

      // ── Arrow cursor ─────────────────────────────────────────────────────
      const cursorScale = s.isHovering
        ? 1 + 0.12 * s.velocity + 0.08
        : 1 + 0.06 * s.velocity;
      const glowStrength = 0.6 + s.velocity * 0.8;

      drawArrowCursor(ctx, s.cursorX, s.cursorY, cursorScale, glowStrength, s.isHovering);
    };

    state.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.raf);
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="neon-cursor-canvas"
      aria-hidden="true"
    />
  );
};

export default CustomCursor;
