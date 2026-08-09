export default function MeshBackground({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.07) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 25%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 25%, transparent 78%)",
        }}
      />
      {/* aurora mesh blobs */}
      <div
        className="absolute -top-40 -left-32 w-[560px] h-[560px] rounded-full opacity-40 blur-[130px]"
        style={{ background: "radial-gradient(circle at 30% 30%, rgba(5,150,105,0.50), rgba(20,184,166,0.22) 45%, transparent 70%)" }}
      />
      <div
        className="absolute top-8 -right-40 w-[500px] h-[500px] rounded-full opacity-35 blur-[130px]"
        style={{ background: "radial-gradient(circle at 70% 60%, rgba(13,148,136,0.42), rgba(16,185,129,0.18) 50%, transparent 72%)" }}
      />
      <div
        className="absolute -bottom-48 left-1/3 w-[640px] h-[460px] rounded-full opacity-25 blur-[150px]"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(5,150,105,0.35), transparent 70%)" }}
      />
      {/* film grain noise */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/></svg>\")",
        }}
      />
    </div>
  );
}
