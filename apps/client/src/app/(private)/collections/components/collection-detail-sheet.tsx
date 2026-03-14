'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, BarChart3, Check, Copy, Loader2, Plus, Regex, Settings2, Trash2 } from 'lucide-react'
import { type JSX, useMemo, useState } from 'react'
import { FaJava, FaJs, FaPython } from 'react-icons/fa'
import { iconMap } from '../use-collections'

const LANGUAGES: {
	key: Language
	label: string
	icon: JSX.Element
	color: string
}[] = [
	{
		key: 'JAVASCRIPT',
		label: 'JavaScript',
		icon: <FaJs className="w-3 h-3" />,
		color: '#f7df1e',
	},
	{
		key: 'PYTHON',
		label: 'Python',
		icon: <FaPython className="w-3 h-3" />,
		color: '#3572A5',
	},
	{
		key: 'JAVA',
		label: 'Java',
		icon: <FaJava className="w-3 h-3" />,
		color: '#b07219',
	},
]

const LANG_COLOR: Record<string, string> = {
	JAVASCRIPT: '#f7df1e',
	PYTHON: '#4a9cc7',
	JAVA: '#c8832a',
}

function CopyBtn({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)
	return (
		<Button
			className="cursor-pointer"
			variant="ghost"
			size="icon-sm"
			onClick={() => {
				navigator.clipboard.writeText(text)
				setCopied(true)
				setTimeout(() => setCopied(false), 1200)
			}}
		>
			{copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
		</Button>
	)
}

interface Props {
	collection: Collection | null
	regexes: Regex[]
	onClose: () => void
	onEdit: () => void
	onDelete: () => void
	onRemoveRegex: (colId: string, regexId: string) => void
	onAddRegexes: (colId: string, regexIds: string[]) => void
	allRegexes: Regex[]
	isAddingRegex: boolean
	isRemovingRegex: boolean
}

export function CollectionDetailSheet({
	collection,
	regexes,
	onClose,
	onEdit,
	onDelete,
	onRemoveRegex,
	onAddRegexes,
	allRegexes,
	isAddingRegex,
	isRemovingRegex,
}: Props) {
	const [addSearch, setAddSearch] = useState('')
	const [selectedAddRegexIds, setSelectedAddRegexIds] = useState<string[]>([])

	const collectionRegexIds = useMemo(() => new Set((collection?.regexes ?? []).map((r) => r.id)), [collection?.regexes])

	const available = useMemo(() => {
		return allRegexes.filter(
			(r) =>
				!collectionRegexIds.has(r.id) &&
				(addSearch === '' ||
					r.name.toLowerCase().includes(addSearch.toLowerCase()) ||
					r.pattern.toLowerCase().includes(addSearch.toLowerCase())),
		)
	}, [allRegexes, collectionRegexIds, addSearch])

	if (!collection) return null

	const langBreakdown = regexes.reduce<Record<string, number>>((acc, r) => {
		acc[r.language] = (acc[r.language] || 0) + 1
		return acc
	}, {})
	const totalForPct = regexes.length || 1

	return (
		<Sheet open={!!collection} onOpenChange={(open) => !open && onClose()}>
			<SheetContent side="right" className="w-full sm:max-w-xl flex flex-col p-0 gap-0">
				<div
					className="px-6 pt-6 pb-4 border-b border-border shrink-0"
					style={{
						background: `linear-gradient(135deg, ${collection.color}10 0%, transparent 60%)`,
						borderBottomColor: `${collection.color}20`,
					}}
				>
					<div
						className="h-0.5 w-full mb-4 rounded-full"
						style={{
							background: `linear-gradient(90deg, ${collection.color}, ${collection.color}22)`,
						}}
					/>
					<SheetHeader>
						<div className="flex items-center gap-3 mb-1">
							<div
								className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
								style={{
									background: `${collection.color}15`,
									border: `1px solid ${collection.color}35`,
									boxShadow: `0 0 20px ${collection.color}20`,
								}}
							>
								{(() => {
									const IconComponent = collection.icon ? iconMap[collection.icon as keyof typeof iconMap] : null
									if (!IconComponent) return null
									return <IconComponent className="w-4 h-4" />
								})()}
							</div>
							<div>
								<SheetTitle className="text-base">{collection.name}</SheetTitle>
								<SheetDescription className="mt-0.5 line-clamp-1">{collection.description}</SheetDescription>
							</div>
						</div>

						<div className="flex items-center gap-2 flex-wrap mt-2">
							<Badge
								style={{
									borderColor: `${collection.color}33`,
									background: `${collection.color}12`,
									color: collection.color,
								}}
							>
								{collection.regexes.length} regexes
							</Badge>
							{collection.tags.map((tag) => (
								<Badge key={tag} variant="outline" className="text-[9px]">
									{tag}
								</Badge>
							))}
							<span className="text-[10px] font-mono text-muted-foreground ml-auto">
								atualizada {format(new Date(collection.updatedAt), 'dd/MM/yyyy')}
							</span>
						</div>
					</SheetHeader>
				</div>

				<div className="px-6 pt-4 shrink-0">
					<Tabs defaultValue="regexes" className="w-full">
						<TabsList className="w-full grid grid-cols-3">
							<TabsTrigger className="cursor-pointer" value="regexes">
								<Regex className="w-3 h-3 mr-1" /> Regex
							</TabsTrigger>
							<TabsTrigger className="cursor-pointer" value="stats">
								<BarChart3 className="w-3 h-3 mr-1" /> Estatísticas
							</TabsTrigger>
							<TabsTrigger className="cursor-pointer" value="settings">
								<Settings2 className="w-3 h-3 mr-1" /> Configurações
							</TabsTrigger>
						</TabsList>

						<TabsContent value="regexes">
							<ScrollArea className="h-[calc(100vh-320px)]">
								<div className="flex flex-col gap-2 pr-2 pb-4">
									<div className="flex items-center gap-2 mt-1">
										<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Nesta coleção</span>
										<div className="flex-1 h-px bg-border" />
									</div>
									<TooltipProvider delayDuration={200}>
										<AnimatePresence>
											{regexes.length === 0 && (
												<div className="rounded-lg border border-dashed border-border py-8 flex flex-col items-center gap-2">
													<span className="text-2xl opacity-20 text-muted-foreground">
														<AlertCircle className="w-6 h-6" />
													</span>
													<p className="text-[11px] font-mono text-muted-foreground">nenhuma regex ainda</p>
												</div>
											)}
											{regexes.map((r, i) => (
												<motion.div
													key={r.id}
													layout
													initial={{ opacity: 0, x: 12 }}
													animate={{ opacity: 1, x: 0 }}
													exit={{ opacity: 0, x: -12 }}
													transition={{ duration: 0.18, delay: i * 0.03 }}
													className="group rounded-lg border border-border bg-card hover:border-muted-foreground/30 transition-colors"
												>
													<div className="flex items-center gap-3 px-3 py-2.5">
														<span className="w-1 h-8 rounded-full shrink-0" style={{ background: LANG_COLOR[r.language] }} />
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-0.5">
																<span className="text-xs font-mono font-semibold text-foreground truncate">{r.name}</span>
																<span
																	className="text-[9px] font-mono font-bold px-1 rounded shrink-0"
																	style={{
																		color: LANG_COLOR[r.language],
																		background: `${LANG_COLOR[r.language]}15`,
																	}}
																>
																	{LANGUAGES.find((l) => l.key === r.language)?.icon}
																</span>
															</div>
															<Tooltip>
																<TooltipTrigger asChild>
																	<p
																		className="text-[11px] font-mono truncate cursor-default"
																		style={{ color: `${collection.color}bb` }}
																	>
																		{r.pattern}
																	</p>
																</TooltipTrigger>
																<TooltipContent
																	className="font-mono text-[11px] max-w-xs break-all"
																	style={{ color: collection.color }}
																>
																	{r.pattern}
																</TooltipContent>
															</Tooltip>
														</div>
														<div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
															<CopyBtn text={r.pattern} />
															<Button
																variant="ghost"
																size="icon-sm"
																className="hover:text-destructive cursor-pointer"
																onClick={() => onRemoveRegex(collection.id, r.id)}
																disabled={isRemovingRegex}
															>
																{isRemovingRegex ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
															</Button>
														</div>
													</div>
												</motion.div>
											))}
										</AnimatePresence>
									</TooltipProvider>

									<div className="flex items-center gap-2 mt-3">
										<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Adicionar regex</span>
										<div className="flex-1 h-px bg-border" />
									</div>

									<Command className="rounded-lg border border-border bg-popover">
										<CommandInput placeholder="Buscar regex disponíveis..." value={addSearch} onValueChange={setAddSearch} />
										<CommandList>
											<CommandEmpty>Nenhuma regex encontrada.</CommandEmpty>
											<CommandGroup>
												{available.map((r) => {
													const isSelected = selectedAddRegexIds.includes(r.id)
													return (
														<CommandItem
															key={r.id}
															onSelect={() => {
																setSelectedAddRegexIds((prev) => (isSelected ? prev.filter((id) => id !== r.id) : [...prev, r.id]))
															}}
															disabled={isAddingRegex}
															className="cursor-pointer"
														>
															<div
																className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
																	isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
																}`}
															>
																{isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
															</div>
															<div className="flex-1 min-w-0">
																<span className="text-xs font-mono">{r.name}</span>
																<span
																	className="text-[10px] font-mono text-muted-foreground/60 truncate block"
																	style={{ color: collection.color }}
																>
																	{r.pattern}
																</span>
															</div>
															<span className="text-[9px] font-mono shrink-0" style={{ color: LANG_COLOR[r.language] }}>
																{LANGUAGES.find((l) => l.key === r.language)?.icon}
															</span>
														</CommandItem>
													)
												})}
											</CommandGroup>
										</CommandList>
									</Command>

									{selectedAddRegexIds.length > 0 && (
										<Button
											size="sm"
											className="mt-2 w-full cursor-pointer"
											onClick={() => {
												onAddRegexes(collection.id, selectedAddRegexIds)
												setSelectedAddRegexIds([])
												setAddSearch('')
											}}
											disabled={isAddingRegex}
										>
											{isAddingRegex ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="w-3 h-3 mr-1" />}
											Adicionar {selectedAddRegexIds.length} regex(es)
										</Button>
									)}
								</div>
							</ScrollArea>
						</TabsContent>

						<TabsContent value="stats">
							<ScrollArea className="h-[calc(100vh-320px)]">
								<div className="flex flex-col gap-4 pr-2 pb-4">
									<div>
										<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-3">
											Distribuição de linguagens
										</span>
										<div className="flex flex-col gap-2">
											{Object.entries(langBreakdown).map(([lang, count]) => {
												const pct = Math.round((count / totalForPct) * 100)
												return (
													<div key={lang} className="flex flex-col gap-1">
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																<div className="w-2 h-2 rounded-full" style={{ background: LANG_COLOR[lang] }} />
																<span className="text-xs font-mono text-foreground/80">{lang}</span>
															</div>
															<span className="text-xs font-mono font-bold" style={{ color: LANG_COLOR[lang] }}>
																{count} · {pct}%
															</span>
														</div>
														<div className="h-1.5 rounded-full bg-muted overflow-hidden">
															<motion.div
																initial={{ width: 0 }}
																animate={{ width: `${pct}%` }}
																transition={{ duration: 0.6, ease: 'easeOut' }}
																className="h-full rounded-full"
																style={{ background: LANG_COLOR[lang] }}
															/>
														</div>
													</div>
												)
											})}
											{Object.keys(langBreakdown).length === 0 && (
												<p className="text-[11px] font-mono text-muted-foreground italic">nenhuma regex para analisar</p>
											)}
										</div>
									</div>

									<Separator className="bg-border" />

									<div className="grid grid-cols-2 gap-3">
										{[
											{
												label: 'Total de Regex',
												value: regexes.length,
												color: collection.color,
											},
											{
												label: 'Linguagens',
												value: Object.keys(langBreakdown).length,
												color: '#a855f7',
											},
											{
												label: 'Criada',
												value: format(new Date(collection.createdAt), 'dd/MM/yy'),
												color: '#10b981',
											},
											{
												label: 'Atualizada',
												value: format(new Date(collection.updatedAt), 'dd/MM/yy'),
												color: '#f59e0b',
											},
										].map(({ label, value, color }) => (
											<div key={label} className="rounded-xl border border-border bg-card p-3 flex flex-col gap-2">
												<span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
												<span className="text-xl font-black font-mono" style={{ color }}>
													{value}
												</span>
											</div>
										))}
									</div>
								</div>
							</ScrollArea>
						</TabsContent>

						<TabsContent value="settings">
							<div className="flex flex-col gap-4 pb-4">
								<div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
									<p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
										Configurações da coleção
									</p>
									<Button variant="secondary" size="sm" className="w-full justify-start gap-2 cursor-pointer" onClick={onEdit}>
										<Settings2 className="w-3.5 h-3.5" />
										Editar nome, cor e tags
									</Button>
								</div>
								<div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex flex-col gap-3">
									<p className="text-[10px] font-mono uppercase tracking-widest text-destructive/60">Zona de perigo</p>
									<p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
										Excluir uma coleção é permanente. As expressões regulares aqui não serão excluídas, apenas removidas desta
										coleção.
									</p>
									<Button variant="destructive" size="sm" className="w-full gap-2 cursor-pointer" onClick={onDelete}>
										<Trash2 className="w-3.5 h-3.5" />
										excluir esta coleção
									</Button>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</SheetContent>
		</Sheet>
	)
}
