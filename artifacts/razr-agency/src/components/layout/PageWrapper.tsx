import { motion } from "framer-motion";
import { ReactNode } from "react";
import { EASE_LUX } from "@/lib/easings";

interface PageWrapperProps {
  children: ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: EASE_LUX }}
      className="pt-20 relative overflow-x-hidden w-full max-w-[100vw] bg-transparent"
    >
      {children}
    </motion.div>
  );
}
