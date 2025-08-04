"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TreePine,
  Heart,
  Shield,
  Baby,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { useCreateChild } from "../hooks/useApi";
import { ChildProfileData, ApiError } from "../lib/api";

interface ChildProfileCreationProps {
  onComplete: (childData: ChildProfileData) => void;
  onBack: () => void;
}

interface FormErrors {
  displayName?: string;
  age?: string;
  parentalConsent?: string;
}

export function ChildProfileCreation({
  onComplete,
  onBack,
}: ChildProfileCreationProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ChildProfileData>({
    displayName: "",
    age: 0,
    parentalConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const createChildMutation = useCreateChild({
    onSuccess: (data) => {
      console.log("Child profile created successfully:", data);
      // Pass the child data to the parent component
      onComplete({
        ...formData,
        id: data.child.id, // Include the database ID
      });
    },
    onError: (error: ApiError) => {
      console.error("Child profile creation error:", error);

      // Handle specific error cases
      if (error.status === 401) {
        setErrors({
          displayName: t("childProfileCreation.errors.authentication"),
        });
      } else if (error.status === 400) {
        // Server-side validation errors
        if (error.data?.error?.includes("Display name")) {
          setErrors({
            displayName: error.data.error,
          });
        } else if (error.data?.error?.includes("Age")) {
          setErrors({
            age: error.data.error,
          });
        } else if (error.data?.error?.includes("consent")) {
          setErrors({
            parentalConsent: error.data.error,
          });
        } else {
          setErrors({
            displayName:
              error.data?.error || t("childProfileCreation.errors.generic"),
          });
        }
      } else {
        // Generic error handling
        setErrors({
          displayName:
            error.message || t("childProfileCreation.errors.generic"),
        });
      }
    },
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = t(
        "childProfileCreation.errors.displayName.required"
      );
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = t(
        "childProfileCreation.errors.displayName.minLength"
      );
    } else if (formData.displayName.trim().length > 20) {
      newErrors.displayName = t(
        "childProfileCreation.errors.displayName.maxLength"
      );
    } else if (!/^[a-zA-Z\s]+$/.test(formData.displayName.trim())) {
      newErrors.displayName = t(
        "childProfileCreation.errors.displayName.invalid"
      );
    }

    // Age validation
    if (!formData.age || formData.age < 5) {
      newErrors.age = t("childProfileCreation.errors.age.min");
    } else if (formData.age > 15) {
      newErrors.age = t("childProfileCreation.errors.age.max");
    }

    // Parental consent validation
    if (!formData.parentalConsent) {
      newErrors.parentalConsent = t(
        "childProfileCreation.errors.parentalConsent"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clear any previous errors
    setErrors({});

    // Trigger the mutation
    createChildMutation.mutate({
      displayName: formData.displayName.trim(),
      age: formData.age,
      parentalConsent: formData.parentalConsent,
    });
  };

  const handleInputChange = (
    field: keyof Omit<ChildProfileData, "id">,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getAgeGroup = (age: number) => {
    if (age >= 5 && age <= 7) return "earlyElementary";
    if (age >= 8 && age <= 10) return "elementary";
    if (age >= 11 && age <= 13) return "middleSchool";
    if (age >= 14 && age <= 15) return "earlyHighSchool";
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            {t("childProfileCreation.backButton")}
          </Button>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold text-primary">
              {t("childProfileCreation.title")}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            {t("childProfileCreation.subtitle")}
          </p>
        </div>

        {/* Child Profile Form */}
        <Card className="shadow-lg border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-primary" />
              {t("childProfileCreation.formTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Display Name */}
              <div className="space-y-2">
                <label
                  htmlFor="displayName"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("childProfileCreation.labels.displayName")}
                </label>
                <Input
                  id="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                  placeholder={t(
                    "childProfileCreation.placeholders.displayName"
                  )}
                  className={errors.displayName ? "border-red-500" : ""}
                  maxLength={20}
                />
                <p className="text-xs text-gray-500">
                  {t("childProfileCreation.notes.displayName")}
                </p>
                {errors.displayName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.displayName}
                  </p>
                )}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label
                  htmlFor="age"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("childProfileCreation.labels.age")}
                </label>
                <div className="flex gap-4">
                  <Input
                    id="age"
                    type="number"
                    min="5"
                    max="15"
                    value={formData.age || ""}
                    onChange={(e) =>
                      handleInputChange("age", parseInt(e.target.value) || 0)
                    }
                    placeholder={t("childProfileCreation.placeholders.age")}
                    className={`w-24 ${errors.age ? "border-red-500" : ""}`}
                  />
                  {formData.age >= 5 && formData.age <= 15 && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        {t(
                          `childProfileCreation.ageGroups.${getAgeGroup(
                            formData.age
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "")}`
                        )}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {t("childProfileCreation.notes.age")}
                </p>
                {errors.age && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.age}
                  </p>
                )}
              </div>

              {/* Age-Appropriate Content Preview */}
              {formData.age >= 5 && formData.age <= 15 && (
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg border border-emerald-200">
                  <h3 className="font-medium text-emerald-800 mb-2">
                    {t("childProfileCreation.agePreview.title", {
                      name:
                        formData.displayName ||
                        t("childProfileCreation.agePreview.yourChild"),
                    })}
                  </h3>
                  <div className="text-sm text-emerald-700 space-y-1">
                    {formData.age >= 5 && formData.age <= 7 && (
                      <>
                        <p>
                          •{" "}
                          {t(
                            "childProfileCreation.agePreview.earlyElementary.1"
                          )}
                        </p>
                        <p>
                          •{" "}
                          {t(
                            "childProfileCreation.agePreview.earlyElementary.2"
                          )}
                        </p>
                        <p>
                          •{" "}
                          {t(
                            "childProfileCreation.agePreview.earlyElementary.3"
                          )}
                        </p>
                      </>
                    )}
                    {formData.age >= 8 && formData.age <= 10 && (
                      <>
                        <p>
                          • {t("childProfileCreation.agePreview.elementary.1")}
                        </p>
                        <p>
                          • {t("childProfileCreation.agePreview.elementary.2")}
                        </p>
                        <p>
                          • {t("childProfileCreation.agePreview.elementary.3")}
                        </p>
                      </>
                    )}
                    {formData.age >= 11 && formData.age <= 13 && (
                      <>
                        <p>
                          •{" "}
                          {t("childProfileCreation.agePreview.middleSchool.1")}
                        </p>
                        <p>
                          •{" "}
                          {t("childProfileCreation.agePreview.middleSchool.2")}
                        </p>
                        <p>
                          •{" "}
                          {t("childProfileCreation.agePreview.middleSchool.3")}
                        </p>
                      </>
                    )}
                    {formData.age >= 14 && formData.age <= 15 && (
                      <>
                        <p>
                          •{" "}
                          {t(
                            "childProfileCreation.agePreview.earlyHighSchool.1"
                          )}
                        </p>
                        <p>
                          •{" "}
                          {t(
                            "childProfileCreation.agePreview.earlyHighSchool.2"
                          )}
                        </p>
                        <p>
                          •{" "}
                          {t(
                            "childProfileCreation.agePreview.earlyHighSchool.3"
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Parental Consent */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-2">
                        {t("childProfileCreation.parentalConsent.title")}
                      </p>
                      <p className="leading-relaxed">
                        {t("childProfileCreation.parentalConsent.description")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="parentalConsent"
                    checked={formData.parentalConsent}
                    onChange={(e) =>
                      handleInputChange("parentalConsent", e.target.checked)
                    }
                    className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label
                    htmlFor="parentalConsent"
                    className="text-sm text-gray-700"
                  >
                    <Trans
                      i18nKey="childProfileCreation.labels.parentalConsent.text"
                      values={{
                        name:
                          formData.displayName ||
                          t(
                            "childProfileCreation.labels.parentalConsent.thisChild"
                          ),
                      }}
                      components={{
                        strong: (
                          <strong>
                            {t(
                              "childProfileCreation.labels.parentalConsent.strong"
                            )}
                          </strong>
                        ),
                      }}
                    />
                  </label>
                </div>

                {errors.parentalConsent && (
                  <p className="text-sm text-red-600 flex items-center gap-1 ml-7">
                    <AlertCircle className="h-4 w-4" />
                    {errors.parentalConsent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={createChildMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {createChildMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    {t("childProfileCreation.buttons.creatingProfile")}
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2" />
                    {t("childProfileCreation.buttons.createProfile", {
                      name: formData.displayName
                        ? `${formData.displayName}'s`
                        : t("childProfileCreation.buttons.child"),
                    })}
                  </>
                )}
              </Button>
            </form>

            {/* Privacy Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">
                    {t("childProfileCreation.privacyNotice.title")}
                  </p>
                  <p>
                    <Trans
                      i18nKey="childProfileCreation.privacyNotice.description"
                      components={{
                        strong: <strong />,
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
