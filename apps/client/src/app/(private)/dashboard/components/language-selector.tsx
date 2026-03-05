"use client";

import { motion } from "framer-motion";
import { Language } from "../use-dashboard";

interface Props {
  language: Language;
  onChange: (lang: Language) => void;
}

const LANGUAGES: {
  key: Language;
  label: string;
  icon: string;
  color: string;
}[] = [
  { key: "JAVASCRIPT", label: "JavaScript", icon: "JS", color: "#f7df1e" },
  { key: "PYTHON", label: "Python", icon: "Py", color: "#3572A5" },
  { key: "JAVA", label: "Java", icon: "Jv", color: "#b07219" },
];

export function LanguageSelector({ language, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.key}
          onClick={() => onChange(lang.key)}
          className="relative px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          {language === lang.key && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span
            className="relative z-10 flex items-center gap-1.5"
            style={{ color: language === lang.key ? lang.color : "#6b7280" }}
          >
            <span
              className="w-5 h-5 rounded text-[9px] flex items-center justify-center font-black"
              style={{
                background:
                  language === lang.key ? `${lang.color}22` : "transparent",
                border:
                  language === lang.key
                    ? `1px solid ${lang.color}44`
                    : "1px solid #d1d5db",
              }}
            >
              {lang.icon}
            </span>
            {lang.label}
          </span>
        </button>
      ))}
    </div>
  );
}
