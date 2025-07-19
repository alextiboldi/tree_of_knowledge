'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LandingPage } from './LandingPage';
import { ParentRegistration } from './ParentRegistration';
import { ChildProfileCreation } from './ChildProfileCreation';
import { DomainSelection } from './DomainSelection';
import { ParentDashboard } from './ParentDashboard';
import { MainApp } from './MainApp';

type OnboardingStep =
  | "landing"
  | "registration"
  | "child-profile"
  | "domain-selection"
  | "dashboard"
  | "app";

interface ChildProfileData {
  displayName: string;
  age: number;
  parentalConsent: boolean;
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("landing");
  const [childData, setChildData] = useState<ChildProfileData | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const handleGetStarted = () => {
    setCurrentStep("registration");
  };

  const handleRegistrationBack = () => {
    setCurrentStep("landing");
  };

  const handleRegistrationSuccess = () => {
    setCurrentStep("child-profile");
  };

  const handleChildProfileBack = () => {
    setCurrentStep("registration");
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

  const handleLogout = () => {
    setCurrentStep("landing");
    setChildData(null);
    setSelectedDomains([]);
  };

  const handleBackToDashboard = () => {
    setCurrentStep("dashboard");
  };

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
