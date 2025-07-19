"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Sparkles } from "lucide-react";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function QuestionInput({
  onSubmit,
  isLoading = false,
  placeholder = "What do you want to learn today? Ask me anything about science, nature, or math!",
}: QuestionInputProps) {
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
      setQuestion("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (but not Shift+Enter for multiline)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestions = [
    t("questionInput.suggestions.skyBlue"),
    t("questionInput.suggestions.butterflies"),
    t("questionInput.suggestions.blackHoles"),
    t("questionInput.suggestions.plants"),
  ];

  return (
    <Card
      className={`w-full max-w-2xl mx-auto shadow-lg border-2 bg-white/90 backdrop-blur-sm transition-all duration-300 child-interface ${
        isFocused
          ? "border-primary/60 shadow-xl scale-105"
          : "border-primary/20 hover:border-primary/40"
      }`}
    >
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary animate-float" />
            <h2 className="text-child-xl font-bold text-primary tracking-child">
              {t("questionInput.title")}
            </h2>
            <Sparkles
              className="h-5 w-5 text-primary animate-float"
              style={{ animationDelay: "0.3s" }}
            />
          </div>

          <div className="space-y-3">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={isLoading}
              className={`min-h-[100px] resize-none text-child-base leading-relaxed font-medium tracking-child placeholder:text-gray-500 transition-all duration-300 ${
                isFocused ? "bg-blue-50/50" : ""
              }`}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`transition-all duration-300 ${
                    question.trim()
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0"
                  }`}
                >
                  <span className="text-child-sm text-green-600 font-medium">
                    {t("questionInput.feedback.great")}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!question.trim() || isLoading}
                className={`bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 text-child-sm tracking-child ${
                  question.trim() && !isLoading
                    ? "scale-100 opacity-100 hover:scale-110"
                    : "scale-90 opacity-50"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("questionInput.buttons.thinking")}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    <span>{t("questionInput.buttons.ask")}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Fun encouragement messages */}
          <div className="text-center animate-fade-in">
            <p className="text-child-xs text-gray-600 leading-relaxed">
              {question.length === 0 && t("questionInput.feedback.ready")}
              {question.length > 0 &&
                question.length < 10 &&
                t("questionInput.feedback.keepGoing")}
              {question.length >= 10 && t("questionInput.feedback.perfect")}
            </p>
          </div>

          {/* Quick suggestion buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuestion(suggestion)}
                disabled={isLoading}
                className="px-3 py-1 text-child-xs bg-gray-100 hover:bg-primary/10 rounded-full text-gray-700 hover:text-primary transition-all duration-200 hover:scale-105 font-medium tracking-child animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
