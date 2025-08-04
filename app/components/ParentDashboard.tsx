"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TreePine,
  Settings,
  User,
  Shield,
  AlertTriangle,
  Edit3,
  Heart,
  Brain,
  Sparkles,
  LogOut,
  Plus,
  Users,
} from "lucide-react";
import { useChildren } from "../hooks/useApi";
import { OnboardingState } from "../lib/api";

interface ParentDashboardProps {
  onStartLearning: (childId?: string) => void;
  onLogout: () => void;
  onAddChild?: () => void;
}

interface ChildProfile {
  id: string;
  displayName: string;
  age: number;
  selectedDomains: string[];
  createdAt: string;
  lastActivity: string;
  domains: Array<{
    domain: {
      id: string;
      name: string;
      description: string;
    };
  }>;
}

interface Domain {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function ParentDashboard({
  onStartLearning,
  onLogout,
  onAddChild,
}: ParentDashboardProps) {
  const { t } = useTranslation();
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Fetch children data using TanStack Query
  const { data: onboardingState, isLoading, error } = useChildren();

  const children = onboardingState?.children || [];

  // Select first child by default when data loads
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      const rawChild = children[0];
      const firstChild: ChildProfile = {
        id: rawChild.id,
        displayName: rawChild.displayName,
        age: rawChild.age,
        selectedDomains: rawChild.domains?.map((d: any) => d.domain.name) || [],
        createdAt: rawChild.createdAt,
        lastActivity: (rawChild as any).updatedAt || rawChild.createdAt,
        domains: rawChild.domains || [],
      };
      setSelectedChild(firstChild);
    }
  }, [children, selectedChild]);

  const domains: Domain[] = [
    {
      id: "science-technology",
      name: t("parentDashboard.domains.science.name"),
      icon: Brain,
      color: "text-emerald-600",
    },
    {
      id: "nature-environment",
      name: t("parentDashboard.domains.nature.name"),
      icon: Heart,
      color: "text-blue-600",
    },
    {
      id: "math-logic",
      name: t("parentDashboard.domains.math.name"),
      icon: Sparkles,
      color: "text-purple-600",
    },
  ];

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile page
    console.log("Edit profile clicked for:", selectedChild?.id);
  };

  const handleEditDomains = () => {
    // TODO: Navigate to domain selection page
    console.log("Edit domains clicked for:", selectedChild?.id);
  };

  const handleReportIssue = () => {
    setShowReportModal(true);
  };

  const submitReport = () => {
    // TODO: Implement report submission
    setShowReportModal(false);
    alert(t("parentDashboard.report.success"));
  };

  const handleAddNewChild = () => {
    if (onAddChild) {
      onAddChild();
    } else {
      // Fallback - could redirect to child creation flow
      console.log("Add new child clicked");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4 parent-interface">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="flex items-center gap-3">
            <TreePine className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-parent-3xl font-semibold text-primary">
                {t("parentDashboard.title")}
              </h1>
              <p className="text-parent-base text-muted-foreground">
                {t("parentDashboard.subtitle")}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex items-center gap-2 text-parent-sm font-medium transition-all duration-200 hover:scale-105"
          >
            <LogOut className="h-4 w-4" />
            {t("parentDashboard.logoutButton")}
          </Button>
        </div>

        {children.length === 0 ? (
          // No children state
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No children profiles yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first child profile to get started with learning!
            </p>
            <Button
              onClick={handleAddNewChild}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Child
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Children Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-parent-lg font-semibold flex items-center justify-between">
                    <span>Children</span>
                    <Button
                      size="sm"
                      onClick={handleAddNewChild}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        // Transform the raw child data to match ChildProfile interface
                        const transformedChild: ChildProfile = {
                          id: child.id,
                          displayName: child.displayName,
                          age: child.age,
                          selectedDomains:
                            child.domains?.map((d: any) => d.domain.name) || [],
                          createdAt: child.createdAt,
                          lastActivity:
                            (child as any).updatedAt || child.createdAt,
                          domains: child.domains || [],
                        };
                        setSelectedChild(transformedChild);
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                        selectedChild?.id === child.id
                          ? "bg-primary text-white"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium">{child.displayName}</div>
                      <div className="text-sm opacity-75">
                        {child.age} years old
                      </div>
                      <div className="text-xs opacity-60 mt-1">
                        {child.domains?.length || 0} domains
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {selectedChild && (
                <Card className="shadow-lg border-2 border-primary/20 animate-scale-in">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <span className="text-parent-xl font-semibold">
                          {t("parentDashboard.profile.title", {
                            name: selectedChild.displayName,
                          })}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditProfile}
                        className="text-parent-sm transition-all duration-200 hover:scale-105"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-parent-sm font-medium text-gray-700">
                          Display Name
                        </label>
                        <p className="text-parent-lg font-semibold text-gray-900">
                          {selectedChild.displayName}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-parent-sm font-medium text-gray-700">
                          Age
                        </label>
                        <p className="text-parent-lg font-semibold text-gray-900">
                          {selectedChild.age} years old
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-parent-sm font-medium text-gray-700">
                          Profile Created
                        </label>
                        <p className="text-parent-base text-gray-600">
                          {new Date(
                            selectedChild.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-parent-sm font-medium text-gray-700">
                          Last Activity
                        </label>
                        <p className="text-parent-base text-gray-600">
                          {new Date(
                            selectedChild.lastActivity
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Learning Domains */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-parent-lg font-semibold text-gray-900">
                          Learning Domains
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditDomains}
                          className="text-parent-sm transition-all duration-200 hover:scale-105"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Modify
                        </Button>
                      </div>

                      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {domains.map((domain) => {
                          const isEnabled =
                            selectedChild.selectedDomains.includes(domain.id);
                          const Icon = domain.icon;

                          return (
                            <div
                              key={domain.id}
                              className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                                isEnabled
                                  ? "border-emerald-200 bg-emerald-50"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <Icon
                                  className={`h-5 w-5 ${
                                    isEnabled ? domain.color : "text-gray-400"
                                  }`}
                                />
                                <span
                                  className={`text-parent-sm font-medium ${
                                    isEnabled
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {domain.name}
                                </span>
                              </div>
                              <div
                                className={`text-parent-xs px-2 py-1 rounded-full font-medium ${
                                  isEnabled
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {isEnabled ? "Active" : "Disabled"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-parent-sm text-blue-800">
                          {selectedChild.displayName} has access to{" "}
                          <strong>
                            {selectedChild.selectedDomains.length}
                          </strong>{" "}
                          learning domains. You can modify these selections
                          anytime to customize their learning experience.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <Card className="shadow-lg animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="text-parent-lg font-semibold">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => onStartLearning(selectedChild?.id)}
                    disabled={!selectedChild}
                    className="w-full bg-primary hover:bg-primary/90 text-white text-parent-sm font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    <TreePine className="h-4 w-4 mr-2" />
                    Start Learning Session
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-parent-sm font-medium transition-all duration-200 hover:scale-105"
                    onClick={handleEditProfile}
                    disabled={!selectedChild}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Edit Child Profile
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-parent-sm font-medium transition-all duration-200 hover:scale-105"
                    onClick={handleEditDomains}
                    disabled={!selectedChild}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Domains
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-primary border-primary hover:bg-primary hover:text-white text-parent-sm font-medium transition-all duration-200 hover:scale-105"
                    onClick={handleAddNewChild}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Child
                  </Button>
                </CardContent>
              </Card>

              {/* Safety & Support */}
              <Card
                className="shadow-lg animate-slide-in-right"
                style={{ animationDelay: "0.1s" }}
              >
                <CardHeader>
                  <CardTitle className="text-parent-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Safety & Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-green-600 mt-1" />
                      <div>
                        <p className="text-parent-sm font-medium text-green-800">
                          Safe Learning Environment
                        </p>
                        <p className="text-parent-xs text-green-700 mt-1">
                          All AI responses are filtered for age-appropriate
                          content
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 text-parent-sm font-medium transition-all duration-200 hover:scale-105"
                    onClick={handleReportIssue}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>

                  <div className="text-center pt-2">
                    <p className="text-parent-xs text-gray-500">
                      For urgent concerns, email us directly at{" "}
                      <a
                        href="mailto:support@magicalknowledgetree.com"
                        className="text-primary hover:underline font-medium"
                      >
                        support@magicalknowledgetree.com
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-scale-in">
              <CardHeader>
                <CardTitle className="text-parent-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Report an Issue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-parent-sm text-gray-600">
                  Please describe the issue you encountered. We take all reports
                  seriously and will review them within 24 hours.
                </p>

                <textarea
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg text-parent-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe the issue..."
                />

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowReportModal(false)}
                    variant="outline"
                    className="flex-1 text-parent-sm font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitReport}
                    className="flex-1 text-parent-sm font-medium"
                  >
                    {t("parentDashboard.report.submitButton")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
