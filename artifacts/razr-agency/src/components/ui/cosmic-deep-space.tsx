import React, { useEffect, useRef } from "react";

export interface CosmicDeepSpaceProps {
  className?: string;
  style?: React.CSSProperties;
  /** Primary nebula glow color (hex) e.g. #00FFCC */
  primaryColor?: string;
  /** Secondary nebula accent color (hex) e.g. #8B5CF6 */
  secondaryColor?: string;
  /** Deep background tint e.g. #030712 */
  backgroundColor?: string;
  /** Number of 3D stars (default 2500) */
  starCount?: number;
  /** Nebula cloud opacity/brightness (0 to 1) */
  nebulaOpacity?: number;
  /** Enable dynamic shooting comets */
  enableShootingStars?: boolean;
  /** Enable glowing constellation network linkages */
  enableConstellations?: boolean;
  /** Enable celestial tech coordinates & holographic gyro rings */
  enableCyberRings?: boolean;
  /** Mouse parallax intensity */
  interactive?: boolean;
}

export function CosmicDeepSpace({
  className = "",
  style,
  primaryColor = "#00FFCC",
  secondaryColor = "#8B5CF6",
  backgroundColor = "#030712",
  starCount = 2800,
  nebulaOpacity = 0.85,
  enableShootingStars = true,
  enableConstellations = true,
  enableCyberRings = true,
  interactive = true,
}: CosmicDeepSpaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Helper hex to rgb
    const hexToRgb = (hex: string): [number, number, number] => {
      let clean = hex.replace("#", "");
      if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
      const num = parseInt(clean, 16);
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    };

    const pRgb = hexToRgb(primaryColor);
    const sRgb = hexToRgb(secondaryColor);

    // 3D Star Class
    interface Star3D {
      x: number;
      y: number;
      z: number;
      ox: number;
      oy: number;
      size: number;
      color: string;
      baseAlpha: number;
      twinkleSpeed: number;
      phase: number;
    }

    let stars: Star3D[] = [];
    const MAX_DEPTH = 1800;

    const initStars = () => {
      stars = [];
      const palettes = [
        "rgba(255, 255, 255,",
        `rgba(${pRgb[0]}, ${pRgb[1]}, ${pRgb[2]},`,
        `rgba(${sRgb[0]}, ${sRgb[1]}, ${sRgb[2]},`,
        "rgba(199, 210, 254,",
        "rgba(147, 197, 253,",
      ];

      for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 3200;
        const y = (Math.random() - 0.5) * 3200;
        const z = Math.random() * MAX_DEPTH + 1;
        const palette = palettes[Math.floor(Math.random() * palettes.length)];
        stars.push({
          x,
          y,
          z,
          ox: x,
          oy: y,
          size: Math.random() * 1.8 + 0.5,
          color: palette,
          baseAlpha: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.04 + 0.01,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Shooting Meteors / Comets
    interface Meteor {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      alpha: number;
      maxAlpha: number;
      decay: number;
      width: number;
      color: string;
    }

    const meteors: Meteor[] = [];

    const spawnMeteor = () => {
      if (!enableShootingStars) return;
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // ~45 deg down-right
      const startX = Math.random() * (width * 1.2) - (width * 0.2);
      const startY = Math.random() * (height * 0.4);
      const isPrimary = Math.random() > 0.4;
      const rgb = isPrimary ? pRgb : sRgb;

      meteors.push({
        x: startX,
        y: startY,
        len: Math.random() * 120 + 80,
        speed: Math.random() * 14 + 10,
        angle,
        alpha: 1,
        maxAlpha: Math.random() * 0.6 + 0.4,
        decay: Math.random() * 0.015 + 0.01,
        width: Math.random() * 2 + 1,
        color: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}`,
      });
    };

    let meteorSpawnTimer = 0;

    // Responsive Canvas Resizing
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initStars();
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse Parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let time = 0;

    // Render Loop
    const render = () => {
      time += 0.016;

      // Smooth mouse easing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mx = mouseRef.current.x * 70;
      const my = mouseRef.current.y * 70;

      // 1. Clear & Deep Space Abyss Base
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // 2. Volumetric Deep Space Nebulas (Triple-Layer Ionized Gas Clouds)
      const cx = width * 0.5;
      const cy = height * 0.45;

      // Nebula Cloud 1: Primary Cyan/Emerald Core
      const n1x = cx + Math.sin(time * 0.3) * 60 - mx * 0.4;
      const n1y = cy + Math.cos(time * 0.2) * 50 - my * 0.4;
      const n1Radius = Math.max(width, height) * 0.65;
      const grad1 = ctx.createRadialGradient(n1x, n1y, 20, n1x, n1y, n1Radius);
      grad1.addColorStop(0, `rgba(${pRgb[0]}, ${pRgb[1]}, ${pRgb[2]}, ${0.22 * nebulaOpacity})`);
      grad1.addColorStop(0.35, `rgba(${pRgb[0]}, ${pRgb[1]}, ${pRgb[2]}, ${0.09 * nebulaOpacity})`);
      grad1.addColorStop(0.7, `rgba(${pRgb[0]}, ${pRgb[1]}, ${pRgb[2]}, ${0.02 * nebulaOpacity})`);
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Nebula Cloud 2: Secondary Violet/Indigo Filament
      const n2x = cx + Math.cos(time * 0.25) * 110 + mx * 0.5;
      const n2y = cy + Math.sin(time * 0.35) * 80 + my * 0.5;
      const n2Radius = Math.max(width, height) * 0.75;
      const grad2 = ctx.createRadialGradient(n2x, n2y, 10, n2x, n2y, n2Radius);
      grad2.addColorStop(0, `rgba(${sRgb[0]}, ${sRgb[1]}, ${sRgb[2]}, ${0.25 * nebulaOpacity})`);
      grad2.addColorStop(0.4, `rgba(${sRgb[0]}, ${sRgb[1]}, ${sRgb[2]}, ${0.08 * nebulaOpacity})`);
      grad2.addColorStop(0.8, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Nebula Cloud 3: Peripheral Deep Azure Aurora
      const grad3 = ctx.createRadialGradient(width * 0.8, height * 0.2, 0, width * 0.8, height * 0.2, width * 0.5);
      grad3.addColorStop(0, `rgba(${pRgb[0]}, ${pRgb[1]}, ${pRgb[2]}, ${0.12 * nebulaOpacity})`);
      grad3.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // 3. Cyber Astrodynamic Rings & Coordinate Reticles (Tech Dimension)
      if (enableCyberRings) {
        ctx.save();
        ctx.translate(cx - mx * 0.2, cy - my * 0.2);

        // Slow rotating celestial ring
        ctx.rotate(time * 0.05);
        ctx.strokeStyle = `rgba(${pRgb[0]}, ${pRgb[1]}, ${pRgb[2]}, 0.06)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 16]);
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.35, width * 0.14, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();

        // Counter-rotating outer celestial ring
        ctx.rotate(-time * 0.08);
        ctx.strokeStyle = `rgba(${sRgb[0]}, ${sRgb[1]}, ${sRgb[2]}, 0.04)`;
        ctx.setLineDash([4, 24]);
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.45, width * 0.2, -Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
      }

      // 4. Render 3D Deep Space Stars with Warp Projection
      const fov = 450;
      const screenStars: { sx: number; sy: number; sz: number; color: string; alpha: number }[] = [];

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Slow forward drift in space
        s.z -= 0.6;
        if (s.z <= 1) {
          s.z = MAX_DEPTH;
          s.x = (Math.random() - 0.5) * 3200;
          s.y = (Math.random() - 0.5) * 3200;
        }

        // Perspective 3D -> 2D
        const k = fov / s.z;
        const sx = cx + (s.x - mx * (1.2 - s.z / MAX_DEPTH)) * k;
        const sy = cy + (s.y - my * (1.2 - s.z / MAX_DEPTH)) * k;

        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue;

        // Twinkle factor
        const twinkle = Math.sin(time * s.twinkleSpeed * 10 + s.phase) * 0.3 + 0.7;
        const depthAlpha = (1 - s.z / MAX_DEPTH);
        const finalAlpha = s.baseAlpha * twinkle * depthAlpha;
        const r = Math.max(0.4, s.size * k * 0.9);

        // Draw Star
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color} ${finalAlpha})`;
        ctx.fill();

        // Extra corona for large close stars
        if (r > 1.8) {
          ctx.beginPath();
          ctx.arc(sx, sy, r * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color} ${finalAlpha * 0.25})`;
          ctx.fill();
        }

        // Keep closer stars for constellation check
        if (enableConstellations && s.z < 650 && screenStars.length < 80) {
          screenStars.push({ sx, sy, sz: s.z, color: s.color, alpha: finalAlpha });
        }
      }

      // 5. Dynamic Constellation Nexus (Cyber linkages between close stars)
      if (enableConstellations && screenStars.length > 1) {
        ctx.lineWidth = 0.6;
        for (let a = 0; a < screenStars.length; a++) {
          for (let b = a + 1; b < screenStars.length; b++) {
            const p1 = screenStars[a];
            const p2 = screenStars[b];
            const dx = p1.sx - p2.sx;
            const dy = p1.sy - p2.sy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 95) {
              const linkAlpha = (1 - dist / 95) * Math.min(p1.alpha, p2.alpha) * 0.45;
              ctx.strokeStyle = `rgba(${pRgb[0]}, ${pRgb[1]}, ${pRgb[2]}, ${linkAlpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.sx, p1.sy);
              ctx.lineTo(p2.sx, p2.sy);
              ctx.stroke();
            }
          }
        }
      }

      // 6. Shooting Comets / Interstellar Meteors
      meteorSpawnTimer++;
      if (meteorSpawnTimer % 90 === 0 && Math.random() > 0.35) {
        spawnMeteor();
      }

      for (let m = meteors.length - 1; m >= 0; m--) {
        const met = meteors[m];
        met.x += Math.cos(met.angle) * met.speed;
        met.y += Math.sin(met.angle) * met.speed;
        met.alpha -= met.decay;

        if (met.alpha <= 0 || met.x > width + 200 || met.y > height + 200) {
          meteors.splice(m, 1);
          continue;
        }

        // Draw meteor trail
        const tailX = met.x - Math.cos(met.angle) * met.len;
        const tailY = met.y - Math.sin(met.angle) * met.len;

        const mGrad = ctx.createLinearGradient(tailX, tailY, met.x, met.y);
        mGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        mGrad.addColorStop(0.7, `${met.color}, ${met.alpha * 0.4})`);
        mGrad.addColorStop(1, `rgba(255, 255, 255, ${met.alpha})`);

        ctx.strokeStyle = mGrad;
        ctx.lineWidth = met.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(met.x, met.y);
        ctx.stroke();

        // Glowing Comet Head
        ctx.beginPath();
        ctx.arc(met.x, met.y, met.width * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${met.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    primaryColor,
    secondaryColor,
    backgroundColor,
    starCount,
    nebulaOpacity,
    enableShootingStars,
    enableConstellations,
    enableCyberRings,
    interactive,
  ]);

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full block pointer-events-none"
      />
      {/* Subtle cinematic tech grain overlay for photorealistic depth */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.7) 0, rgba(255,255,255,0.7) 1px, transparent 1px, transparent 40px)`,
        }}
      />
    </div>
  );
}

export default CosmicDeepSpace;
