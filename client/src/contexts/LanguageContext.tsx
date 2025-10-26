/**
 * Language Context Provider
 * Manages application-wide language state
 */
import type { Language } from "@/i18n";
import type { FC, ReactNode } from "react";

import { createContext, useContext, useEffect, useState } from "react";

import { detectUserLanguage, saveLanguagePreference } from "@/i18n";
import { translations } from "@/i18n/translations";

interface LanguageContextValue {
  readonly language: Language;
  readonly setLanguage: (lang: Language) => void;
  readonly t: typeof translations.de;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

interface LanguageProviderProps {
  readonly children: ReactNode;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() =>
    detectUserLanguage(),
  );

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language): void => {
    setLanguageState(lang);
    saveLanguagePreference(lang);
  };

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to access language context
 */
export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
};
