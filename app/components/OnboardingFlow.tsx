"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { LandingPage } from "./LandingPage";
import { ParentRegistration } from "./ParentRegistration";
import { ChildProfileCreation } from "./ChildProfileCreation";
import { DomainSelection } from "./DomainSelection";
import { ParentDashboard } from "./ParentDashboard";
import { MainApp } from "./MainApp";

type OnboardingStep =
  | "landing"
  | "registration"
  | "child-profile"
  | "domain-selection"
  | "dashboard"
  | "app";

interface ChildProfileData {
  id?: string; // Optional ID from database after creation
  displayName: string;
  age: number;
  parentalConsent: boolean;
}

interface ExistingChild {
  id: string;
  displayName: string;
  age: number;
  createdAt: string;
  updatedAt: string;
  domains: Array<{
    domain: {
      id: string;
      name: string;
      description: string;
    };
  }>;
}

export function OnboardingFlow() {
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("landing");
  const [childData, setChildData] = useState<ChildProfileData | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [isCheckingProfiles, setIsCheckingProfiles] = useState(false);
  const [existingChildren, setExistingChildren] = useState<ExistingChild[]>([]);

  // Function to check for existing child profiles
  const checkExistingProfiles = async (retryCount = 0) => {
    if (!session?.user?.id) {
      console.log("No session user ID found");
      return [];
    }

    console.log("Checking existing profiles for user:", session.user.id);
    setIsCheckingProfiles(true);
    try {
      const response = await fetch("/api/child-profiles", {
        method: "GET",
        credentials: "include", // Ensure cookies are included
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Profile check response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Profile check response data:", data);
        console.log("Number of children found:", data.children?.length || 0);
        setExistingChildren(data.children || []);
        return data.children || [];
      } else if (response.status === 401 && retryCount < 2) {
        // Authentication might not be ready yet, retry after a short delay
        console.log("Auth not ready, retrying in 500ms...");
        setIsCheckingProfiles(false);
        await new Promise((resolve) => setTimeout(resolve, 500));
        return checkExistingProfiles(retryCount + 1);
      } else {
        console.error("Profile check failed with status:", response.status);
        const errorData = await response.json().catch(() => ({}));
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error checking existing profiles:", error);
      if (retryCount < 2) {
        console.log("Network error, retrying in 500ms...");
        setIsCheckingProfiles(false);
        await new Promise((resolve) => setTimeout(resolve, 500));
        return checkExistingProfiles(retryCount + 1);
      }
    } finally {
      setIsCheckingProfiles(false);
    }
    return [];
  };

  // Check authentication state and existing profiles on component mount
  useEffect(() => {
    if (status === "loading") {
      // Still loading session, don't change anything yet
      return;
    }

    if (status === "authenticated" && session?.user) {
      console.log("User is authenticated, current step:", currentStep);
      // User is already logged in, check if they have child profiles
      // unless they're already past the landing page
      if (currentStep === "landing") {
        console.log("On landing page, checking existing profiles...");
        checkExistingProfiles().then((children) => {
          console.log("Profile check completed, children:", children);
          if (children && children.length > 0) {
            console.log("Found existing children, going to dashboard");
            // User has existing child profiles, take them to dashboard
            setCurrentStep("dashboard");
            // Set up the context from the first child for now
            const firstChild = children[0];
            console.log("Setting up context for first child:", firstChild);
            setChildData({
              id: firstChild.id,
              displayName: firstChild.displayName,
              age: firstChild.age,
              parentalConsent: true, // Assumed true since profile exists
            });
            setSelectedDomains(
              firstChild.domains.map(
                (d: ExistingChild["domains"][0]) => d.domain.name
              )
            );
          } else {
            console.log(
              "No existing children found, going to child profile creation"
            );
            // User has no child profiles, take them to child profile creation
            setCurrentStep("child-profile");
          }
        });
      }
    } else if (status === "unauthenticated") {
      // User is not logged in, ensure they start at landing
      // This will also handle the case when user logs out
      if (currentStep !== "landing" && currentStep !== "registration") {
        setCurrentStep("landing");
        setChildData(null);
        setSelectedDomains([]);
        setExistingChildren([]);
      }
    }
  }, [session, status, currentStep]);

  const handleGetStarted = () => {
    if (session?.user) {
      // User is already logged in, check for existing profiles
      checkExistingProfiles().then((children) => {
        if (children && children.length > 0) {
          setCurrentStep("dashboard");
        } else {
          setCurrentStep("child-profile");
        }
      });
    } else {
      // User needs to register/login
      setCurrentStep("registration");
    }
  };

  const handleRegistrationBack = () => {
    setCurrentStep("landing");
  };

  const handleRegistrationSuccess = () => {
    // After successful registration/login, check for existing profiles
    console.log("Registration successful, checking for existing profiles...");
    checkExistingProfiles().then((children) => {
      if (children && children.length > 0) {
        console.log("Found existing children after login, going to dashboard");
        setCurrentStep("dashboard");
        // Set up the context from the first child
        const firstChild = children[0];
        setChildData({
          id: firstChild.id,
          displayName: firstChild.displayName,
          age: firstChild.age,
          parentalConsent: true,
        });
        setSelectedDomains(
          firstChild.domains.map(
            (d: ExistingChild["domains"][0]) => d.domain.name
          )
        );
      } else {
        console.log(
          "No existing children after login, going to child profile creation"
        );
        setCurrentStep("child-profile");
      }
    });
  };

  const handleChildProfileBack = () => {
    if (session?.user) {
      // If user is logged in and goes back from child profile creation,
      // check if they have existing profiles to determine where to go
      checkExistingProfiles().then((children) => {
        if (children && children.length > 0) {
          setCurrentStep("dashboard");
        } else {
          setCurrentStep("registration");
        }
      });
    } else {
      setCurrentStep("registration");
    }
  };

  const handleChildProfileComplete = (data: ChildProfileData) => {
    setChildData(data);
    setCurrentStep("domain-selection");
  };

  const handleDomainSelectionBack = () => {
    setCurrentStep("child-profile");
  };

  const handleDomainSelectionComplete = (domains: string[]) => {
    setSelectedDomains(domains);
    setCurrentStep("dashboard");
  };

  const handleStartLearning = () => {
    setCurrentStep("app");
  };

  const handleLogout = async () => {
    try {
      // Sign out using NextAuth
      await signOut({ redirect: false });

      // Reset local state
      setCurrentStep("landing");
      setChildData(null);
      setSelectedDomains([]);
      setExistingChildren([]);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, reset the local state to be safe
      setCurrentStep("landing");
      setChildData(null);
      setSelectedDomains([]);
      setExistingChildren([]);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentStep("dashboard");
  };

  // Show loading state while checking authentication or existing profiles
  if (
    status === "loading" ||
    (status === "authenticated" &&
      isCheckingProfiles &&
      currentStep === "landing")
  ) {
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
    case "landing":
      return <LandingPage onGetStarted={handleGetStarted} />;

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
      return (
        <MainApp
          onBackToDashboard={handleBackToDashboard}
          childContext={
            childData
              ? {
                  age: childData.age,
                  name: childData.displayName,
                  selectedDomains: selectedDomains,
                }
              : undefined
          }
        />
      );

    default:
      return <LandingPage onGetStarted={handleGetStarted} />;
  }
}
