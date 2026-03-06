"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface Props {
  testString: string;
  onChange: (v: string) => void;
  result: ExecutionResult | null;
  pattern: string;
  isLoading: boolean;
  onExecute: () => void;
}

export function TestPanel({
  testString,
  onChange,
  result,
  pattern,
  isLoading,
  onExecute,
}: Props) {
  const segments = useMemo(() => {
    if (!result?.success || !result.matchRanges?.length || !testString)
      return null;

    const ranges: Array<{ start: number; end: number }> = result.matchRanges
      .map((r) => {
        const keys = Object.keys(r);
        if (keys.length >= 2) {
          return { start: r[keys[0]], end: r[keys[1]] };
        }
        return null;
      })
      .filter(Boolean) as Array<{ start: number; end: number }>;

    if (!ranges.length) return null;

    ranges.sort((a, b) => a.start - b.start);

    const parts: Array<{ text: string; match: boolean; index: number }> = [];
    let cursor = 0;
    let matchIdx = 0;

    for (const range of ranges) {
      if (range.start > cursor) {
        parts.push({
          text: testString.slice(cursor, range.start),
          match: false,
          index: -1,
        });
      }
      parts.push({
        text: testString.slice(range.start, range.end),
        match: true,
        index: matchIdx++,
      });
      cursor = range.end;
    }
    if (cursor < testString.length) {
      parts.push({ text: testString.slice(cursor), match: false, index: -1 });
    }

    return parts;
  }, [result, testString]);

  const hasResult = result !== null;
  const isSuccess = result?.success;

  return (
    <div className="flex flex-col gap-3">
      {/* Área de entrada */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              string de teste
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600">
            {testString.length} caracteres
          </span>
        </div>
        <textarea
          value={testString}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-4 py-3 font-mono text-xs text-gray-800 dark:text-gray-200 resize-none outline-none placeholder-gray-400 dark:placeholder-gray-600 leading-relaxed"
          rows={4}
          placeholder="Digite a string de teste aqui..."
          spellCheck={false}
        />
      </div>

      {/* Botão executar */}
      <motion.button
        onClick={onExecute}
        disabled={!pattern || isLoading}
        whileHover={pattern && !isLoading ? { scale: 1.01 } : {}}
        whileTap={pattern && !isLoading ? { scale: 0.98 } : {}}
        className="relative w-full py-2.5 rounded-xl font-mono text-sm font-bold transition-all duration-200 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 cursor-pointer"
        style={{
          background:
            !pattern || isLoading
              ? undefined
              : "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(37,99,235,0.1))",
          borderColor:
            !pattern || isLoading
              ? "rgb(209 213 219 / 0.5)"
              : "rgb(6 182 212 / 0.3)",
          color: !pattern || isLoading ? undefined : "rgb(6 182 212)",
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner />
            executando...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>
              <Play className="w-4 h-4" />
            </span>
            executar regex
          </span>
        )}
      </motion.button>

      {/* Resultado destacado */}
      {hasResult && isSuccess && segments && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-950"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                correspondências destacadas
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              {result.matchCount} correspondência
              {result.matchCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="px-4 py-3 font-mono text-xs leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-wrap wrap-break-word">
            {segments.map((seg, i) =>
              seg.match ? (
                <motion.mark
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: seg.index * 0.05 }}
                  className="rounded px-0.5 bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30"
                >
                  {seg.text}
                </motion.mark>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full"
    />
  );
}
