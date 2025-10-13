import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "@/i18n/translations";

type LangCtx = {
  lang: string;
  setLang: (l: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LangCtx | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<string>(() => localStorage.getItem("sb_lang") || "en");

  useEffect(() => {
    localStorage.setItem("sb_lang", lang);
  }, [lang]);

  const setLang = (l: string) => setLangState(l);

  const t = (key: string) => {
    const map = translations[lang] || translations["en"];
    return map[key] || translations["en"][key] || key;
  };

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
