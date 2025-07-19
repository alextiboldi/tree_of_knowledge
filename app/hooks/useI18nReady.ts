"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useI18nReady() {
  const { i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      // Check if i18n is initialized and has loaded resources
      if (
        i18n.isInitialized &&
        i18n.hasResourceBundle(i18n.language, "translation")
      ) {
        setIsReady(true);
      }
    };

    // Check immediately
    checkReady();

    // Listen for initialization and language changes
    i18n.on("initialized", checkReady);
    i18n.on("loaded", checkReady);
    i18n.on("languageChanged", checkReady);

    return () => {
      i18n.off("initialized", checkReady);
      i18n.off("loaded", checkReady);
      i18n.off("languageChanged", checkReady);
    };
  }, [i18n]);

  return isReady;
}
