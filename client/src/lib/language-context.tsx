import { createContext, useContext, useState, useEffect } from "react";
import type { Lang } from "./i18n";
import dict from "./i18n";

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof dict["fr"];
}

const LanguageContext = createContext<LanguageCtx>({
  lang: "fr",
  setLang: () => {},
  t: dict["fr"],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem("portfolio-lang");
      if (stored === "fr" || stored === "en") return stored;
    } catch {}
    return "fr";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("portfolio-lang", l); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
