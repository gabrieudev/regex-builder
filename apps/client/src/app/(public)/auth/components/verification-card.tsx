'use client'

import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface VerificationCardProps {
	email: string
}

export default function VerificationCard({ email }: VerificationCardProps) {
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<Card className="border-none shadow-xl">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">Verifique seu e-mail</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6 text-center">
					<div className="flex justify-center">
						<Mail className="h-12 w-12 text-primary" />
					</div>
					<p className="text-muted-foreground">
						Enviamos um e-mail de verificação para <span className="font-medium text-foreground">{email}</span>. Por favor,
						verifique sua caixa de entrada e clique no link para ativar sua conta.
					</p>
					<div className="space-y-2">
						<p className="text-xs text-muted-foreground">Não recebeu? Verifique sua pasta de spam.</p>
					</div>
					<div className="pt-4">
						<Link href="/auth/login" className="text-sm text-primary hover:underline">
							Retornar ao login
						</Link>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}
