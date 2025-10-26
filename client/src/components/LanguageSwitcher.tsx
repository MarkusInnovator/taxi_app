/**
 * Language Switcher Component
 * Allows users to manually change the language
 */
import type { FC } from "react";

import { Button } from "@heroui/react";

import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSwitcher: FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <Button
        className={`min-w-[50px] text-xs font-semibold transition-all ${
          language === "de"
            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
            : "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        }`}
        size="sm"
        variant={language === "de" ? "solid" : "light"}
        onPress={() => setLanguage("de")}
      >
        DE
      </Button>
      <Button
        className={`min-w-[50px] text-xs font-semibold transition-all ${
          language === "en"
            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
            : "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        }`}
        size="sm"
        variant={language === "en" ? "solid" : "light"}
        onPress={() => setLanguage("en")}
      >
        EN
      </Button>
    </div>
  );
};
