"use client";

import { motion } from "framer-motion";
import { Download, Menu } from "lucide-react";
import { useRef } from "react";
import { LanguageSelector } from "./components/language-selector";
import { ManualRegexInput } from "./components/manual-regex-input";
import { ModeToggle } from "./components/mode-toggle";
import { RegexCanvas } from "./components/regex-canvas";
import { RegexPalette } from "./components/regex-palette";
import { RegexPreview } from "./components/regex-preview";
import { ResultsPanel } from "./components/results-panel";
import { SaveDialog } from "./components/save-dialog";
import { TestPanel } from "./components/test-panel";
import { useDashboard } from "./use-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const regexId = searchParams.get("id");
  const dash = useDashboard(regexId);
  const draggedElementRef = useRef<RegexElement | null>(null);

  if (dash.isLoadingRegex) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono text-gray-500">
            Carregando regex...
          </span>
        </div>
      </div>
    );
  }

  const handlePaletteDragStart = (el: RegexElement) => {
    if (dash.mode === "text") return;
    draggedElementRef.current = el;
  };

  const handleCanvasDrop = (el: RegexElement, insertAt: number) => {
    dash.addElement(el, insertAt);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200 flex flex-col">
      {/* Efeitos de fundo ambiente */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-125 h-125 rounded-full opacity-5 dark:opacity-[0.04] blur-[100px]"
          style={{ background: "#00d4ff", top: "-100px", left: "-100px" }}
        />
        <div
          className="absolute w-100 h-100 rounded-full opacity-5 dark:opacity-[0.03] blur-[100px]"
          style={{ background: "#a855f7", bottom: "0", right: "0" }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Cabeçalho */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-3">
          <ModeToggle mode={dash.mode} onChange={dash.setMode} />
          <LanguageSelector
            language={dash.language}
            onChange={dash.setLanguage}
          />
          <Button
            size="sm"
            onClick={() => dash.setShowSaveDialog(true)}
            variant="outline"
            className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer"
          >
            <span>
              <Download className="h-4 w-4" />
            </span>
            Salvar
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={dash.isPaletteOpen} onOpenChange={dash.setIsPaletteOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-sm font-mono">Elementos</SheetTitle>
              </SheetHeader>
              <div className="p-2 overflow-y-auto h-full">
                <RegexPalette
                  paletteByCategory={dash.paletteByCategory}
                  onDragStart={() => {}} // não usado em mobile
                  disabled={true}
                  onItemClick={(el) => {
                    dash.addElement(el, dash.canvasElements.length);
                    dash.setIsPaletteOpen(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet
            open={dash.isReferenceOpen}
            onOpenChange={dash.setIsReferenceOpen}
          >
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <span className="text-xs">?</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-sm font-mono">
                  Referência
                </SheetTitle>
              </SheetHeader>
              <div className="p-2 overflow-y-auto h-full">
                <QuickReference language={dash.language} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.header>

      {/* Layout principal */}
      <div
        className="relative z-10 flex flex-1 gap-0 overflow-hidden"
        style={{ height: "calc(100vh - 65px)" }}
      >
        {/* Esquerda: Paleta */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
        >
          <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800">
            <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Elementos
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 pb-4">
            <RegexPalette
              paletteByCategory={dash.paletteByCategory}
              onDragStart={handlePaletteDragStart}
              disabled={dash.mode === "text"}
            />
          </div>
        </motion.aside>

        {/* Centro: Construtor */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex-1 flex flex-col gap-4 p-5 overflow-y-auto min-w-0"
        >
          {/* Seção Canvas / Entrada Manual */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {dash.mode === "visual"
                  ? "Canvas de Construção"
                  : "Entrada Manual"}
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              {dash.mode === "visual" && (
                <span className="text-[10px] font-mono text-gray-400 dark:text-gray-600">
                  {dash.canvasElements.length}{" "}
                  {dash.canvasElements.length === 1 ? "elemento" : "elementos"}
                </span>
              )}
            </div>
            <div style={{ minHeight: "120px" }}>
              {dash.mode === "visual" ? (
                <RegexCanvas
                  elements={dash.canvasElements}
                  dragOverIndex={dash.dragOverIndex}
                  onDrop={handleCanvasDrop}
                  onRemove={dash.removeElement}
                  onUpdateInput={dash.updateElementInput}
                  onReorder={dash.reorderElements}
                  onDragOverIndex={dash.setDragOverIndex}
                  onClear={dash.clearCanvas}
                />
              ) : (
                <ManualRegexInput
                  value={dash.manualPattern}
                  onChange={dash.setManualPattern}
                />
              )}
            </div>
          </section>

          {/* Pré-visualização da regex */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Padrão
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>
            <RegexPreview
              pattern={dash.pattern}
              language={dash.language}
              codeSnippet={dash.codeSnippet}
            />
          </section>

          {/* Painel de teste */}
          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Teste
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>
            <TestPanel
              testString={dash.testString}
              onChange={dash.setTestString}
              result={dash.executeRegexMutation.data || null}
              pattern={dash.pattern}
              isLoading={dash.executeRegexMutation.isPending}
              onExecute={dash.executeRegex}
            />
          </section>

          {/* Resultados */}
          {(dash.executeRegexMutation.data ||
            dash.executeRegexMutation.error ||
            dash.executeRegexMutation.isPending) && (
            <section className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Resultados
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
              </div>
              <ResultsPanel
                result={dash.executeRegexMutation.data || null}
                error={dash.executeRegexMutation.error?.message || null}
                isLoading={dash.executeRegexMutation.isPending}
              />
            </section>
          )}

          {/* Espaçador inferior */}
          <div className="h-4" />
        </motion.main>

        {/* Direita: Referência rápida */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-52 shrink-0 border-l border-gray-200 dark:border-gray-800 overflow-y-auto bg-white/95 dark:bg-gray-950/95"
        >
          <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800">
            <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Referência Rápida
            </p>
          </div>
          <QuickReference language={dash.language} />
        </motion.aside>
      </div>

      {/* Diálogo de salvar */}
      <SaveDialog
        open={dash.showSaveDialog}
        pattern={dash.pattern}
        onSave={dash.saveRegex}
        onClose={() => dash.setShowSaveDialog(false)}
        loading={
          dash.createRegexMutation.isPending ||
          dash.updateRegexMutation.isPending
        }
        initialName={dash.loadedRegex?.name}
      />
    </div>
  );
}

function QuickReference({ language }: { language: string }) {
  const tips = [
    {
      title: "Padrões Comuns",
      color: "#22d3ee",
      items: [
        { label: "E-mail", pattern: "[\\w.-]+@[\\w.-]+\\.\\w+" },
        { label: "URL", pattern: "https?://[\\w./]+" },
        { label: "IP", pattern: "\\d{1,3}(\\.\\d{1,3}){3}" },
        { label: "Data", pattern: "\\d{4}-\\d{2}-\\d{2}" },
        { label: "Cor Hex", pattern: "#[0-9a-fA-F]{6}" },
      ],
    },
    {
      title: `Flags ${language}`,
      color: "#a855f7",
      items:
        language === "JAVASCRIPT"
          ? [
              { label: "g", pattern: "correspondência global" },
              { label: "i", pattern: "insensível a maiúsculas/minúsculas" },
              { label: "m", pattern: "multilinha" },
              { label: "s", pattern: "ponto tudo" },
            ]
          : language === "PYTHON"
            ? [
                {
                  label: "re.I",
                  pattern: "insensível a maiúsculas/minúsculas",
                },
                { label: "re.M", pattern: "multilinha" },
                { label: "re.S", pattern: "ponto tudo" },
                { label: "re.X", pattern: "verboso" },
              ]
            : [
                {
                  label: "CASE_INSENSITIVE",
                  pattern: "insensível a maiúsculas/minúsculas",
                },
                { label: "MULTILINE", pattern: "multilinha" },
                { label: "DOTALL", pattern: "ponto tudo" },
                { label: "COMMENTS", pattern: "verboso" },
              ],
    },
  ];

  return (
    <div className="p-3 flex flex-col gap-4">
      {tips.map((section) => (
        <Card
          key={section.title}
          className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
        >
          <CardContent className="p-3">
            <p
              className="text-[9px] font-mono uppercase tracking-widest mb-2"
              style={{ color: section.color }}
            >
              {section.title}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-2 py-1"
                >
                  <span
                    className="text-[10px] font-mono font-bold"
                    style={{ color: section.color }}
                  >
                    {item.label}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 text-right leading-tight">
                    {item.pattern}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <CardContent className="p-3">
          <p className="text-[9px] font-mono uppercase tracking-widest mb-2 text-amber-600 dark:text-amber-400">
            Dicas
          </p>
          <div className="flex flex-col gap-2">
            {[
              "Arraste elementos da paleta para o canvas",
              "Clique ✕ em qualquer elemento para removê-lo",
              "Edite elementos configuráveis diretamente",
              "Elementos podem ser reordenados arrastando",
              "Use o modo texto para digitar regex manualmente",
            ].map((tip, i) => (
              <p
                key={i}
                className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed"
              >
                {tip}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
