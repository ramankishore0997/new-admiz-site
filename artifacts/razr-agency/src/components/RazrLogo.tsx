import { motion } from "framer-motion";

type Variant = "primary" | "horizontal" | "icon" | "dark" | "light" | "mono";

interface Props {
  variant?: Variant;
  size?: number;
  className?: string;
  animated?: boolean;
}

/**
 * razr.marketing — official brand mark & logo component
 */
export default function RazrLogo({
  variant = "primary",
  size = 36,
  className = "",
  animated = true,
}: Props) {
  const isLight = variant === "light";

  const textPrimary = isLight ? "#0a0a0e" : "#0f172a";

  const LogoImg = (
    <div className="relative shrink-0 flex items-center justify-center">
      {animated && !isLight && (
        <motion.div
          aria-hidden
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full blur-md bg-orange-500/20"
        />
      )}
      <img
        src="/logo.png"
        alt="razr.marketing"
        style={{ height: size, width: "auto" }}
        className="relative z-10 object-contain max-w-full drop-shadow-[0_2px_12px_rgba(15,23,42,0.12)]"
      />
    </div>
  );

  if (variant === "icon") {
    return <span className={`inline-flex items-center ${className}`}>{LogoImg}</span>;
  }

  const fontSize = size * 0.55;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {LogoImg}
      <span className="flex items-center leading-none select-none font-black tracking-tight" style={{ fontSize, color: textPrimary }}>
        <span className="text-slate-900 font-extrabold tracking-tight">razr</span>
        <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent font-bold">.marketing</span>
      </span>
    </span>
  );
}
