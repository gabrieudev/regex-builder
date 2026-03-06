"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  pattern: string;
  onSave: (name: string) => void;
  onClose: () => void;
  loading?: boolean;
}

export function SaveDialog({ open, pattern, onSave, onClose, loading }: Props) {
  const [name, setName] = useState("");

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
                      disabled={!name.trim() || !pattern || loading}
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
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
