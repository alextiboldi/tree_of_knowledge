"use client";

import { I18nextProvider } from "react-i18next";
import { useEffect } from "react";
import i18n from "../i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Update HTML lang attribute when language changes
    const updateHtmlLang = (lng: string) => {
      if (typeof document !== "undefined") {
        document.documentElement.lang = lng;
      }
    };

    // Set initial language
    updateHtmlLang(i18n.language);

    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      updateHtmlLang(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    // Cleanup
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
