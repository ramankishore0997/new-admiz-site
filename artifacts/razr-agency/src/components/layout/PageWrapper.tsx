import { motion } from "framer-motion";
import { ReactNode } from "react";
import { EASE_LUX } from "@/lib/easings";

interface PageWrapperProps {
  children: ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease: EASE_LUX }}
      className="pt-20 relative overflow-x-hidden w-full max-w-[100vw]"
    >
      {children}
    </motion.div>
  );
}
