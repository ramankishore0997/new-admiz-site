import React, { useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { EarthBlaze } from "@/components/ui/earth-blaze";
import { CosmicDeepSpace } from "@/components/ui/cosmic-deep-space";

interface ThemeConfig {
  mode: "earth" | "deep-space" | "minimal";
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  starCount: number;
  nebulaOpacity: number;
}

const ROUTE_THEMES: Record<string, ThemeConfig> = {
  "/": {
    mode: "earth",
    primaryColor: "#00FFCC",
    secondaryColor: "#3B82F6",
    backgroundColor: "#000000",
    starCount: 3500,
    nebulaOpacity: 0.7,
  },
  "/features": {
    mode: "deep-space",
    primaryColor: "#00FFCC",
    secondaryColor: "#8B5CF6",
    backgroundColor: "#020817",
    starCount: 3200,
    nebulaOpacity: 0.88,
  },
  "/solutions": {
    mode: "deep-space",
    primaryColor: "#A855F7",
    secondaryColor: "#3B82F6",
    backgroundColor: "#070314",
    starCount: 3200,
    nebulaOpacity: 0.85,
  },
  "/agency-accounts": {
    mode: "deep-space",
    primaryColor: "#F59E0B",
    secondaryColor: "#EC4899",
    backgroundColor: "#0B0800",
    starCount: 3000,
    nebulaOpacity: 0.85,
  },
  "/how-it-works": {
    mode: "deep-space",
    primaryColor: "#06B6D4",
    secondaryColor: "#10B981",
    backgroundColor: "#020B14",
    starCount: 3000,
    nebulaOpacity: 0.82,
  },
  "/about": {
    mode: "deep-space",
    primaryColor: "#38BDF8",
    secondaryColor: "#818CF8",
    backgroundColor: "#030712",
    starCount: 2600,
    nebulaOpacity: 0.75,
  },
  "/faq": {
    mode: "deep-space",
    primaryColor: "#818CF8",
    secondaryColor: "#C084FC",
    backgroundColor: "#05050D",
    starCount: 2500,
    nebulaOpacity: 0.75,
  },
  "/contact": {
    mode: "deep-space",
    primaryColor: "#00FFCC",
    secondaryColor: "#38BDF8",
    backgroundColor: "#020817",
    starCount: 2800,
    nebulaOpacity: 0.8,
  },
  "/apply-agency": {
    mode: "deep-space",
    primaryColor: "#F59E0B",
    secondaryColor: "#8B5CF6",
    backgroundColor: "#080410",
    starCount: 2800,
    nebulaOpacity: 0.8,
  },
  "/login": {
    mode: "deep-space",
    primaryColor: "#00FFCC",
    secondaryColor: "#8B5CF6",
    backgroundColor: "#030712",
    starCount: 3000,
    nebulaOpacity: 0.85,
  },
  "/signup": {
    mode: "deep-space",
    primaryColor: "#00FFCC",
    secondaryColor: "#8B5CF6",
    backgroundColor: "#030712",
    starCount: 3000,
    nebulaOpacity: 0.85,
  },
  "/register": {
    mode: "deep-space",
    primaryColor: "#00FFCC",
    secondaryColor: "#8B5CF6",
    backgroundColor: "#030712",
    starCount: 3000,
    nebulaOpacity: 0.85,
  },
};

const DEFAULT_THEME: ThemeConfig = {
  mode: "deep-space",
  primaryColor: "#00FFCC",
  secondaryColor: "#8B5CF6",
  backgroundColor: "#030712",
  starCount: 2600,
  nebulaOpacity: 0.75,
};

export function GlobalCosmicBackground() {
  const [location] = useLocation();

  const isAppOrAdmin = location.startsWith("/app") || location.startsWith("/admin");

  const currentTheme = useMemo(() => {
    if (isAppOrAdmin) {
      return {
        mode: "minimal" as const,
        primaryColor: "#000000",
        secondaryColor: "#000000",
        backgroundColor: "#060608",
        starCount: 0,
        nebulaOpacity: 0,
      };
    }
    return ROUTE_THEMES[location] || DEFAULT_THEME;
  }, [location, isAppOrAdmin]);

  const isHome = currentTheme.mode === "earth";
  const isDeepSpace = currentTheme.mode === "deep-space";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
      style={{
        backgroundColor: currentTheme.backgroundColor,
        transition: "background-color 0.4s ease",
      }}
    >
      {/* 1. Persistent Earth Horizon Layer (Always mounted, crossfades via opacity with zero re-init) */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-500 ease-out"
        style={{
          opacity: isHome ? 1 : 0,
          visibility: isHome ? "visible" : "hidden",
        }}
      >
        <EarthBlaze
          starCount={3500}
          galaxyBrightness={1.45}
          surfaceBrightness={1.3}
          illumination={1.35}
          auroraEnabled={true}
          interactive={isHome}
          style={{
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            aspectRatio: "auto",
          }}
        />
        <div className="fixed inset-0 bg-black/25 pointer-events-none" />
      </div>

      {/* 2. Persistent Deep Space Nebula & Warp Starfield Layer (Always mounted, reactive to route colors) */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-500 ease-out"
        style={{
          opacity: isDeepSpace ? 1 : 0,
          visibility: isDeepSpace ? "visible" : "hidden",
        }}
      >
        <CosmicDeepSpace
          primaryColor={currentTheme.primaryColor}
          secondaryColor={currentTheme.secondaryColor}
          backgroundColor={currentTheme.backgroundColor}
          starCount={currentTheme.starCount}
          nebulaOpacity={currentTheme.nebulaOpacity}
          enableShootingStars={true}
          enableConstellations={true}
          enableCyberRings={true}
          interactive={isDeepSpace}
        />
      </div>
    </div>
  );
}

export default GlobalCosmicBackground;
