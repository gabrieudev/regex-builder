"use client";

import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarIcon, RotateCcw, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";

interface Props {
  filters: RegexFilters;
  hasActive: boolean;
  onUpdate: <K extends keyof RegexFilters>(
    key: K,
    value: RegexFilters[K],
  ) => void;
  onReset: () => void;
  totalItems: number;
}

export function FilterBar({
  filters,
  hasActive,
  onUpdate,
  onReset,
  totalItems,
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
            Filtros
          </span>
          <AnimatePresence>
            {hasActive && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Badge variant="default" className="text-[9px] px-1.5 py-0">
                  ativo
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-muted-foreground">
            {totalItems} resultado{totalItems !== 1 ? "s" : ""}
          </span>
          {hasActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-6 gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              limpar
            </Button>
          )}
        </div>
      </div>

      {/* Grid do filtro */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="flex flex-col gap-1.5 xl:col-span-1">
          <Label htmlFor="filter-name">Nome</Label>
          <Input
            id="filter-name"
            placeholder="buscar por nome..."
            value={filters.name}
            onChange={(e) => onUpdate("name", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 xl:col-span-1">
          <Label htmlFor="filter-like">
            Padrão{" "}
            <span className="text-primary/50 normal-case tracking-normal">
              (contém)
            </span>
          </Label>
          <Input
            id="filter-like"
            placeholder="busca parcial..."
            value={filters.patternLike}
            onChange={(e) => onUpdate("patternLike", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 xl:col-span-1">
          <Label htmlFor="filter-exact">
            Padrão{" "}
            <span className="text-secondary-foreground/50 normal-case tracking-normal">
              (exato)
            </span>
          </Label>
          <Input
            id="filter-exact"
            placeholder="padrão exato..."
            value={filters.patternExact}
            onChange={(e) => onUpdate("patternExact", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 xl:col-span-1">
          <Label>Idioma</Label>
          <Select
            value={filters.language}
            onValueChange={(v) => onUpdate("language", v as Language | "ALL")}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Todos idiomas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos idiomas</SelectItem>
              <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
              <SelectItem value="PYTHON">Python</SelectItem>
              <SelectItem value="JAVA">Java</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 xl:col-span-1">
          <Label>Criado a partir de</Label>
          <Popover>
            <PopoverTrigger className="cursor-pointer" asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left h-8 px-3 font-mono text-xs",
                  filters.dateFrom
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3 opacity-50 shrink-0" />
                {filters.dateFrom ? (
                  format(filters.dateFrom, "dd/MM/yyyy")
                ) : (
                  <span>Selecione...</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={filters.dateFrom}
                onSelect={(d) => onUpdate("dateFrom", d)}
              />
              {filters.dateFrom && (
                <div className="px-3 pb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => onUpdate("dateFrom", undefined)}
                  >
                    limpar
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-1.5 xl:col-span-1">
          <Label>Criado até</Label>
          <Popover>
            <PopoverTrigger className="cursor-pointer" asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left h-8 px-3 font-mono text-xs",
                  filters.dateTo ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3 opacity-50 shrink-0" />
                {filters.dateTo ? (
                  format(filters.dateTo, "dd/MM/yyyy")
                ) : (
                  <span>Selecione...</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Calendar
                mode="single"
                locale={ptBR}
                selected={filters.dateTo}
                onSelect={(d) => onUpdate("dateTo", d)}
              />
              {filters.dateTo && (
                <div className="px-3 pb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => onUpdate("dateTo", undefined)}
                  >
                    limpar
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
