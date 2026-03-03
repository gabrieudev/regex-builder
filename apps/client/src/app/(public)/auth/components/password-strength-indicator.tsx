"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const calculateStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Muito fraca", mapKey: 0 };
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;

    const map: Record<number, { label: string }> = {
      0: { label: "Muito fraca" },
      1: { label: "Fraca" },
      2: { label: "Razoável" },
      3: { label: "Boa" },
      4: { label: "Forte" },
      5: { label: "Muito forte" },
    };
    return { score: strength, ...map[strength], mapKey: strength };
  };

  const { score, label, mapKey } = calculateStrength(password);
  const percentage = (score / 5) * 100;

  const indicatorClassMap: Record<number, string> = {
    0: "[&>div]:bg-destructive",
    1: "[&>div]:bg-destructive/80",
    2: "[&>div]:bg-warning",
    3: "[&>div]:bg-primary/80",
    4: "[&>div]:bg-primary",
    5: "[&>div]:bg-green-600",
  };

  const requirements = [
    { label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { label: "Letra minúscula", met: /[a-z]/.test(password) },
    { label: "Letra maiúscula", met: /[A-Z]/.test(password) },
    { label: "Número", met: /[0-9]/.test(password) },
    { label: "Caractere especial", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Força da senha:</span>
        <Badge
          variant="outline"
          className={score > 2 ? "border-primary text-primary" : ""}
        >
          {label}
        </Badge>
      </div>

      <Progress
        value={percentage}
        className={`h-2 ${indicatorClassMap[mapKey]}`}
      />

      <div className="grid grid-cols-2 gap-1 text-xs">
        {requirements.map((req, idx) => (
          <div key={idx} className="flex items-center gap-1">
            {req.met ? (
              <Check className="h-3 w-3 text-primary" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground/50" />
            )}
            <span
              className={req.met ? "text-foreground" : "text-muted-foreground"}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
