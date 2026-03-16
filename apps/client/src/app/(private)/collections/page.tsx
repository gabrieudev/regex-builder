'use client'

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { AlertCircle, LayoutGrid, List, Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CollectionCard } from './components/collection-card'
import { CollectionDetailSheet } from './components/collection-detail-sheet'
import { CreateCollectionDialog } from './components/create-collection-dialog'
import { DeleteCollectionAlert } from './components/delete-collection-alert'
import { useCollections } from './use-collections'
import { LoadingSkeleton } from '@/components/loading-skeleton'

export default function CollectionsPage() {
	const c = useCollections()

	const handleCardDelete = (colId: string) => {
		const col = c.collections.find((x) => x.id === colId)
		if (col) c.openDelete(col)
	}

	const handleCardEdit = (colId: string) => {
		const col = c.collections.find((x) => x.id === colId)
		if (col) c.openEdit(col)
	}

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div
					className="absolute w-175 h-125 rounded-full opacity-[0.02] blur-[130px] bg-primary/10"
					style={{ top: '-100px', left: '-200px' }}
				/>
				<div
					className="absolute w-125 h-100 rounded-full opacity-[0.02] blur-[120px] bg-secondary/10"
					style={{ bottom: '-50px', right: '-100px' }}
				/>
				<div
					className="absolute w-75 h-75 rounded-full opacity-[0.015] blur-[80px] bg-accent/10"
					style={{
						top: '40%',
						left: '50%',
						transform: 'translate(-50%,-50%)',
					}}
				/>
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
						backgroundSize: '32px 32px',
						color: 'hsl(var(--foreground))',
					}}
				/>
			</div>

			<main className="relative z-10 flex-1 flex flex-col gap-6 px-6 py-6 max-w-360 w-full mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, delay: 0.05 }}
					className="flex flex-col gap-1"
				>
					<div className="flex items-center gap-3">
						<span className="w-1 h-7 rounded-full bg-linear-to-b from-success to-success/70 shadow-success-glow" />
						<div>
							<h2 className="text-lg font-black text-foreground tracking-wide">Coleções</h2>
							<p className="text-[11px] font-mono text-muted-foreground">
								Agrupe suas regex salvas em coleções temáticas para acesso mais fácil.
							</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, delay: 0.18 }}
					className="flex items-center gap-3 flex-wrap"
				>
					<div className="relative flex-1 min-w-50 max-w-xs">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
						<Input
							value={c.search}
							onChange={(e) => c.setSearch(e.target.value)}
							placeholder="buscar coleções..."
							className="pl-8"
						/>
					</div>

					<div className="flex-1" />

					<TooltipProvider delayDuration={200}>
						<div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-muted">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => c.setViewMode('grid')}
										data-active={c.viewMode === 'grid'}
										className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:border data-[active=true]:border-border cursor-pointer"
									>
										<LayoutGrid className="w-3.5 h-3.5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Visualização em grade</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => c.setViewMode('list')}
										data-active={c.viewMode === 'list'}
										className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:border data-[active=true]:border-border cursor-pointer"
									>
										<List className="w-3.5 h-3.5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Visualização em lista</TooltipContent>
							</Tooltip>
						</div>
					</TooltipProvider>

					<Button
						onClick={c.openCreate}
						className="gap-2 bg-success/10 border border-success/40 text-success hover:bg-success/20 shadow-success-glow cursor-pointer"
					>
						<Plus className="w-3.5 h-3.5" />
						Nova coleção
					</Button>
				</motion.div>

				<LayoutGroup>
					<AnimatePresence mode="wait">
						{c.isLoadingCollections ? (
							<motion.div
								key="loading"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex-1 flex items-center justify-center py-24"
							>
								<div className="w-full max-w-7xl px-4">
									<LoadingSkeleton viewMode={c.viewMode === 'grid' ? 'grid' : 'list'} count={c.viewMode === 'grid' ? 8 : 5} />
									<p className="sr-only">Carregando coleções...</p>
								</div>
							</motion.div>
						) : c.collections.length === 0 ? (
							<motion.div
								key="empty"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex-1 flex items-center justify-center py-24"
							>
								<div className="text-center flex flex-col items-center gap-4">
									<motion.div
										animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
										transition={{
											duration: 3,
											repeat: Infinity,
											repeatType: 'reverse',
										}}
										className="text-5xl opacity-20 text-muted-foreground"
									>
										<AlertCircle className="w-12 h-12" />
									</motion.div>
									<p className="text-sm font-mono text-muted-foreground">Nenhuma coleção encontrada</p>
									<Button onClick={c.openCreate} variant="outline" size="sm" className="gap-2">
										<Plus className="w-3 h-3" />
										Criar sua primeira coleção
									</Button>
								</div>
							</motion.div>
						) : c.viewMode === 'grid' ? (
							<motion.div
								key="grid"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
							>
								{c.collections.map((col, i) => (
									<CollectionCard
										key={col.id}
										collection={col}
										index={i}
										viewMode="grid"
										onOpen={() => c.setSelectedId(col.id)}
										onEdit={() => handleCardEdit(col.id)}
										onDelete={() => handleCardDelete(col.id)}
										onTogglePin={() => c.togglePin(col.id)}
										isUpdating={c.isUpdating}
									/>
								))}

								<motion.button
									layout
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										duration: 0.25,
										delay: c.collections.length * 0.06 + 0.1,
									}}
									onClick={c.openCreate}
									className="rounded-2xl border-2 border-dashed border-border hover:border-success/40 flex flex-col items-center justify-center gap-3 py-12 cursor-pointer transition-all duration-200 group min-h-50 bg-transparent hover:bg-success/5"
									whileHover={{
										borderColor: 'hsl(var(--success) / 0.4)',
										background: 'hsl(var(--success) / 0.05)',
									}}
								>
									<motion.div
										className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-dashed border-muted-foreground/30 group-hover:border-success/40 transition-colors"
										whileHover={{ rotate: 90 }}
										transition={{ type: 'spring', stiffness: 300 }}
									>
										<Plus className="w-5 h-5 text-muted-foreground group-hover:text-success transition-colors" />
									</motion.div>
									<span className="text-xs font-mono text-muted-foreground group-hover:text-success transition-colors">
										Nova coleção
									</span>
								</motion.button>
							</motion.div>
						) : (
							<motion.div
								key="list"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex flex-col gap-2"
							>
								{c.collections.map((col, i) => (
									<CollectionCard
										key={col.id}
										collection={col}
										index={i}
										viewMode="list"
										onOpen={() => c.setSelectedId(col.id)}
										onEdit={() => handleCardEdit(col.id)}
										onDelete={() => handleCardDelete(col.id)}
										onTogglePin={() => c.togglePin(col.id)}
										isUpdating={c.isUpdating}
									/>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</LayoutGroup>

				<div className="h-6" />
			</main>

			<CollectionDetailSheet
				collection={c.selectedCollection}
				regexes={c.selectedRegexes}
				onClose={() => c.setSelectedId(null)}
				onEdit={() => {
					if (c.selectedCollection) c.openEdit(c.selectedCollection)
				}}
				onDelete={() => {
					if (c.selectedCollection) c.openDelete(c.selectedCollection)
					c.setSelectedId(null)
				}}
				onRemoveRegex={c.removeRegexFromCollection}
				onAddRegexes={c.addRegexesToCollection}
				allRegexes={c.fetchedRegexes}
				isAddingRegex={c.isAddingRegex}
				isRemovingRegex={c.isRemovingRegex}
			/>

			<CreateCollectionDialog
				open={c.createOpen}
				editTarget={c.editTarget}
				form={c.form}
				onFormChange={c.setForm}
				onSave={c.saveCollection}
				onClose={c.closeCreate}
				isCreating={c.isCreating}
				isUpdating={c.isUpdating}
			/>

			<DeleteCollectionAlert
				target={c.deleteTarget}
				onConfirm={c.confirmDelete}
				onCancel={c.closeDelete}
				isDeleting={c.isDeleting}
			/>
		</div>
	)
}
