'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, ExternalLink, Loader2, Pencil, Pin, PinOff, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { iconMap } from '../use-collections'

const LANG_COLOR: Record<string, string> = {
	JAVASCRIPT: '#f7df1e',
	PYTHON: '#4a9cc7',
	JAVA: '#c8832a',
}

interface Props {
	collection: Collection
	onOpen: () => void
	onEdit: () => void
	onDelete: () => void
	onTogglePin: () => void
	index: number
	viewMode: 'grid' | 'list'
	isUpdating: boolean
}

export function CollectionCard({
	collection,
	onOpen,
	onEdit,
	onDelete,
	onTogglePin,
	index,
	viewMode,
	isUpdating,
}: Props) {
	const [hovered, setHovered] = useState(false)

	const langBreakdown = collection.regexes.reduce<Record<string, number>>((acc, r) => {
		acc[r.language] = (acc[r.language] || 0) + 1
		return acc
	}, {})

	const previewPatterns = collection.regexes.slice(0, 4)
	const totalLangs = Object.keys(langBreakdown).length

	if (viewMode === 'list') {
		return (
			<motion.div
				layout
				initial={{ opacity: 0, x: -12 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -12 }}
				transition={{ duration: 0.2, delay: index * 0.04 }}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				className="group rounded-xl transition-all border border-border duration-200 cursor-pointer bg-card"
				style={{
					borderColor: hovered ? `${collection.color}44` : undefined,
					background: hovered ? `${collection.color}06` : undefined,
					boxShadow: hovered ? `0 0 20px ${collection.color}0d` : 'none',
				}}
				onClick={onOpen}
			>
				<div className="flex items-center gap-4 px-5 py-4">
					<div
						className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-200"
						style={{
							background: `${collection.color}15`,
							border: `1px solid ${collection.color}30`,
							transform: hovered ? 'scale(1.08)' : 'scale(1)',
						}}
					>
						{(() => {
							const IconComponent = collection.icon ? iconMap[collection.icon as keyof typeof iconMap] : null
							if (!IconComponent) return null
							return <IconComponent className="w-4 h-4" />
						})()}
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-0.5">
							<span className="font-mono font-bold text-sm text-foreground truncate">{collection.name}</span>
							{collection.pinned && <Pin className="w-3 h-3 shrink-0" style={{ color: collection.color }} />}
						</div>
						<p className="text-[11px] text-muted-foreground font-mono truncate">{collection.description}</p>
					</div>

					<div className="hidden md:flex items-center gap-1.5 shrink-0">
						{collection.tags.slice(0, 2).map((tag) => (
							<Badge key={tag} variant="outline" className="text-[9px] px-1.5">
								{tag}
							</Badge>
						))}
					</div>

					<div className="flex items-center gap-1 shrink-0">
						{Object.entries(langBreakdown).map(([lang, count]) => (
							<div key={lang} className="flex items-center gap-1">
								<div className="w-2 h-2 rounded-full" style={{ background: LANG_COLOR[lang] }} />
								<span className="text-[10px] font-mono" style={{ color: LANG_COLOR[lang] }}>
									{count}
								</span>
							</div>
						))}
					</div>

					<span className="text-sm font-black font-mono shrink-0" style={{ color: collection.color }}>
						{collection.regexes.length}
					</span>

					<div
						className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
						onClick={(e) => e.stopPropagation()}
					>
						<TooltipProvider delayDuration={200}>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button className="cursor-pointer" variant="ghost" size="icon-sm" onClick={onTogglePin} disabled={isUpdating}>
										{isUpdating ? (
											<Loader2 className="w-3.5 h-3.5 animate-spin" />
										) : collection.pinned ? (
											<PinOff className="w-3.5 h-3.5" />
										) : (
											<Pin className="w-3.5 h-3.5" />
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>{collection.pinned ? 'Desafixar' : 'Fixar'}</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="icon-sm" onClick={onEdit} className="hover:text-primary cursor-pointer">
										<Pencil className="w-3.5 h-3.5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Editar</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="ghost" size="icon-sm" onClick={onDelete} className="hover:text-destructive cursor-pointer">
										<Trash2 className="w-3.5 h-3.5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Excluir</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
				</div>
			</motion.div>
		)
	}

	// Modo grid
	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.92, y: 16 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.92 }}
			transition={{ duration: 0.25, delay: index * 0.06 }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className="group rounded-2xl border border-border bg-card flex flex-col overflow-hidden cursor-pointer transition-all duration-300"
			style={{
				borderColor: hovered ? `${collection.color}55` : undefined,
				background: 'hsl(var(--card))',
				boxShadow: hovered ? `0 0 40px ${collection.color}14, 0 0 0 1px ${collection.color}20` : 'none',
			}}
			onClick={onOpen}
		>
			<div
				className="h-1 w-full transition-all duration-300"
				style={{
					background: `linear-gradient(90deg, ${collection.color}, ${collection.color}44)`,
					opacity: hovered ? 1 : 0.5,
				}}
			/>

			<div className="p-5 pb-3 flex items-start justify-between gap-3">
				<div className="flex items-center gap-3 min-w-0">
					<motion.div
						animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
						transition={{ type: 'spring', stiffness: 400, damping: 20 }}
						className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
						style={{
							background: `${collection.color}15`,
							border: `1px solid ${collection.color}30`,
							boxShadow: hovered ? `0 0 16px ${collection.color}25` : 'none',
						}}
					>
						{(() => {
							const IconComponent = collection.icon ? iconMap[collection.icon as keyof typeof iconMap] : null
							if (!IconComponent) return null
							return <IconComponent className="w-4 h-4" />
						})()}
					</motion.div>
					<div className="min-w-0">
						<div className="flex items-center gap-1.5">
							<span className="font-mono font-bold text-sm text-foreground truncate">{collection.name}</span>
							{collection.pinned && <Pin className="w-3 h-3 shrink-0" style={{ color: collection.color }} />}
						</div>
						<div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
							{collection.tags.slice(0, 2).map((tag) => (
								<Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0 h-4">
									{tag}
								</Badge>
							))}
						</div>
					</div>
				</div>

				<div
					className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
					onClick={(e) => e.stopPropagation()}
				>
					<TooltipProvider delayDuration={200}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button className="cursor-pointer" variant="ghost" size="icon-sm" onClick={onTogglePin} disabled={isUpdating}>
									{isUpdating ? (
										<Loader2 className="w-3.5 h-3.5 animate-spin" />
									) : collection.pinned ? (
										<PinOff className="w-3.5 h-3.5" />
									) : (
										<Pin className="w-3.5 h-3.5" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>{collection.pinned ? 'Desafixar' : 'Fixar'}</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="icon-sm" onClick={onEdit} className="hover:text-primary cursor-pointer">
									<Pencil className="w-3 h-3" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Editar</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button variant="ghost" size="icon-sm" onClick={onDelete} className="hover:text-destructive cursor-pointer">
									<Trash2 className="w-3 h-3" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Excluir</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			<p className="px-5 text-[11px] font-mono leading-relaxed line-clamp-2 mb-3">
				{collection.description || 'Sem descrição.'}
			</p>

			<div
				className="mx-5 mb-4 rounded-lg border overflow-hidden"
				style={{
					borderColor: `${collection.color}40`,
					background: `linear-gradient(180deg, ${collection.color}08, hsl(var(--muted)/0.4))`,
				}}
			>
				<div className="px-3 py-1.5 border-b flex items-center gap-1.5" style={{ borderColor: `${collection.color}30` }}>
					<div
						className="w-2 h-2 rounded-full"
						style={{
							background: collection.color,
							boxShadow: `0 0 6px ${collection.color}`,
						}}
					/>
					<span className="text-[9px] font-mono uppercase tracking-widest font-semibold" style={{ color: collection.color }}>
						padrões
					</span>
				</div>

				<div className="px-3 py-2 flex flex-col gap-1.5">
					<AnimatePresence>
						{previewPatterns.length > 0 ? (
							previewPatterns.map((r, i) => (
								<motion.div
									key={r.id}
									initial={{ opacity: 0, x: -6 }}
									animate={{ opacity: hovered ? 1 : 0.7, x: 0 }}
									transition={{ delay: i * 0.05 + 0.1 }}
									className="flex items-center gap-2"
								>
									<span
										className="w-1.5 h-1.5 rounded-full shrink-0"
										style={{
											background: LANG_COLOR[r.language],
											boxShadow: `0 0 4px ${LANG_COLOR[r.language]}`,
										}}
									/>

									<span
										className="font-mono text-[10px] truncate"
										style={{
											color: hovered ? collection.color : 'hsl(var(--foreground))',
										}}
									>
										{r.pattern}
									</span>
								</motion.div>
							))
						) : (
							<span className="text-[10px] font-mono text-muted-foreground italic">coleção vazia</span>
						)}
					</AnimatePresence>

					{collection.regexes.length > 4 && (
						<span className="text-[9px] font-mono mt-0.5" style={{ color: `${collection.color}cc` }}>
							+{collection.regexes.length - 4} mais...
						</span>
					)}
				</div>
			</div>

			<div className="mt-auto px-5 py-3 border-t border-border flex items-center justify-between">
				<div className="flex items-center gap-2">
					{Object.entries(langBreakdown).map(([lang, count]) => (
						<div key={lang} className="flex items-center gap-1">
							<div className="w-2 h-2 rounded-full" style={{ background: LANG_COLOR[lang] }} />
							<span className="text-[9px] font-mono text-muted-foreground">{count}</span>
						</div>
					))}
					{totalLangs === 0 && <span className="text-[9px] font-mono text-muted-foreground">—</span>}
				</div>
				<div className="flex items-center gap-2">
					<span className="text-[11px] font-mono text-muted-foreground">
						{collection.regexes.length} regex
						{collection.regexes.length !== 1 ? 's' : ''}
					</span>
					<motion.div animate={{ x: hovered ? 2 : 0, opacity: hovered ? 1 : 0.4 }} transition={{ duration: 0.2 }}>
						<ExternalLink className="w-3 h-3" style={{ color: collection.color }} />
					</motion.div>
				</div>
			</div>
		</motion.div>
	)
}
