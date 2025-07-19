"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { X, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Domain,
  EducationalArtwork,
  CreatureArtwork,
  getArtworkPath,
} from "../lib/artwork";

interface Answer {
  explanation: string;
  drawing_suggestion: string;
  domain?: Domain;
}

interface EnhancedAnswerDisplayProps {
  answer: Answer | null;
  isVisible: boolean;
  onClose: () => void;
  childAge?: number;
}

export function EnhancedAnswerDisplay({
  answer,
  isVisible,
  onClose,
  childAge = 8,
}: EnhancedAnswerDisplayProps) {
  const { t } = useTranslation();
  const [currentIllustration, setCurrentIllustration] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Parse drawing suggestion to find matching illustration
  useEffect(() => {
    if (answer?.drawing_suggestion) {
      setIsLoading(true);
      const illustration = findMatchingIllustration(
        answer.drawing_suggestion,
        answer.domain
      );
      setCurrentIllustration(illustration);

      // Simulate loading time for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [answer]);

  // Find matching illustration based on drawing suggestion
  const findMatchingIllustration = (
    suggestion: string,
    domain?: Domain
  ): string => {
    const lowerSuggestion = suggestion.toLowerCase();

    // Science domain illustrations
    if (domain === Domain.Science || lowerSuggestion.includes("science")) {
      if (
        lowerSuggestion.includes("solar system") ||
        lowerSuggestion.includes("planets")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Science, "solar_system")
        );
      }
      if (lowerSuggestion.includes("dinosaur")) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Science, "dinosaurs")
        );
      }
      if (
        lowerSuggestion.includes("human body") ||
        lowerSuggestion.includes("anatomy")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Science, "human_body")
        );
      }
      if (
        lowerSuggestion.includes("weather") ||
        lowerSuggestion.includes("rain") ||
        lowerSuggestion.includes("cloud")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Science, "weather")
        );
      }
      if (lowerSuggestion.includes("magnet")) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Science, "magnets")
        );
      }
      if (
        lowerSuggestion.includes("plant") ||
        lowerSuggestion.includes("growing")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(
            Domain.Science,
            "plants_growing"
          )
        );
      }
      if (
        lowerSuggestion.includes("electricity") ||
        lowerSuggestion.includes("circuit")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Science, "electricity")
        );
      }
      if (
        lowerSuggestion.includes("space") ||
        lowerSuggestion.includes("astronaut")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Science, "space")
        );
      }
      // Default science illustration
      return getArtworkPath(
        EducationalArtwork.getEducationalAsset(Domain.Science, "solar_system")
      );
    }

    // Nature domain illustrations
    if (
      domain === Domain.Nature ||
      lowerSuggestion.includes("nature") ||
      lowerSuggestion.includes("environment")
    ) {
      if (
        lowerSuggestion.includes("forest") ||
        lowerSuggestion.includes("tree")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(
            Domain.Nature,
            "forest_ecosystem"
          )
        );
      }
      if (
        lowerSuggestion.includes("ocean") ||
        lowerSuggestion.includes("fish") ||
        lowerSuggestion.includes("sea")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Nature, "ocean_life")
        );
      }
      if (
        lowerSuggestion.includes("animal") ||
        lowerSuggestion.includes("wildlife")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(
            Domain.Nature,
            "forest_ecosystem"
          )
        );
      }
      if (
        lowerSuggestion.includes("flower") ||
        lowerSuggestion.includes("garden")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Nature, "flowers")
        );
      }
      if (lowerSuggestion.includes("bird")) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Nature, "birds")
        );
      }
      if (
        lowerSuggestion.includes("insect") ||
        lowerSuggestion.includes("butterfly") ||
        lowerSuggestion.includes("bee")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Nature, "insects")
        );
      }
      // Default nature illustration
      return getArtworkPath(
        EducationalArtwork.getEducationalAsset(
          Domain.Nature,
          "forest_ecosystem"
        )
      );
    }

    // Math domain illustrations
    if (
      domain === Domain.Math ||
      lowerSuggestion.includes("math") ||
      lowerSuggestion.includes("number")
    ) {
      if (
        lowerSuggestion.includes("counting") ||
        lowerSuggestion.includes("numbers")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Math, "counting")
        );
      }
      if (
        lowerSuggestion.includes("addition") ||
        lowerSuggestion.includes("plus")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Math, "addition")
        );
      }
      if (
        lowerSuggestion.includes("shapes") ||
        lowerSuggestion.includes("geometry")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Math, "shapes")
        );
      }
      if (lowerSuggestion.includes("pattern")) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Math, "patterns")
        );
      }
      if (
        lowerSuggestion.includes("time") ||
        lowerSuggestion.includes("clock")
      ) {
        return getArtworkPath(
          EducationalArtwork.getEducationalAsset(Domain.Math, "time")
        );
      }
      // Default math illustration
      return getArtworkPath(
        EducationalArtwork.getEducationalAsset(Domain.Math, "counting")
      );
    }

    // Fallback to general learning illustration
    return "/artwork/fallback/fallback_general_learning_01.png";
  };

  // Get creature guide for the domain
  const getCreatureGuide = (domain?: Domain) => {
    if (!domain) return null;

    switch (domain) {
      case Domain.Science:
        return getArtworkPath(CreatureArtwork.SCIENCE_OWL_NEUTRAL);
      case Domain.Nature:
        return getArtworkPath(CreatureArtwork.NATURE_FOX_NEUTRAL);
      case Domain.Math:
        return getArtworkPath(CreatureArtwork.MATH_BEAR_NEUTRAL);
      default:
        return null;
    }
  };

  // Animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.3 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.4 },
    },
  };

  const illustrationVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateY: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { delay: 0.3, duration: 0.5 },
    },
  };

  if (!answer) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <Card className="shadow-2xl border-2 border-primary/20">
              <CardContent className="p-0">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {t("enhancedAnswer.title")}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {t("enhancedAnswer.ageAppropriate", {
                            age: childAge,
                          })}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Decorative sparkles */}
                  <div className="absolute top-2 right-20">
                    <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                  </div>
                  <div className="absolute bottom-2 left-20">
                    <Sparkles className="h-3 w-3 text-blue-400 animate-pulse delay-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="grid lg:grid-cols-2 gap-6 p-6">
                  {/* Illustration Section */}
                  <motion.div
                    variants={illustrationVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-gray-200">
                      {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                          <span className="ml-3 text-gray-600">
                            {t("enhancedAnswer.loading")}
                          </span>
                        </div>
                      ) : currentIllustration ? (
                        <Image
                          src={currentIllustration}
                          alt={t("enhancedAnswer.illustration.alt")}
                          fill
                          className="object-contain p-4"
                          onError={() => {
                            setCurrentIllustration(
                              "/artwork/fallback/fallback_general_learning_01.png"
                            );
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                          <BookOpen className="h-16 w-16 opacity-50" />
                        </div>
                      )}
                    </div>

                    {/* Creature Guide */}
                    {answer.domain && (
                      <motion.div
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-gray-200">
                          <Image
                            src={getCreatureGuide(answer.domain) || ""}
                            alt={t("enhancedAnswer.guide.alt", {
                              domain: answer.domain,
                            })}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 capitalize">
                            {t("enhancedAnswer.guide.title", {
                              domain: answer.domain,
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t("enhancedAnswer.guide.subtitle")}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Explanation Section */}
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    <div className="prose prose-lg max-w-none">
                      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          {t("enhancedAnswer.explanation.title")}
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {answer.explanation}
                        </p>
                      </div>

                      {/* Drawing suggestion (for development/debugging) */}
                      {process.env.NODE_ENV === "development" && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-600 mb-2">
                            {t("enhancedAnswer.debug.title")}
                          </h4>
                          <p className="text-xs text-gray-500 italic">
                            {answer.drawing_suggestion}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      className="flex gap-3 pt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button
                        onClick={onClose}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        {t("enhancedAnswer.buttons.gotIt")}
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
