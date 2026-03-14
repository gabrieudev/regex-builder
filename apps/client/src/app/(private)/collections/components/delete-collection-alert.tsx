'use client'

import { Loader2, TriangleAlert } from 'lucide-react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { iconMap } from '../use-collections'

interface Props {
	target: Collection | null
	onConfirm: () => void
	onCancel: () => void
	isDeleting: boolean
}

export function DeleteCollectionAlert({ target, onConfirm, onCancel, isDeleting }: Props) {
	return (
		<AlertDialog open={!!target} onOpenChange={(open) => !open && onCancel()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className="flex items-center gap-3 mb-1">
						<div
							className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
							style={{ background: '#f43f5e12', border: '1px solid #f43f5e33' }}
						>
							<TriangleAlert className="w-4 h-4 text-destructive" />
						</div>
						<AlertDialogTitle>Excluir Coleção</AlertDialogTitle>
					</div>
					<AlertDialogDescription>
						Esta ação é permanente. As expressões regulares aqui não serão excluídas, apenas removidas desta coleção.
					</AlertDialogDescription>
				</AlertDialogHeader>

				{target && (
					<div
						className="rounded-xl border p-4 flex items-center gap-3"
						style={{
							borderColor: `${target.color}30`,
							background: `${target.color}08`,
						}}
					>
						<div
							className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
							style={{
								background: `${target.color}18`,
								border: `1px solid ${target.color}35`,
							}}
						>
							{(() => {
								const IconComponent = target.icon ? iconMap[target.icon as keyof typeof iconMap] : null
								if (!IconComponent) return null
								return <IconComponent className="w-4 h-4" />
							})()}
						</div>
						<div className="min-w-0 flex-1">
							<p className="font-mono font-bold text-sm text-foreground truncate">{target.name}</p>
							<div className="flex items-center gap-2 mt-1">
								<Badge
									style={{
										borderColor: `${target.color}33`,
										background: `${target.color}12`,
										color: target.color,
									}}
									className="text-[9px]"
								>
									{target.regexes.length} regexes
								</Badge>
								{target.tags.slice(0, 2).map((t) => (
									<Badge key={t} variant="outline" className="text-[9px]">
										{t}
									</Badge>
								))}
							</div>
						</div>
					</div>
				)}

				<AlertDialogFooter>
					<AlertDialogCancel className="cursor-pointer" onClick={onCancel} disabled={isDeleting}>
						cancelar
					</AlertDialogCancel>
					<AlertDialogAction className="cursor-pointer" onClick={onConfirm} disabled={isDeleting}>
						{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						excluir coleção
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
