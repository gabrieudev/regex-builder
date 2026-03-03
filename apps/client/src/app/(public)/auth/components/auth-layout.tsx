"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Braces,
  Code2,
  GitBranch,
  Lock,
  Mail,
  Phone,
  Regex,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const floatingIcons = [
    { Icon: Regex, delay: 0, x: "10%", y: "15%" },
    { Icon: Braces, delay: 0.2, x: "80%", y: "20%" },
    { Icon: Code2, delay: 0.4, x: "15%", y: "70%" },
    { Icon: GitBranch, delay: 0.6, x: "70%", y: "80%" },
    { Icon: Sparkles, delay: 0.8, x: "45%", y: "40%" },
  ];

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 backdrop-blur-sm bg-background/50"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <div className="hidden lg:flex relative h-full min-h-0 bg-linear-to-br from-primary/90 via-primary/60 to-primary/30 dark:from-primary/40 dark:via-primary/30 dark:to-primary/20 flex-col items-center justify-center p-12 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 dark:opacity-30" />

        {floatingIcons.map(({ Icon, delay, x, y }, i) => (
          <motion.div
            key={i}
            className="absolute text-white/20 dark:text-white/10"
            style={{ left: x, top: y }}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay, duration: 1, type: "spring" }}
          >
            <Icon size={48} />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white shadow-2xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Regex className="h-5 w-5" />
                Expressões prontas para usar
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="font-mono bg-white/20 px-2 py-1 rounded">{`^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$`}</span>
                  <span className="text-white/70 flex items-center gap-1">
                    <Mail className="h-4 w-4" /> Email
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono bg-white/20 px-2 py-1 rounded">{`^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$`}</span>
                  <span className="text-white/70 flex items-center gap-1">
                    <Lock className="h-4 w-4" /> Senha forte
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-mono bg-white/20 px-2 py-1 rounded">{`^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$`}</span>
                  <span className="text-white/70 flex items-center gap-1">
                    <Phone className="h-4 w-4" /> Telefone
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 mt-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-2">Regex Builder</h1>
          <p className="text-lg opacity-90 max-w-md">
            Crie, teste e gerencie expressões regulares com uma interface
            moderna e intuitiva.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 bg-background min-h-0 h-full overflow-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] lg:hidden" />
    </div>
  );
}
