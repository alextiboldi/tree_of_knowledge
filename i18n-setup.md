# i18n Language Detection Setup

This document explains how automatic language detection is implemented in the Tree of Knowledge application.

## Overview

The application uses `i18next` with browser language detection to automatically determine the user's preferred language. English is used as a fallback when the detected language is not available.

## Key Features

### 1. Automatic Browser Language Detection

- Detects language from browser settings (`navigator.language`)
- Falls back to English if detected language is not supported
- Supports multiple detection methods in priority order

### 2. Supported Languages

- **English (en)** - Default/Fallback
- **Spanish (es)** - Full translation available

### 3. Language Persistence

- User language preference is saved in:
  - localStorage
  - Cookies
- Preference persists across browser sessions

## Technical Implementation

### Configuration (`app/i18n.ts`)

```typescript
const detectionOptions = {
  // Priority order for language detection
  order: [
    "navigator", // Browser language setting
    "htmlTag", // HTML lang attribute
    "localStorage", // Previously stored preference
    "sessionStorage", // Session-based preference
    "cookie", // Cookie-based preference
    "path", // URL path
    "subdomain", // Subdomain
  ],

  // Cache user preference
  caches: ["localStorage", "cookie"],

  // Cookie configuration
  cookieOptions: {
    path: "/",
    sameSite: "strict",
  },
};
```

### Key Settings

- `supportedLngs: ['en', 'es']` - Supported languages
- `fallbackLng: 'en'` - Fallback to English
- `load: 'languageOnly'` - Use language code only (not region)
- `preload: ['en']` - Preload English for fast fallback

### Components

#### I18nProvider (`app/components/I18nProvider.tsx`)

- Wraps the application with i18next context
- Automatically updates HTML `lang` attribute when language changes
- Handles language change events

#### LanguageSwitcher (`app/components/LanguageSwitcher.tsx`)

- Manual language selection component
- Displays current language with flags
- Saves preference when changed

#### useI18nReady Hook (`app/hooks/useI18nReady.ts`)

- Custom hook to check if i18n is fully initialized
- Prevents rendering issues with missing translations
- Listens for initialization and language change events

## Usage Examples

### Basic Translation

```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t("hero.title.line1")}</h1>;
}
```

### Translation with Variables

```typescript
const { t } = useTranslation();

return <p>{t("mainApp.greeting", { name: "Alex" })}</p>;
```

### Checking i18n Ready State

```typescript
import { useI18nReady } from "../hooks/useI18nReady";

function MyComponent() {
  const isReady = useI18nReady();

  if (!isReady) {
    return <div>Loading translations...</div>;
  }

  // Component content
}
```

## File Structure

```
public/locales/
├── en/
│   └── translation.json
└── es/
    └── translation.json
```

Translation files are served from the `public/locales/` directory for client-side loading.

## Testing

Visit `/test-i18n` to see:

- Current detected language
- Browser language settings
- Translation examples
- Language switching functionality

## Browser Language Detection Flow

1. **Initial Load**: Browser language is detected from `navigator.language`
2. **Language Matching**:
   - If detected language is supported → Use it
   - If not supported → Fall back to English
3. **Preference Storage**: Selected language is saved to localStorage and cookies
4. **Subsequent Visits**: Saved preference takes priority over browser detection
5. **Manual Override**: User can change language via LanguageSwitcher component

## Troubleshooting

### Common Issues

1. **Translations not loading**

   - Check if translation files exist in `public/locales/`
   - Verify file structure matches expected format
   - Use `useI18nReady` hook to wait for initialization

2. **Language not detected**

   - Check browser language settings
   - Verify language code is in `supportedLngs` array
   - Check for console errors in development mode

3. **Fallback not working**
   - Ensure `fallbackLng: 'en'` is set
   - Verify English translation file exists
   - Check `preload: ['en']` configuration

### Debug Mode

Set `debug: true` in development to see detailed i18n logs:

```typescript
i18n.init({
  debug: process.env.NODE_ENV === "development",
  // ... other options
});
```

## Best Practices

1. **Always use the `useI18nReady` hook** for components that depend on translations
2. **Provide fallback content** for missing translation keys
3. **Test with different browser language settings** to verify detection
4. **Keep translation keys consistent** across all language files
5. **Use descriptive key names** (e.g., `hero.title.line1` instead of `title1`)
