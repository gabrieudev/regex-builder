"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import { ExecutionResult } from "../use-dashboard";

interface Props {
  result: ExecutionResult | null;
  error: string | null;
  isLoading: boolean;
}

export function ResultsPanel({ result, error, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"
          />
          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
            executando...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-red-600 dark:text-red-400 text-sm">✕</span>
          <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
            Erro
          </span>
        </div>
        <p className="text-xs font-mono text-red-600/80 dark:text-red-400/80">
          {error}
        </p>
      </motion.div>
    );
  }

  if (!result) return null;

  const isSuccess = result.success;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result.matchCount}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3"
      >
        {/* Barra de status */}
        <div
          className="rounded-xl border p-3 flex items-center justify-between"
          style={{
            borderColor: isSuccess ? "#10b98133" : "#f43f5e33",
            background: isSuccess ? "#10b98108" : "#f43f5e08",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: isSuccess ? "#10b981" : "#f43f5e",
                boxShadow: isSuccess ? "0 0 8px #10b981" : "0 0 8px #f43f5e",
              }}
            />
            <span
              className="text-xs font-mono font-bold"
              style={{ color: isSuccess ? "#10b981" : "#f43f5e" }}
            >
              {isSuccess ? "Sucesso" : "Falha"}
            </span>
            {result.error && (
              <span className="text-xs font-mono text-red-500/80 dark:text-red-400/80">
                — {result.error}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 dark:text-gray-400">
            <span>{result.executionTimeMs}ms</span>
            {result.isFullMatch && (
              <span className="px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 bg-emerald-500/5">
                correspondência total
              </span>
            )}
          </div>
        </div>

        {/* Correspondências */}
        {result.matches?.length > 0 && (
          <ResultSection
            title="Correspondências"
            color="#06b6d4"
            count={result.matchCount}
          >
            <div className="flex flex-wrap gap-1.5">
              {result.matches.map((m, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="px-2 py-1 rounded-md font-mono text-xs border"
                  style={{
                    color: "#06b6d4",
                    background: "#06b6d412",
                    borderColor: "#06b6d430",
                  }}
                >
                  {JSON.stringify(m)}
                </motion.span>
              ))}
            </div>
          </ResultSection>
        )}

        {/* Grupos de captura */}
        {result.groups?.length > 0 && (
          <ResultSection title="Grupos de Captura" color="#a855f7">
            {result.groups.map((grp, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 mt-1">
                  #{i + 1}
                </span>
                <div className="flex flex-wrap gap-1">
                  {grp.map((g, j) => (
                    <span
                      key={j}
                      className="px-2 py-0.5 rounded font-mono text-xs border"
                      style={{
                        color: "#a855f7",
                        background: "#a855f712",
                        borderColor: "#a855f730",
                      }}
                    >
                      {JSON.stringify(g)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </ResultSection>
        )}

        {/* Grupos nomeados */}
        {result.namedGroups && Object.keys(result.namedGroups).length > 0 && (
          <ResultSection title="Grupos Nomeados" color="#10b981">
            <div className="flex flex-col gap-1">
              {Object.entries(result.namedGroups).map(([name, vals]) => (
                <div key={name} className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    {name}:
                  </span>
                  {vals.map((v, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded font-mono text-xs border"
                      style={{
                        color: "#10b981",
                        background: "#10b98112",
                        borderColor: "#10b98130",
                      }}
                    >
                      {JSON.stringify(v)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </ResultSection>
        )}

        {/* Avisos */}
        {result.warnings?.length > 0 && (
          <ResultSection title="Avisos" color="#f59e0b">
            {result.warnings.map((w, i) => (
              <p
                key={i}
                className="text-xs font-mono text-amber-600/80 dark:text-amber-400/80"
              >
                <TriangleAlert className="w-4 h-4" /> {w}
              </p>
            ))}
          </ResultSection>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function ResultSection({
  title,
  color,
  count,
  children,
}: {
  title: string;
  color: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 4px ${color}` }}
        />
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
          {title}
        </span>
        {count !== undefined && (
          <span
            className="ml-auto text-[10px] font-mono font-bold"
            style={{ color }}
          >
            {count}
          </span>
        )}
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">{children}</div>
    </div>
  );
}
