'use client'

import { motion } from 'framer-motion'

import { useRouter } from 'next/navigation'
import { PaginationBar } from '../../../components/pagination-bar'
import { DeleteAlertDialog } from './components/delete-alert-dialog'
import { FilterBar } from './components/filter-bar'
import { RegexTable } from './components/regex-table'
import { useRegexManager } from './use-regexes'

export default function RegexesPage() {
	const mgr = useRegexManager()
	const router = useRouter()

	const handleEdit = (regex: Regex) => {
		router.push(`/dashboard?id=${regex.id}`)
	}

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<div className="fixed inset-0 pointer-events-none overflow-hidden dark:opacity-100 opacity-0 transition-opacity">
				<div
					className="absolute w-150 h-100 rounded-full opacity-[0.03] blur-[120px]"
					style={{ background: '#a855f7', top: '-80px', right: '-120px' }}
				/>
				<div
					className="absolute w-100 h-100 rounded-full opacity-[0.025] blur-[100px]"
					style={{ background: '#00d4ff', bottom: '0', left: '-80px' }}
				/>
				<div
					className="absolute inset-0 opacity-[0.012]"
					style={{
						backgroundImage:
							'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)',
						backgroundSize: '40px 40px',
					}}
				/>
			</div>

			<main className="relative z-10 flex-1 flex flex-col gap-4 p-6 max-w-350 w-full mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, delay: 0.1 }}
					className="flex items-center gap-3"
				>
					<div className="flex items-center gap-2">
						<span
							className="w-1 h-6 rounded-full"
							style={{
								background: 'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--primary) / 0.5))',
								boxShadow: '0 0 8px hsl(var(--primary) / 0.5)',
							}}
						/>
						<h2 className="text-base font-bold text-foreground tracking-wide">Regex Salvas</h2>
					</div>
					<div className="flex-1 h-px bg-border" />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, delay: 0.15 }}
				>
					<FilterBar
						filters={mgr.filters}
						hasActive={mgr.hasActiveFilters}
						onUpdate={mgr.updateFilter}
						onReset={mgr.resetFilters}
						totalItems={mgr.totalItems}
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, delay: 0.2 }}
				>
					<RegexTable
						items={mgr.regexes}
						sortField={mgr.sortField}
						sortDir={mgr.sortDir}
						onSort={mgr.toggleSort}
						onEdit={handleEdit}
						onDelete={mgr.openDelete}
						isLoadingRegexes={mgr.isLoadingRegexes}
					/>
				</motion.div>

				{mgr.totalItems > 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.25 }}
						className="rounded-xl border border-border bg-background px-4 py-3"
					>
						<PaginationBar
							page={mgr.page}
							totalPages={mgr.totalPages}
							totalItems={mgr.totalItems}
							pageSize={mgr.pageSize}
							pageSizeOptions={mgr.pageSizeOptions}
							onPageChange={mgr.goToPage}
							onPageSizeChange={mgr.updatePageSize}
						/>
					</motion.div>
				)}

				<div className="h-4" />
			</main>

			<DeleteAlertDialog target={mgr.deleteTarget} onConfirm={mgr.confirmDelete} onCancel={mgr.closeDelete} />
		</div>
	)
}
