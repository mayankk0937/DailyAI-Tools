"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "./i18n/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: keyof typeof translations.en, key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("dailyai_lang") as Language;
    if (savedLang && ["en", "hi", "hinglish"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("dailyai_lang", lang);
    document.cookie = `dailyai_lang=${lang}; path=/; max-age=31536000`; // 1 year
  };

  const t = (section: keyof typeof translations.en, key: string) => {
    try {
      // @ts-ignore
      return translations[language][section][key] || translations["en"][section][key] || key;
    } catch (e) {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
