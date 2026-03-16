'use client'

import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ArrowUpDown, CircleAlert, Copy, Pencil, Trash2 } from 'lucide-react'
import { type JSX, useState } from 'react'
import { FaJava, FaJs, FaPython } from 'react-icons/fa'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { LoadingSkeleton } from '@/components/loading-skeleton'

interface Props {
	items: Regex[]
	sortField: SortField
	sortDir: SortDir
	onSort: (field: SortField) => void
	onEdit: (r: Regex) => void
	onDelete: (r: Regex) => void
	isLoadingRegexes: boolean
}

const LANG_BADGE: Record<string, 'python' | 'java' | 'javascript' | 'outline'> = {
	JAVASCRIPT: 'javascript',
	PYTHON: 'python',
	JAVA: 'java',
}

const LANG_LABEL: Record<string, JSX.Element> = {
	JAVASCRIPT: <FaJs className="w-3 h-3" />,
	PYTHON: <FaPython className="w-3 h-3" />,
	JAVA: <FaJava className="w-3 h-3" />,
}

function SortIcon({ active, dir }: { field: string; active: boolean; dir: SortDir }) {
	if (!active) return <ArrowUpDown className="w-3 h-3 text-muted-foreground/30" />
	return dir === 'asc' ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />
}

function SortableHead({
	field,
	label,
	sortField,
	sortDir,
	onSort,
	className,
}: {
	field: SortField
	label: string
	sortField: SortField
	sortDir: SortDir
	onSort: (f: SortField) => void
	className?: string
}) {
	const isActive = sortField === field
	return (
		<TableHead className={className}>
			<button
				onClick={() => onSort(field)}
				className={cn(
					'flex items-center gap-1.5 hover:text-foreground/80 transition-colors group cursor-pointer',
					isActive && 'text-primary',
				)}
			>
				{label}
				<SortIcon field={field} active={isActive} dir={sortDir} />
			</button>
		</TableHead>
	)
}

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)
	const handleCopy = () => {
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true)
			setTimeout(() => setCopied(false), 1200)
		})
	}
	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button className="cursor-pointer" variant="ghost" size="icon-sm" onClick={handleCopy}>
						<Copy className={cn('w-3 h-3', copied && 'text-green-500')} />
					</Button>
				</TooltipTrigger>
				<TooltipContent>{copied ? 'Copiado!' : 'Copiar padrão'}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export function RegexTable({ items, sortField, sortDir, onSort, onEdit, onDelete, isLoadingRegexes }: Props) {
	if (isLoadingRegexes) {
		return (
			<motion.div
				key="loading"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="flex-1 flex items-center justify-center py-24"
			>
				<div className="w-full max-w-7xl px-4">
					<LoadingSkeleton viewMode="list" count={5} />
					<p className="sr-only">Carregando coleções...</p>
				</div>
			</motion.div>
		)
	}

	if (items.length === 0) {
		return (
			<div className="rounded-xl border border-border bg-background flex items-center justify-center py-20">
				<div className="text-center">
					<CircleAlert className="mx-auto mb-4 w-8 h-8 text-muted-foreground" />
					<p className="text-xs font-mono text-muted-foreground">Nenhuma regex encontrada</p>
					<p className="text-[10px] font-mono text-muted-foreground/50 mt-1">Tente ajustar seus filtros</p>
				</div>
			</div>
		)
	}

	return (
		<TooltipProvider delayDuration={300}>
			<div className="rounded-xl border border-border bg-background overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-border">
							<SortableHead field="name" label="Nome" sortField={sortField} sortDir={sortDir} onSort={onSort} />
							<TableHead>Padrão</TableHead>
							<SortableHead
								field="language"
								label="Idioma"
								sortField={sortField}
								sortDir={sortDir}
								onSort={onSort}
								className="w-20"
							/>
							<SortableHead
								field="createdAt"
								label="Criado em"
								sortField={sortField}
								sortDir={sortDir}
								onSort={onSort}
								className="w-24"
							/>
							<TableHead className="w-24 text-right">Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<AnimatePresence mode="popLayout">
							{items.map((item, idx) => (
								<motion.tr
									key={item.id}
									initial={{ opacity: 0, y: -4 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 4 }}
									transition={{ duration: 0.15, delay: idx * 0.03 }}
									className="border-b border-border transition-colors hover:bg-muted/50 group"
								>
									<TableCell className="px-3 py-2">
										<span className="font-mono text-xs font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
											{item.name}
										</span>
									</TableCell>

									<TableCell className="px-3 py-2">
										<div className="flex items-center gap-2 max-w-xs">
											<Tooltip>
												<TooltipTrigger asChild>
													<span
														className="font-mono text-[11px] text-primary truncate max-w-50 cursor-default"
														style={{ display: 'block' }}
													>
														{item.pattern}
													</span>
												</TooltipTrigger>
												<TooltipContent className="max-w-xs font-mono text-[11px] break-all">{item.pattern}</TooltipContent>
											</Tooltip>
											<CopyButton text={item.pattern} />
										</div>
									</TableCell>

									<TableCell className="px-3 py-2">
										<Badge variant={LANG_BADGE[item.language] ?? 'outline'}>
											{LANG_LABEL[item.language]} · {item.language}
										</Badge>
									</TableCell>

									<TableCell className="px-3 py-2">
										<Tooltip>
											<TooltipTrigger asChild>
												<span className="text-[11px] font-mono text-muted-foreground cursor-default">
													{format(new Date(item.createdAt), 'dd/MM/yyyy')}
												</span>
											</TooltipTrigger>
											<TooltipContent>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm:ss')}</TooltipContent>
										</Tooltip>
									</TableCell>

									<TableCell className="px-3 py-2">
										<div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														variant="ghost"
														size="icon-sm"
														onClick={() => onEdit(item)}
														className="hover:text-yellow-500 hover:bg-yellow-500/10 cursor-pointer"
													>
														<Pencil className="w-3.5 h-3.5" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>Editar regex</TooltipContent>
											</Tooltip>

											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														variant="ghost"
														size="icon-sm"
														onClick={() => onDelete(item)}
														className="hover:text-destructive hover:bg-destructive/10 cursor-pointer"
													>
														<Trash2 className="w-3.5 h-3.5" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>Excluir regex</TooltipContent>
											</Tooltip>
										</div>
									</TableCell>
								</motion.tr>
							))}
						</AnimatePresence>
					</TableBody>
				</Table>
			</div>
		</TooltipProvider>
	)
}
