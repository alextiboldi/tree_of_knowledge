"use client";

import { useTranslation } from "react-i18next";
import { useI18nReady } from "../hooks/useI18nReady";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TestI18nPage() {
  const { t, i18n } = useTranslation();
  const isI18nReady = useI18nReady();

  if (!isI18nReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading translations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            i18n Language Detection Test
          </h1>
          <LanguageSwitcher />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Language Detection Info
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Current Language:</strong> {i18n.language}
                </p>
                <p>
                  <strong>Resolved Language:</strong> {i18n.resolvedLanguage}
                </p>
                <p>
                  <strong>Browser Language:</strong> {navigator.language}
                </p>
                <p>
                  <strong>Browser Languages:</strong>{" "}
                  {navigator.languages.join(", ")}
                </p>
                <p>
                  <strong>i18n Initialized:</strong>{" "}
                  {i18n.isInitialized ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Has Resources:</strong>{" "}
                  {i18n.hasResourceBundle(i18n.language, "translation")
                    ? "Yes"
                    : "No"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Translation Examples
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Hero Title:</h3>
                  <p className="text-lg">
                    {t("hero.title.line1")} {t("hero.title.line2")}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700">Features:</h3>
                  <ul className="space-y-2">
                    <li>• {t("features.askAnything.title")}</li>
                    <li>• {t("features.knowledgeBlossom.title")}</li>
                    <li>• {t("features.safeLearning.title")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700">
                    Main App Greeting:
                  </h3>
                  <p>{t("mainApp.greeting", { name: "Alex" })}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700">Buttons:</h3>
                  <div className="space-y-2">
                    <p>• {t("hero.buttons.startLearning")}</p>
                    <p>• {t("hero.buttons.watchDemo")}</p>
                    <p>• {t("cta.buttons.startFree")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">← Back to Landing Page</Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">How It Works:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
            <li>
              Browser language is automatically detected using
              i18next-browser-languagedetector
            </li>
            <li>If browser language is supported (en, es), it's used</li>
            <li>If browser language is not supported, fallback to English</li>
            <li>Language preference is saved in localStorage and cookies</li>
            <li>
              User can manually switch languages using the language switcher
            </li>
            <li>
              HTML lang attribute updates automatically when language changes
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
