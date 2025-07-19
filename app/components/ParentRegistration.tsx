"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TreePine,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

interface ParentRegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

interface FormData {
  parentName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

interface FormErrors {
  parentName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
  privacyAccepted?: string;
}

export function ParentRegistration({
  onBack,
  onSuccess,
}: ParentRegistrationProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    parentName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    privacyAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Parent name validation
    if (!formData.parentName.trim()) {
      newErrors.parentName = t("parentRegistration.errors.parentName.required");
    } else if (formData.parentName.trim().length < 2) {
      newErrors.parentName = t(
        "parentRegistration.errors.parentName.minLength"
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t("parentRegistration.errors.email.required");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("parentRegistration.errors.email.invalid");
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t("parentRegistration.errors.password.required");
    } else if (formData.password.length < 8) {
      newErrors.password = t("parentRegistration.errors.password.minLength");
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = t("parentRegistration.errors.password.strength");
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t(
        "parentRegistration.errors.confirmPassword.required"
      );
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t(
        "parentRegistration.errors.confirmPassword.match"
      );
    }

    // Legal acceptance validation
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = t("parentRegistration.errors.termsAccepted");
    }
    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = t(
        "parentRegistration.errors.privacyAccepted"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real implementation, this would be an actual API call
      console.log("Registration data:", formData);

      // Simulate success
      onSuccess();
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle registration error
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4 parent-interface">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={onBack}
            className="absolute left-4 top-4 sm:relative sm:left-0 sm:top-0 mb-4 text-parent-sm font-medium transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("parentRegistration.backButton")}
          </Button>

          <div className="flex items-center justify-center gap-3 mb-4">
            <TreePine className="h-8 w-8 text-primary" />
            <h1 className="text-parent-3xl font-semibold text-primary">
              {t("parentRegistration.title")}
            </h1>
          </div>
          <p className="text-parent-lg text-muted-foreground">
            {t("parentRegistration.subtitle")}
          </p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl border-2 border-primary/20 animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
            <CardTitle className="text-parent-xl font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              {t("parentRegistration.formTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Parent Name */}
              <div className="space-y-2">
                <label
                  htmlFor="parentName"
                  className="text-parent-sm font-medium text-gray-700"
                >
                  {t("parentRegistration.labels.parentName")}
                </label>
                <Input
                  id="parentName"
                  type="text"
                  value={formData.parentName}
                  onChange={(e) =>
                    handleInputChange("parentName", e.target.value)
                  }
                  placeholder={t("parentRegistration.placeholders.parentName")}
                  className={`text-parent-base transition-all duration-200 focus:scale-105 ${
                    errors.parentName
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                {errors.parentName && (
                  <p className="text-parent-xs text-red-600 flex items-center gap-1 animate-slide-in-left">
                    <AlertCircle className="h-3 w-3" />
                    {errors.parentName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-parent-sm font-medium text-gray-700"
                >
                  {t("parentRegistration.labels.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t("parentRegistration.placeholders.email")}
                  className={`text-parent-base transition-all duration-200 focus:scale-105 ${
                    errors.email ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-parent-xs text-red-600 flex items-center gap-1 animate-slide-in-left">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-parent-sm font-medium text-gray-700"
                >
                  {t("parentRegistration.labels.password")}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder={t("parentRegistration.placeholders.password")}
                    className={`text-parent-base pr-10 transition-all duration-200 focus:scale-105 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded transition-all duration-300 ${
                            level <= passwordStrength
                              ? level <= 2
                                ? "bg-red-500"
                                : level <= 3
                                ? "bg-yellow-500"
                                : level <= 4
                                ? "bg-blue-500"
                                : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-parent-xs text-gray-600">
                      {t("parentRegistration.passwordStrength.label")}{" "}
                      <span
                        className={`font-medium ${
                          passwordStrength <= 2
                            ? "text-red-600"
                            : passwordStrength <= 3
                            ? "text-yellow-600"
                            : passwordStrength <= 4
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      >
                        {passwordStrength <= 2
                          ? t("parentRegistration.passwordStrength.weak")
                          : passwordStrength <= 3
                          ? t("parentRegistration.passwordStrength.fair")
                          : passwordStrength <= 4
                          ? t("parentRegistration.passwordStrength.good")
                          : t("parentRegistration.passwordStrength.strong")}
                      </span>
                    </p>
                  </div>
                )}

                {errors.password && (
                  <p className="text-parent-xs text-red-600 flex items-center gap-1 animate-slide-in-left">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-parent-sm font-medium text-gray-700"
                >
                  {t("parentRegistration.labels.confirmPassword")}
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder={t(
                      "parentRegistration.placeholders.confirmPassword"
                    )}
                    className={`text-parent-base pr-10 transition-all duration-200 focus:scale-105 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <p className="text-parent-xs text-green-600 flex items-center gap-1 animate-slide-in-left">
                      <CheckCircle className="h-3 w-3" />
                      {t("parentRegistration.passwordsMatch")}
                    </p>
                  )}
                {errors.confirmPassword && (
                  <p className="text-parent-xs text-red-600 flex items-center gap-1 animate-slide-in-left">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Legal Agreements */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="text-sm text-blue-800">
                      <h4 className="font-medium mb-2">
                        {t("parentRegistration.legal.title")}
                      </h4>
                      <p className="leading-relaxed">
                        <Trans
                          i18nKey="parentRegistration.legal.description"
                          components={{
                            strong: <strong />,
                          }}
                        />
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={(e) =>
                        handleInputChange("termsAccepted", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label
                      htmlFor="termsAccepted"
                      className="text-sm text-gray-700"
                    >
                      <Trans
                        i18nKey="parentRegistration.labels.terms"
                        components={{
                          a: (
                            <a
                              href="/legal/terms"
                              className="text-primary hover:underline"
                            />
                          ),
                        }}
                      />{" "}
                      <a
                        href="/legal/terms"
                        className="text-primary hover:underline"
                      >
                        {t("parentRegistration.links.terms")}
                      </a>
                    </label>
                  </div>
                  {errors.termsAccepted && (
                    <p className="text-parent-xs text-red-600 flex items-center gap-1 ml-7 animate-slide-in-left">
                      <AlertCircle className="h-3 w-3" />
                      {errors.termsAccepted}
                    </p>
                  )}

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacyAccepted"
                      checked={formData.privacyAccepted}
                      onChange={(e) =>
                        handleInputChange("privacyAccepted", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label
                      htmlFor="privacyAccepted"
                      className="text-sm text-gray-700"
                    >
                      <Trans
                        i18nKey="parentRegistration.labels.privacy"
                        components={{
                          a: (
                            <a
                              href="/legal/privacy"
                              className="text-primary hover:underline"
                            />
                          ),
                        }}
                      />{" "}
                      <a
                        href="/legal/privacy"
                        className="text-primary hover:underline"
                      >
                        {t("parentRegistration.links.privacy")}
                      </a>
                    </label>
                  </div>
                  {errors.privacyAccepted && (
                    <p className="text-parent-xs text-red-600 flex items-center gap-1 ml-7 animate-slide-in-left">
                      <AlertCircle className="h-3 w-3" />
                      {errors.privacyAccepted}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white text-parent-base font-medium py-3 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t("parentRegistration.buttons.creatingAccount")}
                  </div>
                ) : (
                  t("parentRegistration.buttons.createAccount")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div
          className="mt-6 text-center animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="text-parent-xs text-gray-500">
            <Trans
              i18nKey="parentRegistration.securityNote"
              components={{
                strong: <strong />,
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}
