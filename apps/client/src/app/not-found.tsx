'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Home, PieChart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-secondary/20 p-4">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: 'easeOut' }}
				className="relative z-10 w-full max-w-md"
			>
				<Card className="overflow-hidden border-0 bg-background/60 p-8 backdrop-blur-xl">
					<div className="flex flex-col items-center text-center">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
							className="relative mb-6"
						>
							<div className="relative">
								<PieChart className="h-24 w-24 text-muted-foreground/30" strokeWidth={1.5} />
								<motion.div
									initial={{ rotate: 0 }}
									animate={{ rotate: [0, 15, -15, 0] }}
									transition={{ delay: 0.5, duration: 0.5 }}
									className="absolute inset-0 flex items-center justify-center"
								>
									<AlertCircle className="h-12 w-12 text-destructive/80" />
								</motion.div>
							</div>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.4 }}
							className="mb-2 text-7xl font-bold"
						>
							<span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">404</span>
						</motion.h1>

						<motion.h2
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.4 }}
							className="mb-2 text-2xl font-semibold"
						>
							Página não encontrada
						</motion.h2>

						<motion.p
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5, duration: 0.4 }}
							className="mb-6 text-muted-foreground"
						>
							Parece que esta página não existe. Que tal voltar para a página inicial e tentar novamente?
						</motion.p>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.6, duration: 0.3 }}
						>
							<Button asChild size="lg" className="gap-2">
								<Link href="/dashboard">
									<Home className="h-4 w-4" />
									Voltar para o início
								</Link>
							</Button>
						</motion.div>
					</div>
				</Card>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.8, duration: 0.4 }}
					className="mt-4 text-center text-xs text-muted-foreground"
				>
					Se você acha que isso é um erro, entre em contato com o suporte.
				</motion.p>
			</motion.div>
		</div>
	)
}
