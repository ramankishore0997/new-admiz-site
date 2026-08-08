// Shared luxury easing curves. Used everywhere instead of "easeInOut" defaults.
export const EASE_LUX = [0.16, 1, 0.3, 1] as const; // Apple/Linear/Vercel signature
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;
export const EASE_SNAP = [0.34, 1.56, 0.64, 1] as const; // gentle overshoot

export const SPRING_LUX = { type: "spring" as const, stiffness: 220, damping: 28, mass: 0.7 };
export const SPRING_SOFT = { type: "spring" as const, stiffness: 160, damping: 22, mass: 0.8 };
export const SPRING_SNAP = { type: "spring" as const, stiffness: 320, damping: 24, mass: 0.6 };
