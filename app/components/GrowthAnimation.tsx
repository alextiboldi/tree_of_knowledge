"use client";

import { motion } from "framer-motion";
import { Domain } from "../lib/artwork";

interface GrowthAnimationProps {
  domain: Domain;
  isVisible: boolean;
  onComplete?: () => void;
}

export function GrowthAnimation({
  domain,
  isVisible,
  onComplete,
}: GrowthAnimationProps) {
  // Domain-specific colors for particles
  const getParticleColors = () => {
    switch (domain) {
      case Domain.Science:
        return ["#60A5FA", "#3B82F6", "#2563EB"]; // Blues
      case Domain.Nature:
        return ["#34D399", "#10B981", "#059669"]; // Greens
      case Domain.Math:
        return ["#FBBF24", "#F59E0B", "#D97706"]; // Yellows/Oranges
      default:
        return ["#E5E7EB", "#D1D5DB", "#9CA3AF"]; // Grays
    }
  };

  // Particle animation variants
  const particleVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      y: 0,
    },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0.5],
      y: -100,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  // Glow animation variants
  const glowVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: [0, 0.8, 0],
      scale: [0.8, 1.2, 1.5],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      onAnimationComplete={onComplete}
    >
      {/* Particles */}
      <div className="relative w-full h-full">
        {Array.from({ length: 12 }).map((_, i) => {
          const colors = getParticleColors();
          const color = colors[i % colors.length];
          const angle = (i / 12) * Math.PI * 2;
          const radius = 50;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: color,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                boxShadow: `0 0 8px ${color}`,
              }}
              variants={particleVariants}
              custom={i}
              transition={{
                delay: i * 0.1,
                duration: 1.5,
                ease: "easeOut",
              }}
            />
          );
        })}
      </div>

      {/* Central Glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={glowVariants}
      >
        <div
          className="w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              getParticleColors()[0]
            }33 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* Sparkle Lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x1 = 50 + Math.cos(angle) * 20;
          const y1 = 50 + Math.sin(angle) * 20;
          const x2 = 50 + Math.cos(angle) * 40;
          const y2 = 50 + Math.sin(angle) * 40;

          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={getParticleColors()[0]}
              strokeWidth="0.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isVisible
                  ? {
                      pathLength: [0, 1, 0],
                      opacity: [0, 0.5, 0],
                    }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                delay: i * 0.1,
                duration: 1,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
    </motion.div>
  );
}
