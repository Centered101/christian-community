"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, type Locale, type TranslationKey } from "./translations";

const STORAGE_KEY = "locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "th" || stored === "en") {
      setLocaleState(stored);
      return;
    }
    // ยังไม่มีค่าที่บันทึกไว้ — ตรวจภาษาของอุปกรณ์/เบราว์เซอร์ครั้งเดียว
    // แล้วใช้เป็นค่าเริ่มต้น (ผู้ใช้ยังเปลี่ยนเองผ่านปุ่มสลับภาษาได้ภายหลัง)
    const detected = navigator.language?.toLowerCase().startsWith("en") ? "en" : "th";
    setLocaleState(detected);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: TranslationKey) => translations[locale][key];

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
