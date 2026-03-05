"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SavedRegex } from "../use-dashboard";

interface Props {
  open: boolean;
  pattern: string;
  onSave: (name: string) => void;
  onClose: () => void;
  savedRegexes: SavedRegex[];
  onLoad: (saved: SavedRegex) => void;
}

export function SaveDialog({
  open,
  pattern,
  onSave,
  onClose,
  savedRegexes,
  onLoad,
}: Props) {
  const [name, setName] = useState("");
  const [tab, setTab] = useState<"save" | "load">("save");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Fundo escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Diálogo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl overflow-hidden">
              {/* Cabeçalho */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex gap-1 p-0.5 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  {(["save", "load"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className="relative px-4 py-1 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer"
                    >
                      {tab === t && (
                        <motion.span
                          layoutId="tab-pill"
                          className="absolute inset-0 rounded-md bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                        />
                      )}
                      <span
                        className="relative z-10"
                        style={{ color: tab === t ? "#06b6d4" : "#6b7280" }}
                      >
                        {t === "save" ? "salvar" : "carregar"}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm w-6 h-6 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Conteúdo */}
              <div className="p-5">
                <AnimatePresence mode="wait">
                  {tab === "save" ? (
                    <motion.div
                      key="save"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex flex-col gap-4"
                    >
                      {/* Pré-visualização do padrão */}
                      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-3 py-2">
                        <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400 mb-1">
                          padrão
                        </p>
                        <p className="font-mono text-xs text-cyan-600 dark:text-cyan-400 break-all">
                          {pattern || "—"}
                        </p>
                      </div>

                      {/* Campo nome */}
                      <div>
                        <label className="block text-xs font-mono text-gray-500 dark:text-gray-400 mb-2">
                          nome
                        </label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSave()}
                          placeholder="meu-padrao-regex"
                          className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-400 dark:placeholder-gray-600"
                          autoFocus
                        />
                      </div>

                      <button
                        onClick={handleSave}
                        disabled={!name.trim() || !pattern}
                        className="w-full py-2.5 rounded-xl font-mono text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 cursor-pointer"
                        style={{
                          background:
                            name.trim() && pattern
                              ? "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(37,99,235,0.1))"
                              : undefined,
                          borderColor:
                            name.trim() && pattern
                              ? "rgba(6,182,212,0.3)"
                              : undefined,
                          color: name.trim() && pattern ? "#06b6d4" : undefined,
                        }}
                      >
                        salvar regex
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="load"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex flex-col gap-2"
                    >
                      {savedRegexes.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-xs font-mono text-gray-400 dark:text-gray-600">
                            nenhum regex salvo ainda
                          </p>
                        </div>
                      ) : (
                        savedRegexes.map((s) => (
                          <motion.button
                            key={s.id}
                            onClick={() => {
                              onLoad(s);
                              onClose();
                            }}
                            whileHover={{ x: 4 }}
                            className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:border-cyan-500/30 transition-colors p-3 cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200">
                                {s.name}
                              </span>
                              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                                {s.language}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-cyan-600/80 dark:text-cyan-400/80 break-all">
                              {s.pattern}
                            </span>
                          </motion.button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
