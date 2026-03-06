"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  return (
    <Accordion
      type="multiple"
      defaultValue={["literal", "charClass", "quantifier", "anchor"]}
      className="flex flex-col gap-1"
    >
      {CATEGORY_ORDER.filter((c) => paletteByCategory[c]).map((cat) => {
        const meta = CATEGORY_META[cat];
        return (
          <AccordionItem
            key={cat}
            value={cat}
            className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-gray-100 dark:hover:bg-gray-900">
              <div className="flex items-center gap-2">
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
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {meta.label}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
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
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", JSON.stringify(element));
    onDragStart(element);
  };

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div
          draggable={!disabled}
          onDragStart={handleDragStart}
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
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="center"
        className="p-0 border-none bg-transparent shadow-none"
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
          <div className="text-[10px] text-gray-400">{element.description}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
