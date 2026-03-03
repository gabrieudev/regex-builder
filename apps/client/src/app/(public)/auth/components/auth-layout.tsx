"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, RegexIcon } from "lucide-react";
import { FaCode, FaRegFileCode } from "react-icons/fa";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>

      <div className="hidden lg:flex relative bg-linear-to-br from-primary/80 via-primary/50 to-primary/30 dark:from-primary/30 dark:via-primary/20 dark:to-primary/10 flex-col items-center justify-center p-12 text-white">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 dark:opacity-20" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Regex Builder</h1>
          <p className="text-lg opacity-90">
            Construa expressões regulares de forma fácil e intuitiva, sem
            precisar se preocupar com a sintaxe complexa.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl">
                <RegexIcon />
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl">
                <FaRegFileCode />
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl">
                <FaCode />
              </span>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
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

      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] lg:hidden" />
    </div>
  );
}
