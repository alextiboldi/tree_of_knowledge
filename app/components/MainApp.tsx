"use client";

import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { QuestionInput } from "./QuestionInput";
import { AnswerDisplay } from "./AnswerDisplay";
import { AIProcessingAnimation } from "./AIProcessingAnimation";
import { Card, CardContent } from "@/components/ui/card";
import {
  TreePine,
  Sparkles,
  Brain,
  Heart,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { useAskQuestion } from "../hooks/useApi";
import { ChildContext, Answer, ApiError } from "../lib/api";

interface MainAppProps {
  onBackToDashboard: () => void;
  childContext?: ChildContext;
}

export function MainApp({ onBackToDashboard, childContext }: MainAppProps) {
  const { t } = useTranslation();
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null);

  const askQuestionMutation = useAskQuestion({
    onSuccess: (data, variables) => {
      if (data.success) {
        setCurrentAnswer({
          question: variables.question,
          explanation: data.explanation,
          drawing_suggestion: data.drawing_suggestion,
        });
      } else {
        // Even "failed" responses from our API are actually safe fallbacks
        setCurrentAnswer({
          question: variables.question,
          explanation:
            data.explanation ||
            "I'm having trouble with that question right now. Can you try asking it in a different way?",
          drawing_suggestion:
            data.drawing_suggestion || "A friendly tree character thinking",
        });
      }
    },
    onError: (error: ApiError) => {
      console.error("Error asking question:", error);
      // TanStack Query handles error state automatically
    },
  });

  const handleQuestionSubmit = (question: string) => {
    const effectiveChildContext = childContext || {
      age: 8,
      name: undefined,
      selectedDomains: ["science-technology"],
    };

    askQuestionMutation.mutate({
      question,
      childContext: effectiveChildContext,
    });
  };

  const handleCloseAnswer = () => {
    setCurrentAnswer(null);
    // Clear any errors by resetting the mutation
    askQuestionMutation.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4 child-interface">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TreePine className="h-8 w-8 text-primary animate-pulse-gentle" />
            <h1 className="text-child-4xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent tracking-child">
              <Trans
                i18nKey="mainApp.title"
                components={{
                  gradient: (
                    <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent" />
                  ),
                }}
              />
            </h1>
            <TreePine className="h-8 w-8 text-primary animate-pulse-gentle" />
          </div>
          <p className="text-child-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {childContext?.name ? (
              <Trans
                i18nKey="mainApp.greeting"
                values={{ name: childContext.name }}
                components={{
                  strong: <strong />,
                }}
              />
            ) : null}{" "}
            <Trans
              i18nKey="mainApp.subtitle"
              components={{
                strong: <strong />,
              }}
            />
          </p>
        </header>

        {/* Question Input Section */}
        <div
          className="mb-12 animate-scale-in"
          style={{ animationDelay: "0.1s" }}
        >
          <QuestionInput
            onSubmit={handleQuestionSubmit}
            isLoading={askQuestionMutation.isPending}
            placeholder={t("mainApp.questionPlaceholder")}
          />
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-blue-200 bg-blue-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-left group">
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-blue-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-child-xl font-bold text-blue-900 mb-2 tracking-child">
                Science & Technology
              </h3>
              <p className="text-child-sm text-blue-700 leading-relaxed">
                Learn about how things work, from rockets to robots!
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-green-200 bg-green-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in group"
            style={{ animationDelay: "0.1s" }}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-green-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-child-xl font-bold text-green-900 mb-2 tracking-child">
                Nature & Environment
              </h3>
              <p className="text-child-sm text-green-700 leading-relaxed">
                Discover amazing animals, plants, and our beautiful planet!
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-purple-200 bg-purple-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-right group"
            style={{ animationDelay: "0.2s" }}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-purple-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-child-xl font-bold text-purple-900 mb-2 tracking-child">
                Math & Logic
              </h3>
              <p className="text-child-sm text-purple-700 leading-relaxed">
                Make numbers fun with patterns, puzzles, and problem-solving!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Fun Facts Section */}
        <div
          className="mb-12 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-yellow-600 animate-float" />
                <h3 className="text-child-2xl font-bold text-yellow-900 tracking-child">
                  {t("mainApp.funFacts.title")}
                </h3>
                <Sparkles
                  className="h-6 w-6 text-yellow-600 animate-float"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white/60 rounded-lg">
                  <p className="text-child-base font-semibold text-gray-800 leading-relaxed">
                    <Trans
                      i18nKey="mainApp.funFacts.rocket"
                      components={{
                        emoji: <span role="img" aria-label="rocket" />,
                      }}
                    />
                  </p>
                </div>
                <div className="p-4 bg-white/60 rounded-lg">
                  <p className="text-child-base font-semibold text-gray-800 leading-relaxed">
                    <Trans
                      i18nKey="mainApp.funFacts.trees"
                      components={{
                        emoji: <span role="img" aria-label="tree" />,
                      }}
                    />
                  </p>
                </div>
                <div className="p-4 bg-white/60 rounded-lg">
                  <p className="text-child-base font-semibold text-gray-800 leading-relaxed">
                    <Trans
                      i18nKey="mainApp.funFacts.zero"
                      components={{
                        emoji: <span role="img" aria-label="abacus" />,
                      }}
                    />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {askQuestionMutation.isError && (
          <div className="mb-8 animate-bounce-subtle">
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <div className="mb-3">
                  <div className="inline-flex p-3 bg-red-100 rounded-full">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <h3 className="text-child-lg font-bold text-red-900 mb-2">
                  {t("mainApp.errors.title")}
                </h3>
                <p className="text-child-base text-red-700 leading-relaxed">
                  <Trans
                    i18nKey="mainApp.errors.fallbackExplanation"
                    components={{
                      strong: <strong />,
                    }}
                  />
                </p>
                <button
                  onClick={() => askQuestionMutation.reset()}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full text-child-sm font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105"
                >
                  {t("mainApp.errors.tryAgainButton")}
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        <footer
          className="text-center mt-12 pb-8 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary animate-float" />
            <p className="text-child-sm text-muted-foreground font-medium">
              {t("mainApp.footer.madeWithLove")}
            </p>
            <Sparkles
              className="h-4 w-4 text-primary animate-float"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
          <p className="text-child-xs text-muted-foreground">
            {t("mainApp.footer.safeLearning")}
          </p>
        </footer>
      </div>

      {/* Answer Modal */}
      <AIProcessingAnimation isVisible={askQuestionMutation.isPending} />

      {currentAnswer && (
        <AnswerDisplay
          answer={{
            explanation: currentAnswer.explanation,
            drawing_suggestion: currentAnswer.drawing_suggestion,
            domain: undefined, // Will be enhanced later with domain detection
          }}
          isVisible={!!currentAnswer}
          onClose={handleCloseAnswer}
          childAge={childContext?.age}
        />
      )}
    </div>
  );
}
