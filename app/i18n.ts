import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

// Import translation files directly
import enTranslations from "../public/locales/en/translation.json";
import esTranslations from "../public/locales/es/translation.json";
import trTranslations from "../public/locales/tr/translation.json";

const detectionOptions = {
  // Order of language detection methods
  order: [
    "navigator", // Browser language setting
    "htmlTag", // HTML lang attribute
    "localStorage", // Previously stored language preference
    "sessionStorage", // Session-based language preference
    "cookie", // Cookie-based language preference
    "path", // URL path
    "subdomain", // Subdomain
  ],

  // Which detectors to use
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // Cache user language preference
  caches: ["localStorage", "cookie"],

  // Exclude certain detection methods that might not be relevant
  excludeCacheFor: ["cimode"],

  // Cookie options for language preference storage
  cookieOptions: {
    path: "/",
    sameSite: "strict" as const,
  },
};

// Resources object with direct imports
const resources = {
  en: {
    translation: enTranslations,
  },
  es: {
    translation: esTranslations,
  },
  tr: {
    translation: trTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ["en", "es", "tr"],
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",

    // Enhanced language detection
    detection: detectionOptions,

    // Load missing keys from fallback language
    saveMissing: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    // React specific options
    react: {
      useSuspense: false, // Avoid suspense issues in Next.js
    },

    // Namespace configuration
    ns: ["translation"],
    defaultNS: "translation",

    // Language detection fallback behavior
    load: "languageOnly", // Load only language code, not region (en instead of en-US)

    // Clean code configuration
    cleanCode: true,

    // Non-existing key behavior
    returnNull: false,
    returnEmptyString: false,
  });

export default i18n;
