import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          data-testid="loading-screen"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 flex flex-col items-center gap-8"
          >
            <img
              src="/logo.png"
              alt="Razr Marketing"
              style={{ height: 84, width: "auto" }}
              className="object-contain"
            />

            <div className="w-48 h-0.5 rounded-full bg-border overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-muted-foreground text-sm tracking-widest uppercase"
            >
              Loading
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
