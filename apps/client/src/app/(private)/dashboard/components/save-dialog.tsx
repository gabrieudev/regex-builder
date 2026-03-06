"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Props {
  open: boolean;
  pattern: string;
  onSave: (name: string) => void;
  onClose: () => void;
  loading?: boolean;
}

export function SaveDialog({ open, pattern, onSave, onClose, loading }: Props) {
  const [name, setName] = useState("");

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle className="text-sm font-mono text-gray-900 dark:text-gray-100">
            Salvar regex
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-3 py-2">
            <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400 mb-1">
              padrão
            </p>
            <p className="font-mono text-xs text-cyan-600 dark:text-cyan-400 break-all">
              {pattern || "—"}
            </p>
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-500 dark:text-gray-400 mb-2">
              nome
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSave(name)}
              placeholder="meu-padrao-regex"
              className="font-mono text-sm"
              autoFocus
            />
          </div>
          <Button
            onClick={() => onSave(name)}
            disabled={!name.trim() || !pattern || loading}
            className="w-full py-2.5 font-mono text-sm font-bold transition-all disabled:opacity-40"
            style={{
              background:
                name.trim() && pattern
                  ? "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(37,99,235,0.1))"
                  : undefined,
              borderColor:
                name.trim() && pattern ? "rgba(6,182,212,0.3)" : undefined,
              color: name.trim() && pattern ? "#06b6d4" : undefined,
            }}
          >
            salvar regex
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
