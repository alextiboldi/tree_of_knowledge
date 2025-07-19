"use client";

import { useState } from "react";
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
} from "lucide-react";

interface ParentDashboardProps {
  onStartLearning: () => void;
  onLogout: () => void;
}

interface ChildProfile {
  id: string;
  displayName: string;
  age: number;
  selectedDomains: string[];
  createdAt: string;
  lastActivity: string;
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
}: ParentDashboardProps) {
  const { t } = useTranslation();
  // Mock data - in real app this would come from API
  const [childProfile] = useState<ChildProfile>({
    id: "1",
    displayName: "Emma",
    age: 8,
    selectedDomains: ["science-technology", "nature-environment", "math-logic"],
    createdAt: "2024-01-15",
    lastActivity: "2024-01-20",
  });

  const [showReportModal, setShowReportModal] = useState(false);

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
    console.log("Edit profile clicked");
  };

  const handleEditDomains = () => {
    // TODO: Navigate to domain selection page
    console.log("Edit domains clicked");
  };

  const handleReportIssue = () => {
    setShowReportModal(true);
  };

  const submitReport = () => {
    // TODO: Implement report submission
    setShowReportModal(false);
    alert(t("parentDashboard.report.success"));
  };

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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Child Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-2 border-primary/20 animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="text-parent-xl font-semibold">
                      {t("parentDashboard.profile.title", {
                        name: childProfile.displayName,
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
                      {childProfile.displayName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-parent-sm font-medium text-gray-700">
                      Age
                    </label>
                    <p className="text-parent-lg font-semibold text-gray-900">
                      {childProfile.age} years old
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-parent-sm font-medium text-gray-700">
                      Profile Created
                    </label>
                    <p className="text-parent-base text-gray-600">
                      {new Date(childProfile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-parent-sm font-medium text-gray-700">
                      Last Activity
                    </label>
                    <p className="text-parent-base text-gray-600">
                      {new Date(childProfile.lastActivity).toLocaleDateString()}
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
                      const isEnabled = childProfile.selectedDomains.includes(
                        domain.id
                      );
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
                                isEnabled ? "text-gray-900" : "text-gray-500"
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
                      {childProfile.displayName} has access to{" "}
                      <strong>{childProfile.selectedDomains.length}</strong>{" "}
                      learning domains. You can modify these selections anytime
                      to customize their learning experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-parent-lg font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={onStartLearning}
                  className="w-full bg-primary hover:bg-primary/90 text-white text-parent-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  <TreePine className="h-4 w-4 mr-2" />
                  Start Learning Session
                </Button>

                <Button
                  variant="outline"
                  className="w-full text-parent-sm font-medium transition-all duration-200 hover:scale-105"
                  onClick={handleEditProfile}
                >
                  <User className="h-4 w-4 mr-2" />
                  Edit Child Profile
                </Button>

                <Button
                  variant="outline"
                  className="w-full text-parent-sm font-medium transition-all duration-200 hover:scale-105"
                  onClick={handleEditDomains}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Domains
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
