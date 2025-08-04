"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, TreePine } from "lucide-react";

interface AIProcessingAnimationProps {
  isVisible: boolean;
  message?: string;
}

export function AIProcessingAnimation({
  isVisible,
  message = "Thinking about your question...",
}: AIProcessingAnimationProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring" as const, damping: 25, stiffness: 500 }}
      >
        <div className="text-center space-y-6">
          {/* Animated Tree Icon */}
          <div className="relative">
            <motion.div
              className="inline-block"
              animate={{
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <TreePine className="h-16 w-16 text-primary mx-auto" />
            </motion.div>

            {/* Floating sparkles around the tree */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                }}
                animate={{
                  x: [0, Math.cos((i * Math.PI) / 3) * 40],
                  y: [0, Math.sin((i * Math.PI) / 3) * 40],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-4 w-4 text-yellow-400" />
              </motion.div>
            ))}
          </div>

          {/* Brain Icon with Pulse */}
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Brain className="h-8 w-8 text-blue-500 mx-auto" />
            </motion.div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Knowledge Tree is Thinking
            </h3>
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
