"use client";

import { motion } from "framer-motion";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ManualRegexInput({ value, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-4"
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent font-mono text-sm text-gray-800 dark:text-gray-200 resize-none outline-none placeholder-gray-400 dark:placeholder-gray-600"
        rows={4}
        placeholder="Digite sua regex manualmente..."
        spellCheck={false}
      />
      <div className="flex justify-end mt-2">
        <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600">
          {value.length} caracteres
        </span>
      </div>
    </motion.div>
  );
}
