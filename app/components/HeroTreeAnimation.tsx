"use client";

import { motion } from "framer-motion";
import { TreePine, Sparkles, Star, Heart } from "lucide-react";

interface HeroTreeAnimationProps {
  className?: string;
}

export function HeroTreeAnimation({ className = "" }: HeroTreeAnimationProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Main Tree */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.2,
          type: "spring" as const,
          damping: 20,
          stiffness: 100,
        }}
        className="relative z-10"
      >
        <TreePine className="h-32 w-32 text-primary" />
      </motion.div>

      {/* Orbiting Elements */}
      {/* Science sparkles (blue) */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        style={{ transform: "translate(-50%, -50%)" }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="relative">
          <motion.div
            className="absolute"
            style={{
              transform: "translateY(-60px)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="h-6 w-6 text-blue-500" />
          </motion.div>
        </div>
      </motion.div>

      {/* Nature hearts (green) */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        style={{ transform: "translate(-50%, -50%)" }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="relative">
          <motion.div
            className="absolute"
            style={{
              transform: "translateY(-80px) rotate(120deg)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Heart className="h-5 w-5 text-green-500" />
          </motion.div>
        </div>
      </motion.div>

      {/* Math stars (yellow) */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        style={{ transform: "translate(-50%, -50%)" }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="relative">
          <motion.div
            className="absolute"
            style={{
              transform: "translateY(-70px) rotate(240deg)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Star className="h-5 w-5 text-yellow-500" />
          </motion.div>
        </div>
      </motion.div>

      {/* Random floating sparkles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2"
          style={{ transform: "translate(-50%, -50%)" }}
          animate={{
            x: [0, Math.cos((i * 30 * Math.PI) / 180) * 120],
            y: [0, Math.sin((i * 30 * Math.PI) / 180) * 120],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: [
                "#60A5FA",
                "#34D399",
                "#FBBF24",
                "#A78BFA",
                "#F87171",
                "#10B981",
              ][i % 6],
            }}
          />
        </motion.div>
      ))}

      {/* Pulsing aura */}
      <motion.div
        className="absolute top-1/2 left-1/2 -z-10"
        style={{ transform: "translate(-50%, -50%)" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-48 h-48 rounded-full bg-gradient-to-r from-primary to-secondary" />
      </motion.div>

      {/* Growth rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -z-20"
        style={{ transform: "translate(-50%, -50%)" }}
        animate={{
          scale: [0, 2],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeOut",
        }}
      >
        <div className="w-32 h-32 rounded-full border-2 border-primary/30" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 -z-20"
        style={{ transform: "translate(-50%, -50%)" }}
        animate={{
          scale: [0, 2.5],
          opacity: [0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeOut",
          delay: 1,
        }}
      >
        <div className="w-32 h-32 rounded-full border-2 border-secondary/20" />
      </motion.div>
    </div>
  );
}
