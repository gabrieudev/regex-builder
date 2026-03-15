import Link from 'next/link'
import { ArrowRight, Play, Save, Layers, Code } from 'lucide-react'

export default function HomePage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 text-center">
			{/* background effects */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className="absolute w-[32rem] h-[32rem] rounded-full opacity-20 dark:opacity-[0.05] blur-[120px] bg-cyan-500 -top-40 -left-40" />
				<div className="absolute w-[26rem] h-[26rem] rounded-full opacity-20 dark:opacity-[0.05] blur-[100px] bg-purple-600 bottom-0 right-0" />
			</div>

			<div className="relative z-10 max-w-4xl mx-auto">
				{/* logo */}
				<div className="mb-6 flex justify-center">
					<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-border flex items-center justify-center">
						<Code className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
					</div>
				</div>

				{/* title */}
				<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-foreground">
					Regex Builder
					<span className="block text-cyan-600 dark:text-cyan-400 mt-2">Documentação</span>
				</h1>

				{/* subtitle */}
				<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
					Aprenda a dominar expressões regulares com nossa ferramenta visual interativa. Construa, teste e gerencie padrões
					de forma intuitiva.
				</p>

				{/* buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
					<Link
						href="/docs/guides"
						className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition-colors"
					>
						Começar
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>

					<Link
						href="/docs"
						className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
					>
						Visão geral
					</Link>
				</div>

				{/* features */}
				<div className="grid md:grid-cols-3 gap-6 text-left">
					<div className="p-6 rounded-xl border border-border bg-card hover:border-cyan-500/40 transition-colors">
						<div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
							<Play className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
						</div>

						<h3 className="font-semibold mb-2 text-foreground">Runner interativo</h3>

						<p className="text-sm text-muted-foreground">
							Teste suas regex em tempo real com destaque de correspondências e grupos de captura.
						</p>
					</div>

					<div className="p-6 rounded-xl border border-border bg-card hover:border-cyan-500/40 transition-colors">
						<div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
							<Save className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
						</div>

						<h3 className="font-semibold mb-2 text-foreground">Gerenciamento pessoal</h3>

						<p className="text-sm text-muted-foreground">
							Salve, organize e categorize suas expressões favoritas em coleções.
						</p>
					</div>

					<div className="p-6 rounded-xl border border-border bg-card hover:border-cyan-500/40 transition-colors">
						<div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
							<Layers className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
						</div>

						<h3 className="font-semibold mb-2 text-foreground">Construtor visual</h3>

						<p className="text-sm text-muted-foreground">
							Arraste e solte elementos ou digite manualmente. Ideal para iniciantes e experts.
						</p>
					</div>
				</div>

				{/* footer */}
				<div className="mt-16 text-sm text-muted-foreground border-t border-border pt-8">
					<p>
						Precisa de ajuda? Confira nossos
						<Link href="/docs/guides" className="text-cyan-600 dark:text-cyan-400 hover:underline">
							{' '}
							guias{' '}
						</Link>
						ou a
						<Link href="/docs/api-reference" className="text-cyan-600 dark:text-cyan-400 hover:underline">
							{' '}
							referência da API
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	)
}
