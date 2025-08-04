"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { LandingPage } from "./components/LandingPage";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { ParentDashboard } from "./components/ParentDashboard";
import { MainApp } from "./components/MainApp";
import {
  fetchOnboardingStatus,
  determineOnboardingStep,
  getChildContext,
  type OnboardingState,
} from "./lib/onboarding";

type AppState = "landing" | "onboarding" | "dashboard" | "app" | "add-child";

export default function Home() {
  const { data: session, status } = useSession();
  const [appState, setAppState] = useState<AppState>("landing");
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingState, setOnboardingState] =
    useState<OnboardingState | null>(null);

  // Check authentication and onboarding status on mount
  useEffect(() => {
    const checkUserStatus = async () => {
      if (status === "loading") {
        return; // Wait for session to load
      }

      setIsLoading(true);

      if (status === "authenticated") {
        // User is authenticated, check onboarding status
        const state = await fetchOnboardingStatus();
        setOnboardingState(state);
        const step = determineOnboardingStep(true, state);

        if (step === "dashboard") {
          setAppState("dashboard");
        } else {
          setAppState("onboarding");
        }
      } else {
        // User is not authenticated, show landing page
        setAppState("landing");
      }

      setIsLoading(false);
    };

    checkUserStatus();
  }, [session, status]);

  const handleGetStarted = () => {
    setAppState("onboarding");
  };

  const handleOnboardingComplete = async () => {
    // Refresh onboarding state after completion
    if (status === "authenticated") {
      const state = await fetchOnboardingStatus();
      setOnboardingState(state);
    }
    setAppState("dashboard");
  };

  const handleBackToLanding = async () => {
    try {
      await signOut({ redirect: true, redirectTo: "/" });
      // setAppState("landing");
    } catch (error) {
      console.error("Logout error:", error);
      // Even on error, go to landing page
      setAppState("landing");
    }
  };

  const handleStartLearning = () => {
    setAppState("app");
  };

  const handleBackToDashboard = () => {
    setAppState("dashboard");
  };

  const handleAddChild = () => {
    setAppState("add-child");
  };

  const handleAddChildComplete = async () => {
    // Refresh onboarding state and go back to dashboard
    if (status === "authenticated") {
      const state = await fetchOnboardingStatus();
      setOnboardingState(state);
    }
    setAppState("dashboard");
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

  // Render appropriate component based on app state
  switch (appState) {
    case "landing":
      return <LandingPage onGetStarted={handleGetStarted} />;

    case "onboarding":
      return (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onBackToLanding={handleBackToLanding}
        />
      );

    case "dashboard":
      return (
        <ParentDashboard
          onStartLearning={handleStartLearning}
          onLogout={handleBackToLanding}
          onAddChild={handleAddChild}
        />
      );

    case "add-child":
      return (
        <OnboardingFlow
          onComplete={handleAddChildComplete}
          onBackToLanding={handleBackToDashboard}
          startFromChildProfile={true}
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
      return <LandingPage onGetStarted={handleGetStarted} />;
  }
}
