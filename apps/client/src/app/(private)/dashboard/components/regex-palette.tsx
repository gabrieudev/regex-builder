"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  paletteByCategory: Record<string, RegexElement[]>;
  onDragStart: (el: RegexElement) => void;
  disabled?: boolean;
}

const CATEGORY_META: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  literal: { label: "Literais", icon: "Aa", color: "#f59e0b" },
  charClass: { label: "Classes de Caracteres", icon: "[]", color: "#22d3ee" },
  quantifier: { label: "Quantificadores", icon: "+*", color: "#a855f7" },
  anchor: { label: "Âncoras", icon: "⌖", color: "#f43f5e" },
  group: { label: "Grupos", icon: "()", color: "#10b981" },
  lookaround: { label: "Lookaround", icon: "?=", color: "#f97316" },
};

const CATEGORY_ORDER = [
  "literal",
  "charClass",
  "quantifier",
  "anchor",
  "group",
  "lookaround",
];

export function RegexPalette({
  paletteByCategory,
  onDragStart,
  disabled,
}: Props) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(["literal", "charClass", "quantifier", "anchor"]),
  );

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-1 overflow-y-auto h-full pr-1 scrollbar-thin">
      {CATEGORY_ORDER.filter((c) => paletteByCategory[c]).map((cat) => {
        const meta = CATEGORY_META[cat];
        const isOpen = openCategories.has(cat);
        return (
          <div
            key={cat}
            className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            <button
              onClick={() => toggleCategory(cat)}
              className="w-full flex items-center gap-2 px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <span
                className="w-5 h-5 rounded text-[9px] font-black flex items-center justify-center font-mono"
                style={{
                  color: meta.color,
                  background: `${meta.color}18`,
                  border: `1px solid ${meta.color}30`,
                }}
              >
                {meta.icon}
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex-1 text-left">
                {meta.label}
              </span>
              <span
                className="text-[10px] transition-transform duration-200"
                style={{
                  transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  color: "#6b7280",
                }}
              >
                ▶
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-2 flex flex-wrap gap-1.5">
                    {paletteByCategory[cat].map((el) => (
                      <PaletteItem
                        key={el.id}
                        element={el}
                        onDragStart={onDragStart}
                        disabled={disabled}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function PaletteItem({
  element,
  onDragStart,
  disabled,
}: {
  element: RegexElement;
  onDragStart: (el: RegexElement) => void;
  disabled?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", JSON.stringify(element));
    onDragStart(element);
  };

  return (
    <div className="relative">
      <div
        draggable={!disabled}
        onDragStart={handleDragStart}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`cursor-grab active:cursor-grabbing px-2.5 py-1.5 rounded-md font-mono text-xs font-bold select-none border ${
          disabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
        style={{
          color: element.color,
          background: `${element.color}12`,
          borderColor: `${element.color}30`,
        }}
      >
        {element.label}
      </div>

      <AnimatePresence>
        {showTooltip && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div
              className="px-2.5 py-1.5 rounded-md text-[11px] text-white whitespace-nowrap border shadow-xl"
              style={{
                background: "#0d0d18",
                borderColor: `${element.color}40`,
                boxShadow: `0 0 12px ${element.color}20`,
              }}
            >
              <div
                className="font-mono font-bold mb-0.5"
                style={{ color: element.color }}
              >
                {element.label}
              </div>
              <div className="text-[10px] text-gray-400">
                {element.description}
              </div>
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b"
                style={{
                  background: "#0d0d18",
                  borderColor: `${element.color}40`,
                  marginTop: "-4px",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
