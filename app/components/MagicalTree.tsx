"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Domain,
  GrowthState,
  TreeArtwork,
  getArtworkPath,
} from "../lib/artwork";
import { TreeBranch } from "./TreeBranch";

interface DomainGrowth {
  domain: Domain;
  growthLevel: number; // 0-3, where 0 is empty and 3 is fully grown
}

interface MagicalTreeProps {
  domainGrowth: DomainGrowth[];
  onBranchClick?: (domain: Domain) => void;
}

export function MagicalTree({ domainGrowth, onBranchClick }: MagicalTreeProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-[800px]">
      {/* Base Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getArtworkPath(TreeArtwork.BASE_BACKGROUND)}
          alt="Magical forest background"
          fill
          className="object-cover"
          priority
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {/* Tree Base */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        {/* Roots */}
        <div className="relative h-[400px] w-full">
          <Image
            src={getArtworkPath(TreeArtwork.BASE_ROOTS)}
            alt="Tree roots"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Main Trunk */}
        <div className="relative h-[800px] w-full -mt-[200px]">
          <Image
            src={getArtworkPath(TreeArtwork.BASE_TRUNK)}
            alt="Tree trunk"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Domain Branches */}
      {isLoaded &&
        domainGrowth.map((growth, index) => {
          const rotation = -30 + index * 30; // Spread branches: -30°, 0°, +30°

          return (
            <div
              key={growth.domain}
              className="absolute z-20"
              style={{
                top: "30%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <TreeBranch
                domain={growth.domain}
                growthLevel={growth.growthLevel}
                rotation={rotation}
                onClick={() => onBranchClick?.(growth.domain)}
              />
            </div>
          );
        })}
    </div>
  );
}
