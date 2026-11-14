import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

export type Language = "eng" | "de";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "eng",
  setLang: () => {},
});

const metadata = {
  eng: {
    path: "/",
    language: "en",
    locale: "en_US",
    title: "Chiheb Ben Cheikh | Founder & Software Architect",
    description: "Founder of BiancoToro Technologies. Software architecture, product engineering, agentic AI and cloud systems. Projects and open-source contributions.",
  },
  de: {
    path: "/de/",
    language: "de",
    locale: "de_DE",
    title: "Chiheb Ben Cheikh | Gründer & Softwarearchitekt",
    description: "Gründer von BiancoToro Technologies. Softwarearchitektur, Produktentwicklung, agentische KI und Cloud-Systeme. Projekte und Open-Source-Beiträge.",
  },
};

function languageFromUrl(): Language {
  const url = new URL(window.location.href);
  return /^\/de(?:\/|$)/.test(url.pathname) || url.searchParams.get("lang") === "de" ? "de" : "eng";
}

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [lang, updateLang] = useState<Language>(languageFromUrl);

  const setLang = (next: Language) => {
    const url = new URL(window.location.href);
    url.pathname = metadata[next].path;
    url.searchParams.delete("lang");
    window.history.pushState(null, "", url.pathname + url.search + url.hash);
    updateLang(next);
  };

  useEffect(() => {
    const onPopState = () => updateLang(languageFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const current = metadata[lang];
    const canonical = `https://www.chihebbencheikh.com${current.path}`;
    document.documentElement.lang = current.language;
    document.title = current.title;
    const setMeta = (selector: string, content: string) => {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", content);
    };
    setMeta('meta[name="description"]', current.description);
    setMeta('meta[property="og:title"]', current.title);
    setMeta('meta[property="og:description"]', current.description);
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[property="og:locale"]', current.locale);
    setMeta('meta[property="og:locale:alternate"]', lang === "de" ? "en_US" : "de_DE");
    setMeta('meta[name="twitter:title"]', current.title);
    setMeta('meta[name="twitter:description"]', current.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
    const profile = document.getElementById("profile-page-schema");
    if (profile) {
      const schema = JSON.parse(profile.textContent || "{}");
      profile.textContent = JSON.stringify({ ...schema, "@id": `${canonical}#webpage`, url: canonical, name: current.title, inLanguage: current.language });
    }
    // Old shared query URLs continue to select German, then use its static URL.
    const url = new URL(window.location.href);
    if (url.pathname !== current.path || url.searchParams.has("lang")) {
      url.pathname = current.path;
      url.searchParams.delete("lang");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }
  }, [lang]);
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- hook co-located with its provider by design
export const useLanguage = () => useContext(LanguageContext);
