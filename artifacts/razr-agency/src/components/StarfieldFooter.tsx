import { useEffect, useRef } from "react";

export default function StarfieldFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stars: { x: number; y: number; r: number; vx: number; vy: number; a: number; ta: number }[] = [];
    let shooting: { x: number; y: number; len: number; vx: number; vy: number; life: number; max: number } | null = null;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const count = Math.floor((rect.width * rect.height) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: Math.random() * 1.3 + 0.3,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        a: Math.random() * 0.6 + 0.2,
        ta: Math.random() * 0.8 + 0.2,
      }));
    };

    const spawnShooting = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      shooting = {
        x: Math.random() * w * 0.4,
        y: Math.random() * h * 0.4,
        len: 60 + Math.random() * 40,
        vx: 4 + Math.random() * 2,
        vy: 1.5 + Math.random() * 1,
        life: 0,
        max: 80,
      };
    };

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      // subtle gradient beams
      const grad = ctx.createRadialGradient(w * 0.2, h * 0.5, 0, w * 0.2, h * 0.5, w * 0.6);
      grad.addColorStop(0, "rgba(5, 150, 105, 0.06)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const grad2 = ctx.createRadialGradient(w * 0.85, h * 0.3, 0, w * 0.85, h * 0.3, w * 0.5);
      grad2.addColorStop(0, "rgba(20, 184, 166, 0.05)");
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

      // stars
      stars.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;
        s.a += (s.ta - s.a) * 0.02;
        if (Math.random() < 0.005) s.ta = Math.random() * 0.8 + 0.2;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 23, 42, ${s.a * 0.5})`;
        ctx.fill();
      });

      // shooting star
      if (shooting) {
        shooting.life++;
        shooting.x += shooting.vx;
        shooting.y += shooting.vy;
        const alpha = Math.sin((shooting.life / shooting.max) * Math.PI);
        const tailX = shooting.x - (shooting.vx / Math.hypot(shooting.vx, shooting.vy)) * shooting.len;
        const tailY = shooting.y - (shooting.vy / Math.hypot(shooting.vx, shooting.vy)) * shooting.len;
        const lg = ctx.createLinearGradient(shooting.x, shooting.y, tailX, tailY);
        lg.addColorStop(0, `rgba(5,150,105,${alpha})`);
        lg.addColorStop(1, "rgba(5,150,105,0)");
        ctx.strokeStyle = lg;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shooting.x, shooting.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        if (shooting.life > shooting.max) shooting = null;
      } else if (Math.random() < 0.004) {
        spawnShooting();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
