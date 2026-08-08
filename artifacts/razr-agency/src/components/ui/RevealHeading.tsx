import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Children, isValidElement, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3";
};

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

function renderNode(node: ReactNode, keyPrefix: string, wordIndex: { i: number }): ReactNode {
  if (typeof node === "string") {
    const words = node.split(/(\s+)/);
    return words.map((w, idx) => {
      if (/^\s+$/.test(w)) return w;
      if (w.length === 0) return null;
      const key = `${keyPrefix}-w${wordIndex.i++}-${idx}`;
      return (
        <span key={key} className="inline-block overflow-hidden align-baseline">
          <motion.span variants={wordVariants} className="inline-block will-change-transform">
            {w}
          </motion.span>
        </span>
      );
    });
  }
  if (Array.isArray(node)) {
    return node.map((n, i) => <span key={`${keyPrefix}-a${i}`}>{renderNode(n, `${keyPrefix}-a${i}`, wordIndex)}</span>);
  }
  if (isValidElement<{ children?: ReactNode; className?: string }>(node)) {
    const childChildren = renderNode(node.props.children, `${keyPrefix}-c`, wordIndex);
    const Tag = node.type as React.ElementType;
    return (
      <Tag {...(node.props as Record<string, unknown>)} key={`${keyPrefix}-el`}>
        {childChildren}
      </Tag>
    );
  }
  return node;
}

export default function RevealHeading({
  children,
  className = "",
  delay = 0.05,
  stagger = 0.07,
  as = "h1",
}: Props) {
  const prefersReduced = useReducedMotion();
  const wordIndex = { i: 0 };
  const Tag = motion[as];

  // Reduced motion: render static heading, no per-word animation
  if (prefersReduced) {
    const StaticTag = as as React.ElementType;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      custom={{ stagger, delay }}
    >
      {Children.map(children, (child, i) => (
        <span key={`rh-${i}`}>{renderNode(child, `rh-${i}`, wordIndex)}</span>
      ))}
    </Tag>
  );
}
