import { motion } from 'framer-motion'

export function LoadingSkeleton({ viewMode = 'grid', count = 6 }: { viewMode?: ViewMode; count?: number }) {
	if (viewMode === 'grid') {
		return (
			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
				{Array.from({ length: count }).map((_, i) => (
					<motion.div
						key={`skel-${i}`}
						layout
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.2, delay: i * 0.03 }}
					>
						<div
							className="rounded-2xl border border-muted-foreground/10 p-4 min-h-50 flex flex-col gap-3 animate-pulse"
							aria-hidden
						>
							<div className="w-full h-36 rounded-md bg-muted-foreground/10" />
							<div className="h-3 bg-muted-foreground/10 rounded w-3/4" />
							<div className="h-3 bg-muted-foreground/10 rounded w-1/2" />
							<div className="mt-auto flex items-center justify-between gap-3">
								<div className="h-8 w-20 rounded bg-muted-foreground/10" />
								<div className="h-8 w-8 rounded bg-muted-foreground/10" />
							</div>
						</div>
					</motion.div>
				))}
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-2">
			{Array.from({ length: count }).map((_, i) => (
				<motion.div
					key={`skel-list-${i}`}
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.18, delay: i * 0.02 }}
				>
					<div className="flex items-center gap-4 p-3 rounded-md border border-muted-foreground/8 animate-pulse">
						<div className="w-12 h-12 rounded-md bg-muted-foreground/10" />
						<div className="flex-1">
							<div className="h-4 bg-muted-foreground/10 rounded w-1/2 mb-2" />
							<div className="h-3 bg-muted-foreground/10 rounded w-1/3" />
						</div>
						<div className="w-8 h-8 rounded bg-muted-foreground/10" />
					</div>
				</motion.div>
			))}
		</div>
	)
}
