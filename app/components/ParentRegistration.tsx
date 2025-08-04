"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
import { useRegister } from "../hooks/useApi";
import { ApiError } from "../lib/api";

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
  const [isLoginMode, setIsLoginMode] = useState(false);
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

  const registerMutation = useRegister({
    onSuccess: async (data) => {
      console.log("Registration successful:", data);

      // Automatically sign in the user
      try {
        const signInResult = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.error) {
          console.error("Auto sign-in failed:", signInResult.error);
          // Still call onSuccess as registration was successful
          // User can manually sign in later
        }

        onSuccess();
      } catch (error) {
        console.error("Auto sign-in error:", error);
        onSuccess(); // Continue with onboarding
      }
    },
    onError: (error: ApiError) => {
      console.error("Registration failed:", error);

      // Handle specific error cases
      if (error.status === 409) {
        setErrors({ email: t("parentRegistration.errors.email.exists") });
      } else {
        // Generic error handling
        setErrors({
          email: error.message || t("parentRegistration.errors.generic"),
        });
      }
    },
  });

  // Computed loading state - true if either login (isLoading) or register mutation is pending
  const isSubmitting = isLoading || registerMutation.isPending;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation (always required)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t("parentRegistration.errors.email.required");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("parentRegistration.errors.email.invalid");
    }

    // Password validation (always required)
    if (!formData.password) {
      newErrors.password = t("parentRegistration.errors.password.required");
    } else if (!isLoginMode && formData.password.length < 8) {
      newErrors.password = t("parentRegistration.errors.password.minLength");
    } else if (
      !isLoginMode &&
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)
    ) {
      newErrors.password = t("parentRegistration.errors.password.strength");
    }

    // Registration-only validations
    if (!isLoginMode) {
      // Parent name validation
      if (!formData.parentName.trim()) {
        newErrors.parentName = t(
          "parentRegistration.errors.parentName.required"
        );
      } else if (formData.parentName.trim().length < 2) {
        newErrors.parentName = t(
          "parentRegistration.errors.parentName.minLength"
        );
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

      // Terms and privacy validation
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = t("parentRegistration.errors.terms.required");
      }

      if (!formData.privacyAccepted) {
        newErrors.privacyAccepted = t(
          "parentRegistration.errors.privacy.required"
        );
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setErrors({
          email: t("parentRegistration.errors.login.invalid"),
        });
        return;
      }

      onSuccess();
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({
        email: t("parentRegistration.errors.network"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = (): void => {
    if (!validateForm()) {
      return;
    }

    // Clear any previous errors
    setErrors({});

    // Trigger the registration mutation
    registerMutation.mutate({
      email: formData.email,
      password: formData.password,
      name: formData.parentName,
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (isLoginMode) {
      await handleLogin();
    } else {
      handleRegister();
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

  const strengthColors = [
    "",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];
  const strengthLabels = ["", "Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4 parent-interface">
      <div className="max-w-md mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 text-parent-sm font-medium transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("parentRegistration.buttons.back")}
          </Button>
          <div className="flex items-center gap-2">
            <TreePine className="h-6 w-6 text-primary" />
            <span className="text-parent-lg font-semibold text-primary">
              {t("parentRegistration.title")}
            </span>
          </div>
        </div>

        {/* Main Registration Card */}
        <Card
          className="w-full shadow-lg animate-scale-in border-primary/10"
          style={{ animationDelay: "0.1s" }}
        >
          <CardHeader className="text-center bg-gradient-to-r from-primary to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-parent-xl font-bold tracking-wider">
              {isLoginMode
                ? t("parentRegistration.welcome.loginTitle")
                : t("parentRegistration.welcome.title")}
            </CardTitle>
            <p className="text-parent-sm text-white/90 mt-2">
              {isLoginMode
                ? t("parentRegistration.welcome.loginSubtitle")
                : t("parentRegistration.welcome.subtitle")}
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mode Toggle */}
              <div className="text-center mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setIsLoginMode(false)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      !isLoginMode
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLoginMode(true)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isLoginMode
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* Parent Name (Registration only) */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <label
                    htmlFor="parentName"
                    className="text-parent-sm font-medium text-gray-700"
                  >
                    {t("parentRegistration.labels.parentName")} *
                  </label>
                  <Input
                    id="parentName"
                    type="text"
                    value={formData.parentName}
                    onChange={(e) =>
                      handleInputChange("parentName", e.target.value)
                    }
                    placeholder={t(
                      "parentRegistration.placeholders.parentName"
                    )}
                    className={`text-parent-sm ${
                      errors.parentName
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.parentName && (
                    <p className="text-parent-xs text-red-600 flex items-center gap-1 animate-slide-in-left">
                      <AlertCircle className="h-3 w-3" />
                      {errors.parentName}
                    </p>
                  )}
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-parent-sm font-medium text-gray-700"
                >
                  {t("parentRegistration.labels.email")} *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t("parentRegistration.placeholders.email")}
                  className={`text-parent-sm ${
                    errors.email ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  disabled={isSubmitting}
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
                  {t("parentRegistration.labels.password")} *
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
                    className={`text-parent-sm pr-10 ${
                      errors.password ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-parent-xs text-red-600 flex items-center gap-1 animate-slide-in-left">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}

                {/* Password Strength Indicator (Registration only) */}
                {!isLoginMode && formData.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            level <= passwordStrength
                              ? strengthColors[passwordStrength]
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-parent-xs text-gray-600">
                      {t("parentRegistration.passwordStrength.label")}:{" "}
                      <span
                        className={`font-medium ${
                          passwordStrength >= 4
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {strengthLabels[passwordStrength] || "Very Weak"}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password (Registration only) */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-parent-sm font-medium text-gray-700"
                  >
                    {t("parentRegistration.labels.confirmPassword")} *
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
                      className={`text-parent-sm pr-10 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-parent-xs text-red-600 flex items-center gap-1 animate-slide-in-left">
                      <AlertCircle className="h-3 w-3" />
                      {errors.confirmPassword}
                    </p>
                  )}

                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="flex items-center gap-2 text-parent-xs">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">
                            {t("parentRegistration.passwordMatch.success")}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-orange-600" />
                          <span className="text-orange-600">
                            {t("parentRegistration.passwordMatch.mismatch")}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Terms and Privacy (Registration only) */}
              {!isLoginMode && (
                <div className="space-y-3 pt-2">
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
                        />
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
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white text-parent-base font-medium py-3 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isLoginMode
                      ? t("parentRegistration.buttons.signingIn")
                      : t("parentRegistration.buttons.creatingAccount")}
                  </div>
                ) : isLoginMode ? (
                  t("parentRegistration.buttons.signIn")
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
