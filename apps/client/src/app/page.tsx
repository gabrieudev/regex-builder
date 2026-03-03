"use client";

import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Play, Save } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Play,
      title: "Runner interativo",
      description: "Teste suas regex em tempo real",
      details:
        "Veja as correspondências instantaneamente enquanto digita. Suporte a flags e grupos de captura.",
    },
    {
      icon: Save,
      title: "Gerenciamento pessoal",
      description: "Organize suas expressões favoritas",
      details:
        "Crie pastas, etiquete e busque expressões regulares salvas. Nunca mais reescreva padrões comuns.",
    },
    {
      icon: ArrowRight,
      title: "Exportação flexível",
      description: "Use em qualquer linguagem",
      details:
        "Exporte para JavaScript, Python, Java, PHP e outras com a sintaxe correta.",
    },
  ];

  const steps = [
    {
      title: "Construa visualmente",
      description:
        "Arraste e solte elementos ou digite livremente com realce de sintaxe.",
    },
    {
      title: "Teste com runner",
      description:
        "Execute contra múltiplas amostras de texto e veja os matches em destaque.",
    },
    {
      title: "Salve e gerencie",
      description:
        "Organize em coleções, adicione descrições e compartilhe com seu time.",
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col p-6">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold">RegexBuilder</span>
            <Badge variant="outline" className="ml-2 hidden sm:inline-block">
              Beta
            </Badge>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">Cadastrar</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="py-20 md:py-28 lg:py-32">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
            variants={fadeInUp}
          >
            Construa, teste e gerencie
            <span className="block text-primary">expressões regulares</span>
            com facilidade
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-muted-foreground md:text-xl"
            variants={fadeInUp}
          >
            Um ambiente visual interativo para criar, validar e organizar suas
            expressões regulares. Economize horas de debugging com nosso runner
            integrado e biblioteca pessoal de padrões.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            variants={fadeInUp}
          >
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/auth/signup">
                Começar grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-10 md:py-24">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="mt-2 text-muted-foreground">
            Ferramentas pensadas para iniciantes e especialistas.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.details}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-16 md:py-24">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold">Como funciona</h2>
          <p className="mt-2 text-muted-foreground">
            Três passos simples para dominar suas expressões regulares.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {index + 1}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <motion.div
          className="rounded-xl bg-primary/5 p-8 text-center md:p-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold">
            Pronto para simplificar suas expressões regulares?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Junte-se aos desenvolvedores que já estão usando o RegexBuilder para
            criar padrões mais limpos e com menos bugs.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Criar conta gratuita</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Já tenho uma conta</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
