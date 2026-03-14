'use client'

import { motion } from 'framer-motion'
import { Layers, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { COLOR_OPTIONS, iconMap } from '../use-collections'

interface Props {
	open: boolean
	editTarget: Collection | null
	form: CollectionForm
	onFormChange: (f: CollectionForm) => void
	onSave: () => void
	onClose: () => void
	isCreating: boolean
	isUpdating: boolean
}

export function CreateCollectionDialog({
	open,
	editTarget,
	form,
	onFormChange,
	onSave,
	onClose,
	isCreating,
	isUpdating,
}: Props) {
	const isEdit = !!editTarget
	const isValid = form.name.trim() !== ''
	const isLoading = isCreating || isUpdating

	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-2 mb-1">
						<div
							className="w-6 h-6 rounded-md flex items-center justify-center transition-colors duration-200"
							style={{
								background: `${form.color}18`,
								border: `1px solid ${form.color}35`,
							}}
						>
							<Layers className="w-3.5 h-3.5" style={{ color: form.color }} />
						</div>
						<DialogTitle>{isEdit ? 'Editar Coleção' : 'Nova Coleção'}</DialogTitle>
					</div>
					<DialogDescription>
						{isEdit ? 'Atualize nome, ícone, cor ou tags da coleção.' : 'Agrupe suas regex em uma coleção nomeada.'}
					</DialogDescription>
				</DialogHeader>

				<Separator />

				<div className="flex flex-col gap-4 py-1">
					<div className="flex flex-col gap-2">
						<Label htmlFor="col-name">Nome *</Label>
						<Input
							id="col-name"
							value={form.name}
							onChange={(e) => onFormChange({ ...form, name: e.target.value })}
							placeholder="ex: Documentos Brasileiros"
							disabled={isLoading}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="col-desc">Descrição</Label>
						<Textarea
							id="col-desc"
							value={form.description}
							onChange={(e) => onFormChange({ ...form, description: e.target.value })}
							placeholder="Que tipo de padrões esta coleção guarda?"
							rows={2}
							disabled={isLoading}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Cor</Label>
						<div className="flex gap-2 flex-wrap">
							{COLOR_OPTIONS.map((color) => (
								<motion.button
									key={color}
									whileHover={{ scale: 1.15 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => !isLoading && onFormChange({ ...form, color })}
									className="w-7 h-7 rounded-full transition-all duration-150 focus:outline-none cursor-pointer"
									style={{
										background: color,
										boxShadow:
											form.color === color
												? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${color}, 0 0 12px ${color}80`
												: `0 0 0 1px ${color}44`,
										opacity: form.color === color ? 1 : 0.55,
									}}
									disabled={isLoading}
								/>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Ícone</Label>
						<div className="flex gap-1.5 flex-wrap">
							{Object.entries(iconMap).map(([key, Icon]) => (
								<motion.button
									key={key}
									whileHover={{ scale: 1.2, rotate: 8 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => !isLoading && onFormChange({ ...form, icon: key })}
									className="w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all duration-150 focus:outline-none cursor-pointer"
									style={{
										background: form.icon === key ? `${form.color}20` : 'hsl(var(--muted))',
										border: form.icon === key ? `1px solid ${form.color}50` : '1px solid hsl(var(--border))',
										boxShadow: form.icon === key ? `0 0 8px ${form.color}30` : 'none',
									}}
									disabled={isLoading}
								>
									<Icon />
								</motion.button>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="col-tags">
							Tags <span className="normal-case text-muted-foreground tracking-normal">(separadas por vírgula)</span>
						</Label>
						<Input
							id="col-tags"
							value={form.tags}
							onChange={(e) => onFormChange({ ...form, tags: e.target.value })}
							placeholder="validação, brasil, documentos"
							disabled={isLoading}
						/>
					</div>

					<div
						className="rounded-xl border p-3 flex items-center gap-3 transition-all duration-300"
						style={{
							borderColor: `${form.color}30`,
							background: `${form.color}08`,
						}}
					>
						<div
							className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
							style={{
								background: `${form.color}18`,
								border: `1px solid ${form.color}35`,
							}}
						>
							{(() => {
								const IconComponent = form.icon ? iconMap[form.icon as keyof typeof iconMap] : null
								if (!IconComponent) return null
								return <IconComponent className="w-4 h-4" />
							})()}
						</div>
						<div className="min-w-0">
							<p className="font-mono font-bold text-sm text-foreground truncate">
								{form.name || <span className="text-muted-foreground">Nome da coleção</span>}
							</p>
							<div className="h-0.5 w-8 rounded-full mt-1 transition-all duration-300" style={{ background: form.color }} />
						</div>
					</div>
				</div>

				<Separator />

				<DialogFooter>
					<Button className="cursor-pointer" variant="outline" onClick={onClose} disabled={isLoading}>
						cancelar
					</Button>
					<Button
						className="cursor-pointer"
						onClick={onSave}
						disabled={!isValid || isLoading}
						style={
							isValid && !isLoading
								? {
										background: `${form.color}18`,
										border: `1px solid ${form.color}44`,
										color: form.color,
									}
								: {}
						}
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isEdit ? 'salvar alterações' : 'criar coleção'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
