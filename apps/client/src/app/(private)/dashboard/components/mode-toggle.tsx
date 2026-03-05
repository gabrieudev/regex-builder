"use client";

import { motion } from "framer-motion";

interface Props {
  mode: "visual" | "text";
  onChange: (mode: "visual" | "text") => void;
}

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <button
        onClick={() => onChange("visual")}
        className="relative px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-colors duration-150 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900"
      >
        {mode === "visual" && (
          <motion.span
            layoutId="mode-pill"
            className="absolute inset-0 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span
          className="relative z-10"
          style={{ color: mode === "visual" ? "#06b6d4" : "#6b7280" }}
        >
          Visual
        </span>
      </button>
      <button
        onClick={() => onChange("text")}
        className="relative px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-colors duration-150 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900"
      >
        {mode === "text" && (
          <motion.span
            layoutId="mode-pill"
            className="absolute inset-0 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span
          className="relative z-10"
          style={{ color: mode === "text" ? "#06b6d4" : "#6b7280" }}
        >
          Texto
        </span>
      </button>
    </div>
  );
}
