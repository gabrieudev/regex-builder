"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Props {
  pattern: string;
  language: Language;
  codeSnippet: string;
}

const LANG_WRAP: Record<Language, [string, string]> = {
  JAVASCRIPT: ["/", "/gm"],
  PYTHON: ['r"', '"'],
  JAVA: ['"', '"'],
};

export function RegexPreview({ pattern, language, codeSnippet }: Props) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const [pre, post] = LANG_WRAP[language];

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
            padrão regex
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCode((v) => !v)}
            className={`text-[10px] font-mono px-2 py-0.5 h-auto border transition-colors ${
              showCode
                ? "border-cyan-500/30 text-cyan-600 bg-cyan-500/10"
                : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            }`}
          >
            {showCode ? "padrão" : "código"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copy(showCode ? codeSnippet : pattern)}
            className="text-[10px] font-mono px-2 py-0.5 h-auto border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30"
          >
            {copied ? "copiado!" : "copiar"}
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <AnimatePresence mode="wait">
        {!showCode ? (
          <motion.div
            key="pattern"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-3 font-mono text-sm overflow-x-auto"
          >
            {pattern ? (
              <span className="flex items-center gap-0 flex-wrap">
                <span className="text-gray-400 dark:text-gray-600">{pre}</span>
                <span className="text-cyan-600 dark:text-cyan-400 break-all">
                  {pattern}
                </span>
                <span className="text-gray-400 dark:text-gray-600">{post}</span>
              </span>
            ) : (
              <span className="text-gray-400 dark:text-gray-600 italic text-xs">
                — nenhum padrão ainda —
              </span>
            )}
          </motion.div>
        ) : (
          <motion.pre
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-pre-wrap leading-relaxed"
          >
            {codeSnippet || "— nenhum padrão ainda —"}
          </motion.pre>
        )}
      </AnimatePresence>
    </div>
  );
}
