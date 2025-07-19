"use client";

import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TreePine,
  Brain,
  Heart,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
interface DomainSelectionProps {
  childName: string;
  childId?: string;
  onComplete: (selectedDomains: string[]) => void;
  onBack: () => void;
}

interface Domain {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
  examples: string[];
  ageAppropriate: string;
}

export function DomainSelection({
  childName,
  childId,
  onComplete,
  onBack,
}: DomainSelectionProps) {
  const { t } = useTranslation();
  const domains: Domain[] = [
    {
      id: "science-technology",
      name: t("domainSelection.domains.science.name"),
      description: t("domainSelection.domains.science.description"),
      icon: Brain,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      examples: [
        t("domainSelection.domains.science.examples.1"),
        t("domainSelection.domains.science.examples.2"),
        t("domainSelection.domains.science.examples.3"),
      ],
      ageAppropriate: t("domainSelection.domains.science.ageAppropriate"),
    },
    {
      id: "nature-environment",
      name: t("domainSelection.domains.nature.name"),
      description: t("domainSelection.domains.nature.description"),
      icon: Heart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      examples: [
        t("domainSelection.domains.nature.examples.1"),
        t("domainSelection.domains.nature.examples.2"),
        t("domainSelection.domains.nature.examples.3"),
      ],
      ageAppropriate: t("domainSelection.domains.nature.ageAppropriate"),
    },
    {
      id: "math-logic",
      name: t("domainSelection.domains.math.name"),
      description: t("domainSelection.domains.math.description"),
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      examples: [
        t("domainSelection.domains.math.examples.1"),
        t("domainSelection.domains.math.examples.2"),
        t("domainSelection.domains.math.examples.3"),
      ],
      ageAppropriate: t("domainSelection.domains.math.ageAppropriate"),
    },
  ];

  // All domains selected by default as per PRD
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    domains.map((domain) => domain.id)
  );
  const [isLoading, setIsLoading] = useState(false);

  const toggleDomain = (domainId: string) => {
    setSelectedDomains((prev) => {
      if (prev.includes(domainId)) {
        // Don't allow deselecting if it's the last domain
        if (prev.length === 1) {
          return prev;
        }
        return prev.filter((id) => id !== domainId);
      } else {
        return [...prev, domainId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedDomains.length === 0 || !childId) {
      return;
    }

    setIsLoading(true);

    try {
      // Call the domain selection API
      const response = await fetch(`/api/child-profiles/${childId}/domains`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: selectedDomains }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Domain selection failed:", data.error);
        // For now, continue anyway - this is non-critical for the onboarding flow
      } else {
        console.log("Domain selection successful:", data);
      }

      onComplete(selectedDomains);
    } catch (error) {
      console.error("Domain selection error:", error);
      // Continue with onboarding even if domain selection fails
      onComplete(selectedDomains);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            {t("domainSelection.backButton")}
          </Button>

          <div className="flex items-center justify-center gap-3 mb-4">
            <TreePine className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold text-primary">
              {t("domainSelection.title")}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("domainSelection.subtitle", { name: childName })}
          </p>
        </div>

        {/* Domain Selection Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {domains.map((domain) => {
            const isSelected = selectedDomains.includes(domain.id);
            const Icon = domain.icon;

            return (
              <Card
                key={domain.id}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isSelected
                    ? `${domain.borderColor} border-2 shadow-lg ${domain.bgColor}`
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
                onClick={() => toggleDomain(domain.id)}
              >
                <CardHeader className="text-center pb-3">
                  <div className="relative">
                    <div
                      className={`${domain.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3`}
                    >
                      <Icon className={`h-8 w-8 ${domain.color}`} />
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl">{domain.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    {domain.description}
                  </p>

                  <div className="text-sm text-gray-500">
                    <p className="italic mb-2">{domain.ageAppropriate}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      {t("domainSelection.exampleQuestions")}
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {domain.examples.map((example, index) => (
                        <li key={index} className="italic">
                          • "{example}"
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={`mt-4 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? `${domain.color} ${domain.bgColor} border ${domain.borderColor}`
                        : "text-gray-500 bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {isSelected
                      ? t("domainSelection.selected")
                      : t("domainSelection.select")}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selection Summary */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t("domainSelection.summary.title", { name: childName })}
            </h3>
            {selectedDomains.length > 0 ? (
              <div className="space-y-3">
                <p className="text-gray-700">
                  <Trans
                    i18nKey="domainSelection.summary.description"
                    values={{
                      name: childName,
                      count: selectedDomains.length,
                    }}
                    components={{
                      strong: <strong />,
                    }}
                  />
                </p>
                <ul className="space-y-2">
                  {selectedDomains.map((domainId) => {
                    const domain = domains.find((d) => d.id === domainId);
                    if (!domain) return null;
                    const Icon = domain.icon;
                    return (
                      <li key={domainId} className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${domain.color}`} />
                        <span className="font-medium">{domain.name}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 mt-4">
                  <p className="text-sm text-emerald-700">
                    <Trans
                      i18nKey="domainSelection.summary.remember.description"
                      values={{ name: childName }}
                      components={{
                        strong: (
                          <strong>
                            {t("domainSelection.summary.remember.title")}
                          </strong>
                        ),
                      }}
                    />
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                {t("domainSelection.summary.noSelection", { name: childName })}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSubmit}
            disabled={selectedDomains.length === 0 || isLoading}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                {t("domainSelection.buttons.settingUp", { name: childName })}
              </>
            ) : (
              <>
                <TreePine className="h-5 w-5 mr-2" />
                {t("domainSelection.buttons.startAdventure", {
                  name: childName,
                })}
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Brain className="h-6 w-6 text-blue-600 mt-1" />
            <div className="text-sm text-blue-800">
              <h4 className="font-medium mb-2">
                {t("domainSelection.info.title")}
              </h4>
              <p className="leading-relaxed">
                {t("domainSelection.info.description", { name: childName })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
