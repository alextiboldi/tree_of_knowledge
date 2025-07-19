"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Domain,
  GrowthState,
  TreeArtwork,
  getArtworkPath,
} from "../lib/artwork";
import { GrowthAnimation } from "./GrowthAnimation";

interface TreeBranchProps {
  domain: Domain;
  growthLevel: number;
  rotation?: number;
  onClick?: () => void;
}

export function TreeBranch({
  domain,
  growthLevel,
  rotation = 0,
  onClick,
}: TreeBranchProps) {
  const [isGrowing, setIsGrowing] = useState(false);
  const [currentGrowthState, setCurrentGrowthState] = useState<GrowthState>(
    GrowthState.Empty
  );
  const [prevGrowthLevel, setPrevGrowthLevel] = useState(growthLevel);

  // Convert growth level to GrowthState
  const getGrowthState = (level: number): GrowthState => {
    switch (level) {
      case 0:
        return GrowthState.Empty;
      case 1:
        return GrowthState.Growing01;
      case 2:
        return GrowthState.Growing02;
      case 3:
        return GrowthState.Growing03;
      default:
        return GrowthState.Empty;
    }
  };

  // Handle growth level changes
  useEffect(() => {
    if (growthLevel !== prevGrowthLevel) {
      setIsGrowing(true);
      const newState = getGrowthState(growthLevel);
      setCurrentGrowthState(newState);
      setPrevGrowthLevel(growthLevel);
    }
  }, [growthLevel, prevGrowthLevel]);

  // Get the current branch asset
  const branchAsset = TreeArtwork.getBranchAsset(domain, currentGrowthState);

  // Animation variants for growth
  const branchVariants = {
    initial: {
      scale: 0.95,
      opacity: 0.8,
    },
    growing: {
      scale: 1.05,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    stable: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // Get animation state
  const getAnimationState = () => {
    if (isGrowing) return "growing";
    return "stable";
  };

  return (
    <motion.div
      className="relative"
      initial="initial"
      animate={getAnimationState()}
      variants={branchVariants}
      style={{
        width: "512px",
        height: "512px",
        transform: `rotate(${rotation}deg)`,
        transition: "filter 0.5s ease-in-out",
      }}
      onClick={onClick}
    >
      {/* Base Branch */}
      <Image
        src={getArtworkPath(branchAsset)}
        alt={`${domain} branch`}
        width={512}
        height={512}
        className={`
          object-contain transition-all duration-500
          ${isGrowing ? "scale-105" : "scale-100"}
          hover:scale-102 cursor-pointer
        `}
        priority
      />

      {/* Growth Animation */}
      <GrowthAnimation
        domain={domain}
        isVisible={isGrowing}
        onComplete={() => setIsGrowing(false)}
      />
    </motion.div>
  );
}
