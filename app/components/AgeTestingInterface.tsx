"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, Brain, Send, User } from "lucide-react";
import { useMultipleAgeQuestions } from "../hooks/useApi";
import { ChildContext } from "../lib/api";

interface TestResponse {
  age: number;
  explanation: string;
  drawing_suggestion: string;
}

export function AgeTestingInterface() {
  const { t } = useTranslation();
  const [question, setQuestion] = useState(t("ageTesting.defaultQuestion"));
  const [responses, setResponses] = useState<TestResponse[]>([]);

  const testAges = [6, 8, 10, 12, 14];
  const sampleQuestions = [
    t("ageTesting.sampleQuestions.skyBlue"),
    t("ageTesting.sampleQuestions.rockets"),
    t("ageTesting.sampleQuestions.plants"),
    t("ageTesting.sampleQuestions.sleep"),
    t("ageTesting.sampleQuestions.computer"),
  ];

  const multipleAgeQuestionsMutation = useMultipleAgeQuestions();

  // Handle success and error using useEffect
  useEffect(() => {
    if (
      multipleAgeQuestionsMutation.isSuccess &&
      multipleAgeQuestionsMutation.data
    ) {
      setResponses(multipleAgeQuestionsMutation.data as TestResponse[]);
    }
    if (multipleAgeQuestionsMutation.isError) {
      console.error(
        "Error testing age responses:",
        multipleAgeQuestionsMutation.error
      );
      setResponses([]);
    }
  }, [
    multipleAgeQuestionsMutation.isSuccess,
    multipleAgeQuestionsMutation.isError,
    multipleAgeQuestionsMutation.data,
    multipleAgeQuestionsMutation.error,
  ]);

  const testAgeResponses = () => {
    if (!question.trim()) return;

    setResponses([]);
    multipleAgeQuestionsMutation.mutate({
      question,
      ages: testAges,
    });
  };

  const getAgeGroupLabel = (age: number) => {
    if (age <= 6) return t("ageTesting.ageGroups.earlyElementary");
    if (age <= 8) return t("ageTesting.ageGroups.elementary");
    if (age <= 10) return t("ageTesting.ageGroups.lateElementary");
    if (age <= 12) return t("ageTesting.ageGroups.middleSchool");
    return t("ageTesting.ageGroups.earlyHighSchool");
  };

  const getComplexityColor = (age: number) => {
    if (age <= 6) return "border-green-200 bg-green-50";
    if (age <= 8) return "border-blue-200 bg-blue-50";
    if (age <= 10) return "border-purple-200 bg-purple-50";
    if (age <= 12) return "border-orange-200 bg-orange-50";
    return "border-red-200 bg-red-50";
  };

  const getVocabularyLevel = (age: number) => {
    if (age <= 6) return t("ageTesting.vocabulary.simple");
    if (age <= 10) return t("ageTesting.vocabulary.elementary");
    return t("ageTesting.vocabulary.advanced");
  };

  const getComplexityLevel = (age: number) => {
    if (age <= 8) return t("ageTesting.complexity.concrete");
    if (age <= 12) return t("ageTesting.complexity.basic");
    return t("ageTesting.complexity.advanced");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">
              {t("ageTesting.title")}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {t("ageTesting.subtitle")}
          </p>
        </div>

        {/* Question Input */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-5 w-5" />
              {t("ageTesting.testQuestion")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t("ageTesting.questionPlaceholder")}
                className="flex-1"
              />
              <Button
                onClick={testAgeResponses}
                disabled={
                  multipleAgeQuestionsMutation.isPending || !question.trim()
                }
                className="bg-primary hover:bg-primary/90"
              >
                {multipleAgeQuestionsMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {t("ageTesting.testButton")}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {t("ageTesting.sampleQuestionsTitle")}:
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleQuestions.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuestion(sample)}
                    className="text-xs"
                  >
                    {sample}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Age Responses */}
        {responses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("ageTesting.responsesTitle", { question })}
            </h2>

            <div className="grid gap-4">
              {responses.map((response, index) => (
                <Card
                  key={index}
                  className={`shadow-lg border-2 ${getComplexityColor(
                    response.age
                  )}`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t("ageTesting.ageLabel", {
                          age: response.age,
                          group: getAgeGroupLabel(response.age),
                        })}
                      </div>
                      <div className="text-sm font-normal text-gray-600">
                        {t("ageTesting.complexityLevel", {
                          level: Math.ceil(response.age / 3),
                        })}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        {t("ageTesting.explanation")}:
                      </h4>
                      <p className="text-gray-700 leading-relaxed bg-white p-3 rounded border">
                        {response.explanation}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        {t("ageTesting.drawingSuggestion")}:
                      </h4>
                      <p className="text-gray-600 text-sm bg-white p-2 rounded border italic">
                        {response.drawing_suggestion}
                      </p>
                    </div>

                    {/* Analysis */}
                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {t("ageTesting.analysis.title")}:
                      </h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>
                          •{" "}
                          <strong>
                            {t("ageTesting.analysis.vocabulary")}:
                          </strong>{" "}
                          {getVocabularyLevel(response.age)}
                        </p>
                        <p>
                          • <strong>{t("ageTesting.analysis.length")}:</strong>{" "}
                          {t("ageTesting.analysis.words", {
                            count: response.explanation.split(" ").length,
                          })}
                        </p>
                        <p>
                          •{" "}
                          <strong>{t("ageTesting.analysis.sentences")}:</strong>{" "}
                          {t("ageTesting.analysis.sentenceCount", {
                            count: response.explanation.split(".").length - 1,
                          })}
                        </p>
                        <p>
                          •{" "}
                          <strong>
                            {t("ageTesting.analysis.complexity")}:
                          </strong>{" "}
                          {getComplexityLevel(response.age)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {responses.length === 0 && !multipleAgeQuestionsMutation.isPending && (
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("ageTesting.instructions.title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("ageTesting.instructions.description")}
              </p>
              <p className="text-sm text-gray-500">
                {t("ageTesting.instructions.note")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
