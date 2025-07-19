"use client";

import { useState } from "react";
import { Domain } from "../lib/artwork";
import { MagicalTree } from "./MagicalTree";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TreeDemo() {
  const [domainGrowth, setDomainGrowth] = useState([
    { domain: Domain.Science, growthLevel: 0 },
    { domain: Domain.Nature, growthLevel: 0 },
    { domain: Domain.Math, growthLevel: 0 },
  ]);

  const handleGrowDomain = (domain: Domain) => {
    setDomainGrowth((prev) =>
      prev.map((growth) =>
        growth.domain === domain
          ? { ...growth, growthLevel: Math.min(3, growth.growthLevel + 1) }
          : growth
      )
    );
  };

  const handleResetDomain = (domain: Domain) => {
    setDomainGrowth((prev) =>
      prev.map((growth) =>
        growth.domain === domain ? { ...growth, growthLevel: 0 } : growth
      )
    );
  };

  const handleResetAll = () => {
    setDomainGrowth((prev) =>
      prev.map((growth) => ({ ...growth, growthLevel: 0 }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Magical Knowledge Tree Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            Click on branches to grow them or use the controls below
          </p>
        </div>

        {/* Tree Visualization */}
        <div className="mb-8">
          <MagicalTree
            domainGrowth={domainGrowth}
            onBranchClick={handleGrowDomain}
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {domainGrowth.map((growth) => (
            <Card key={growth.domain} className="shadow-lg">
              <CardHeader>
                <CardTitle className="capitalize">
                  {growth.domain} Branch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Growth Level: {growth.growthLevel}/3
                  </span>
                  <div className="space-x-2">
                    <Button
                      onClick={() => handleGrowDomain(growth.domain)}
                      disabled={growth.growthLevel >= 3}
                      size="sm"
                    >
                      Grow
                    </Button>
                    <Button
                      onClick={() => handleResetDomain(growth.domain)}
                      variant="outline"
                      size="sm"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(growth.growthLevel / 3) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reset All Button */}
        <div className="mt-4 text-center">
          <Button
            onClick={handleResetAll}
            variant="outline"
            className="w-full max-w-xs"
          >
            Reset All Branches
          </Button>
        </div>
      </div>
    </div>
  );
}
