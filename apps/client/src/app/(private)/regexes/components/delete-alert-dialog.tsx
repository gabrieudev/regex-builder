"use client";

import { TriangleAlert } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Props {
  target: Regex | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const LANG_BADGE: Record<
  string,
  "link" | "default" | "destructive" | "outline" | "secondary" | "ghost"
> = {
  JAVASCRIPT: "default",
  PYTHON: "secondary",
  JAVA: "outline",
};

export function DeleteAlertDialog({ target, onConfirm, onCancel }: Props) {
  return (
    <AlertDialog open={!!target} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "hsl(var(--destructive) / 0.1)",
                border: "1px solid hsl(var(--destructive) / 0.2)",
              }}
            >
              <TriangleAlert className="w-4 h-4 text-destructive" />
            </div>
            <AlertDialogTitle>Excluir Regex</AlertDialogTitle>
          </div>

          <AlertDialogDescription>
            Esta ação não pode ser desfeita. A seguinte regex será removida
            permanentemente da sua coleção.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {target && (
          <div className="rounded-lg border border-border bg-muted/20 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-bold text-foreground">
                {target.name}
              </span>
              <Badge variant={LANG_BADGE[target.language] ?? "outline"}>
                {target.language}
              </Badge>
            </div>
            <Separator />
            <span className="font-mono text-[11px] text-destructive/80 break-all leading-relaxed">
              {target.pattern}
            </span>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            excluir permanentemente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
