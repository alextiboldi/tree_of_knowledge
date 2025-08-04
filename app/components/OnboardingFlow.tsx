"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { ParentRegistration } from "./ParentRegistration";
import { ChildProfileCreation } from "./ChildProfileCreation";
import { DomainSelection } from "./DomainSelection";
import { ParentDashboard } from "./ParentDashboard";
import { MainApp } from "./MainApp";
import {
  fetchOnboardingStatus,
  determineOnboardingStep,
  getChildContext,
  type OnboardingStep,
  type OnboardingState,
  type ChildProfileData,
} from "@/app/lib/onboarding";

interface OnboardingFlowProps {
  onComplete: () => void;
  onBackToLanding: () => void;
  startFromChildProfile?: boolean;
}

export function OnboardingFlow({
  onComplete,
  onBackToLanding,
  startFromChildProfile = false,
}: OnboardingFlowProps) {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] =
    useState<OnboardingStep>("registration");
  const [onboardingState, setOnboardingState] =
    useState<OnboardingState | null>(null);
  const [childData, setChildData] = useState<ChildProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the onboarding flow based on authentication and onboarding status
  useEffect(() => {
    const initializeOnboarding = async () => {
      if (status === "loading") {
        return; // Wait for session to load
      }

      setIsLoading(true);

      if (status === "authenticated") {
        // Fetch onboarding status for authenticated users
        const state = await fetchOnboardingStatus();
        setOnboardingState(state);

        // If we're adding a new child, skip to child profile creation
        if (startFromChildProfile) {
          setCurrentStep("child-profile");
        } else {
          // Determine the appropriate step (excluding landing and dashboard)
          const step = determineOnboardingStep(true, state);
          if (step === "dashboard") {
            // User has completed onboarding, notify parent component
            onComplete();
            return;
          } else if (step === "landing") {
            // Shouldn't happen in onboarding flow, default to child profile
            setCurrentStep("child-profile");
          } else {
            setCurrentStep(step);
          }
        }

        // Set up child context if available (only for editing existing children)
        if (!startFromChildProfile) {
          const context = getChildContext(state);
          if (context) {
            setChildData({
              id: context.id,
              displayName: context.name,
              age: context.age,
              parentalConsent: true,
            });
          }
        }
      } else {
        // User is not authenticated, start with registration
        setCurrentStep("registration");
        setOnboardingState(null);
        setChildData(null);
      }

      setIsLoading(false);
    };

    initializeOnboarding();
  }, [session, status, onComplete]);

  // Refresh onboarding state after changes
  const refreshOnboardingState = async () => {
    if (status === "authenticated") {
      const state = await fetchOnboardingStatus();
      setOnboardingState(state);
      return state;
    }
    return null;
  };

  // Navigation handlers
  const handleRegistrationBack = () => {
    onBackToLanding();
  };

  const handleRegistrationSuccess = async () => {
    // After successful registration/login, refresh onboarding status
    const state = await refreshOnboardingState();
    const step = determineOnboardingStep(true, state);

    if (step === "dashboard") {
      onComplete();
    } else if (step === "landing") {
      setCurrentStep("child-profile");
    } else {
      setCurrentStep(step);
    }
  };

  const handleChildProfileBack = () => {
    // If we're adding a child from dashboard, go back to dashboard
    if (startFromChildProfile) {
      onComplete(); // Go back to dashboard
    } else {
      // If going back from child profile, either go to dashboard (if they have other children) or registration
      if (
        onboardingState?.children.length &&
        onboardingState.children.length > 0
      ) {
        onComplete(); // Go to dashboard
      } else {
        setCurrentStep("registration");
      }
    }
  };

  const handleChildProfileComplete = (data: ChildProfileData) => {
    setChildData(data);
    setCurrentStep("domain-selection");
  };

  const handleDomainSelectionBack = () => {
    setCurrentStep("child-profile");
  };

  const handleDomainSelectionComplete = async () => {
    // After domain selection, refresh state and complete onboarding
    await refreshOnboardingState();
    onComplete();
  };

  const handleStartLearning = () => {
    setCurrentStep("app");
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      onBackToLanding();
    } catch (error) {
      console.error("Logout error:", error);
      onBackToLanding();
    }
  };

  const handleBackToDashboard = () => {
    onComplete();
  };

  // Show loading state
  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate component based on current step
  switch (currentStep) {
    case "registration":
      return (
        <ParentRegistration
          onBack={handleRegistrationBack}
          onSuccess={handleRegistrationSuccess}
        />
      );

    case "child-profile":
      return (
        <ChildProfileCreation
          onBack={handleChildProfileBack}
          onComplete={handleChildProfileComplete}
        />
      );

    case "domain-selection":
      return (
        <DomainSelection
          childName={childData?.displayName || "Your Child"}
          childId={childData?.id}
          onBack={handleDomainSelectionBack}
          onComplete={handleDomainSelectionComplete}
        />
      );

    case "dashboard":
      return (
        <ParentDashboard
          onStartLearning={handleStartLearning}
          onLogout={handleLogout}
        />
      );

    case "app":
      const childContext = getChildContext(onboardingState);
      return (
        <MainApp
          onBackToDashboard={handleBackToDashboard}
          childContext={childContext}
        />
      );

    default:
      return (
        <ParentRegistration
          onBack={handleRegistrationBack}
          onSuccess={handleRegistrationSuccess}
        />
      );
  }
}
