/**
 * Internationalization (i18n) configuration
 * Detects user's browser language and provides translations
 */

export type Language = "de" | "en";

export const SUPPORTED_LANGUAGES: readonly Language[] = ["de", "en"] as const;
export const DEFAULT_LANGUAGE: Language = "de";
export const LANGUAGE_STORAGE_KEY = "taxi-app-language" as const;

/**
 * Detects the user's preferred language from browser settings
 */
export const detectUserLanguage = (): Language => {
  // Check localStorage first
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (stored && SUPPORTED_LANGUAGES.includes(stored as Language)) {
    return stored as Language;
  }

  // Detect from browser
  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith("de")) {
    return "de";
  }

  return DEFAULT_LANGUAGE;
};

/**
 * Saves the user's language preference
 */
export const saveLanguagePreference = (lang: Language): void => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
};
