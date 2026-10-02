import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NumberTickerProps {
  value: number;
  pad?: number;
  duration?: number;
  stagger?: number;
  startOnView?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
  digitClassName?: string;
  locale?: boolean;
}

const DIGIT_HEIGHT_EM = 1.1;
const DIGITS = Array.from({ length: 10 }, (_, n) => n);

export function NumberTicker({
  value,
  pad,
  duration = 0.8,
  stagger = 0.04,
  startOnView = true,
  prefix,
  suffix,
  className,
  digitClassName,
  locale = false,
}: NumberTickerProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.5 });
  const [armed, setArmed] = useState(!startOnView);

  useEffect(() => {
    if (startOnView && inView) setArmed(true);
  }, [startOnView, inView]);

  const text = useMemo(() => {
    const rounded = Math.round(value);
    const formatted = locale ? rounded.toLocaleString() : rounded.toString();
    return pad ? formatted.padStart(pad, "0") : formatted;
  }, [value, pad, locale]);

  const glyphs = useMemo(() => {
    const chars = text.split("");
    return chars.map((char, i) => ({ char, id: `g-${chars.length - 1 - i}` }));
  }, [text]);

  return (
    <span
      ref={containerRef}
      className={cn("inline-flex items-center tabular-nums font-mono font-black", className)}
    >
      {prefix && <span>{prefix}</span>}
      <span aria-hidden="true" className="inline-flex items-center">
        {glyphs.map(({ char, id }, i) => {
          const isDigit = /\d/.test(char);
          if (!isDigit) {
            return (
              <span key={id} className="inline-block">
                {char}
              </span>
            );
          }
          const digit = Number(char);
          return (
            <Digit
              key={id}
              digit={armed ? digit : 0}
              delay={i * stagger}
              duration={duration}
              className={digitClassName}
            />
          );
        })}
      </span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

function Digit({
  digit,
  delay,
  duration,
  className,
}: {
  digit: number;
  delay: number;
  duration: number;
  className?: string;
}) {
  return (
    <span
      className={cn("relative inline-block overflow-hidden", className)}
      style={{ height: `${DIGIT_HEIGHT_EM}em`, width: "1ch" }}
    >
      <motion.span
        initial={{ y: 0 }}
        animate={{ y: `-${digit * DIGIT_HEIGHT_EM}em` }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute inset-x-0 top-0 flex flex-col items-center will-change-transform"
      >
        {DIGITS.map((n) => (
          <span
            key={n}
            className="flex h-[1.1em] items-center justify-center leading-none"
          >
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
