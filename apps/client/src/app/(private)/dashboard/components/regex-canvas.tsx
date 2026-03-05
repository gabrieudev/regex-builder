"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RegexElement } from "../use-dashboard";

interface Props {
  elements: RegexElement[];
  dragOverIndex: number | null;
  onDrop: (el: RegexElement, insertAt: number) => void;
  onRemove: (id: string) => void;
  onUpdateInput: (id: string, input: string) => void;
  onReorder: (from: number, to: number) => void;
  onDragOverIndex: (index: number | null) => void;
  onClear: () => void;
}

export function RegexCanvas({
  elements,
  dragOverIndex,
  onDrop,
  onRemove,
  onUpdateInput,
  onReorder,
  onDragOverIndex,
  onClear,
}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingCanvasIndex, setDraggingCanvasIndex] = useState<number | null>(
    null,
  );

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    onDragOverIndex(index);
  };

  const handleDrop = (
    e: React.DragEvent,
    insertAt: number,
    draggedData: string,
  ) => {
    e.preventDefault();
    onDragOverIndex(null);

    try {
      const data = JSON.parse(
        draggedData || e.dataTransfer.getData("text/plain"),
      );
      if (data._canvasIndex !== undefined) {
        // Reordenar elemento existente
        if (data._canvasIndex !== insertAt) {
          onReorder(data._canvasIndex, insertAt);
        }
      } else {
        onDrop(data, insertAt);
      }
    } catch {
      // ignorar
    }
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOverIndex(null);
    try {
      const raw = e.dataTransfer.getData("text/plain");
      const data = JSON.parse(raw);
      if (data._canvasIndex === undefined) {
        onDrop(data, elements.length);
      }
    } catch {
      // ignorar
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Área de soltar no canvas */}
      <div
        ref={canvasRef}
        onDragOver={(e) => {
          e.preventDefault();
          if (draggingCanvasIndex === null) onDragOverIndex(elements.length);
        }}
        onDrop={handleCanvasDrop}
        onDragLeave={() => onDragOverIndex(null)}
        className="flex-1 relative rounded-xl border-2 border-dashed transition-all duration-200 min-h-30 p-3"
        style={{
          borderColor: dragOverIndex !== null ? "#06b6d480" : "#d1d5db",
          background:
            dragOverIndex !== null
              ? "rgba(6,182,212,0.03)"
              : "rgba(255,255,255,0.05)",
        }}
      >
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl mb-2 opacity-20 text-gray-400">⬡</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                arraste elementos aqui para construir seu regex
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 items-center">
          <AnimatePresence>
            {elements.map((el, idx) => (
              <div key={el.id} className="flex items-center">
                {/* Zona de soltar antes do elemento */}
                <DropZone
                  index={idx}
                  isActive={dragOverIndex === idx}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) =>
                    handleDrop(e, idx, e.dataTransfer.getData("text/plain"))
                  }
                />

                <motion.div
                  layout
                  initial={{ scale: 0.5, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <CanvasElement
                    element={el}
                    index={idx}
                    onRemove={() => onRemove(el.id)}
                    onUpdateInput={(v) => onUpdateInput(el.id, v)}
                    onDragStart={() => setDraggingCanvasIndex(idx)}
                    onDragEnd={() => setDraggingCanvasIndex(null)}
                    onDragOver={(e) => handleDragOver(e, idx + 1)}
                    onDrop={(e) =>
                      handleDrop(
                        e,
                        idx + 1,
                        JSON.stringify({ ...el, _canvasIndex: idx }),
                      )
                    }
                  />
                </motion.div>
              </div>
            ))}
          </AnimatePresence>

          {/* Zona de soltar final */}
          {elements.length > 0 && (
            <DropZone
              index={elements.length}
              isActive={dragOverIndex === elements.length}
              onDragOver={(e) => handleDragOver(e, elements.length)}
              onDrop={(e) =>
                handleDrop(
                  e,
                  elements.length,
                  e.dataTransfer.getData("text/plain"),
                )
              }
            />
          )}
        </div>
      </div>

      {/* Controles do canvas */}
      {elements.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClear}
          className="self-end text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-mono flex items-center gap-1"
        >
          <span>✕</span> limpar tudo
        </motion.button>
      )}
    </div>
  );
}

function DropZone({
  isActive,
  onDragOver,
  onDrop,
}: {
  index: number;
  isActive: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="h-8 transition-all duration-150 rounded flex items-center justify-center"
      style={{
        width: isActive ? "20px" : "4px",
        background: isActive ? "rgba(6,182,212,0.2)" : "transparent",
        borderRight: isActive ? "2px solid #06b6d4" : "2px solid transparent",
      }}
    />
  );
}

function CanvasElement({
  element,
  index,
  onRemove,
  onUpdateInput,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: {
  element: RegexElement;
  index: number;
  onRemove: () => void;
  onUpdateInput: (v: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ ...element, _canvasIndex: index }),
    );
    onDragStart();
  };

  return (
    <div className="relative group">
      <div
        draggable={!editing}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center rounded-lg border font-mono text-sm font-bold select-none cursor-grab active:cursor-grabbing"
        style={{
          color: element.color,
          background: `${element.color}15`,
          borderColor: `${element.color}40`,
          boxShadow: `0 0 8px ${element.color}15, inset 0 1px 0 ${element.color}20`,
          padding: element.configurable ? "4px 8px" : "6px 10px",
        }}
      >
        {element.configurable ? (
          <div className="flex items-center gap-1">
            <span className="text-xs opacity-60">
              {element.label.replace("…", "")}
            </span>
            <input
              value={element.input ?? ""}
              onChange={(e) => onUpdateInput(e.target.value)}
              onFocus={() => setEditing(true)}
              onBlur={() => setEditing(false)}
              onClick={(e) => e.stopPropagation()}
              placeholder={element.placeholder}
              className="bg-transparent outline-none w-16 text-xs font-mono placeholder-opacity-30 border-b border-dashed"
              style={{
                color: element.color,
                borderColor: `${element.color}50`,
                minWidth: "40px",
                maxWidth: "80px",
              }}
              size={Math.max((element.input ?? "").length, 4)}
            />
            {element.type === "group" && (
              <span className="text-xs opacity-60">)</span>
            )}
          </div>
        ) : (
          <span>{element.label}</span>
        )}

        {/* Botão remover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] hover:bg-red-500 hover:text-white"
          style={{ color: element.color }}
        >
          ✕
        </button>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.1 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div
              className="px-2 py-1 rounded text-[10px] whitespace-nowrap border shadow-xl"
              style={{
                background: "#0d0d18",
                borderColor: `${element.color}40`,
                color: "#8888aa",
              }}
            >
              {element.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
