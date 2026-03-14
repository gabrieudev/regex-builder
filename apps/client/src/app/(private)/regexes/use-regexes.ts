'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { format } from 'date-fns'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import axiosInstance from '@/lib/api'

export type PatternMatchMode = 'like' | 'exact'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

function applyFilters(items: Regex[], filters: RegexFilters): Regex[] {
	return items.filter((item) => {
		if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) return false
		if (filters.patternLike && !item.pattern.toLowerCase().includes(filters.patternLike.toLowerCase())) return false
		if (filters.patternExact && item.pattern !== filters.patternExact) return false
		if (filters.language !== 'ALL' && item.language !== filters.language) return false
		if (filters.dateFrom) {
			const d = new Date(item.createdAt)
			if (d < filters.dateFrom) return false
		}
		if (filters.dateTo) {
			const d = new Date(item.createdAt)
			const endOfDay = new Date(filters.dateTo)
			endOfDay.setHours(23, 59, 59, 999)
			if (d > endOfDay) return false
		}
		return true
	})
}

function applySort(items: Regex[], field: SortField, dir: SortDir): Regex[] {
	return [...items].sort((a, b) => {
		let va = a[field] as string
		let vb = b[field] as string
		if (field === 'createdAt') {
			va = new Date(a.createdAt).getTime().toString()
			vb = new Date(b.createdAt).getTime().toString()
		}
		const cmp = va.localeCompare(vb)
		return dir === 'asc' ? cmp : -cmp
	})
}

export function useRegexManager() {
	const [filters, setFilters] = useState<RegexFilters>({
		name: '',
		patternLike: '',
		patternExact: '',
		language: 'ALL',
		dateFrom: undefined,
		dateTo: undefined,
	})

	const [debouncedTextFilters, setDebouncedTextFilters] = useState({
		name: filters.name,
		patternLike: filters.patternLike,
		patternExact: filters.patternExact,
	})

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedTextFilters({
				name: filters.name,
				patternLike: filters.patternLike,
				patternExact: filters.patternExact,
			})
		}, 500)

		return () => clearTimeout(handler)
	}, [filters.name, filters.patternLike, filters.patternExact])

	const apiFilters = useMemo(
		() => ({
			name: debouncedTextFilters.name,
			patternLike: debouncedTextFilters.patternLike,
			patternExact: debouncedTextFilters.patternExact,
			language: filters.language,
			dateFrom: filters.dateFrom,
			dateTo: filters.dateTo,
		}),
		[debouncedTextFilters, filters.language, filters.dateFrom, filters.dateTo],
	)

	const [sortField, setSortField] = useState<SortField>('createdAt')
	const [sortDir, setSortDir] = useState<SortDir>('desc')

	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(10)

	const [editTarget, setEditTarget] = useState<Regex | null>(null)
	const [deleteTarget, setDeleteTarget] = useState<Regex | null>(null)
	const [editForm, setEditForm] = useState<EditForm>({
		name: '',
		pattern: '',
		language: 'JAVASCRIPT',
		elements: [],
	})

	async function fetchRegexes(params: typeof apiFilters) {
		const query = new URLSearchParams()

		if (params.name) query.append('name', params.name)
		if (params.patternLike) query.append('pattern', params.patternLike)
		if (params.patternExact) query.append('exactPattern', params.patternExact)
		if (params.language && params.language !== 'ALL') query.append('language', params.language)
		if (params.dateFrom) query.append('createdAtFrom', format(params.dateFrom, "yyyy-MM-dd'T'HH:mm:ss"))
		if (params.dateTo) query.append('createdAtTo', format(params.dateTo, "yyyy-MM-dd'T'HH:mm:ss"))

		const response = await axiosInstance.get(`/regexes?${query.toString()}`)

		return response.data.content as Regex[]
	}

	const { data: regexes = [], refetch: refetchRegexes } = useQuery<Regex[]>({
		queryKey: ['regexes', apiFilters],
		queryFn: () => fetchRegexes(apiFilters),
	})

	const executeDeleteMutation = useMutation({
		mutationFn: async (id: string) => {
			await axiosInstance.delete(`/regexes/${id}`)
		},
		onError: (error) => {
			toast.error(`Falha ao deletar regex: ${error instanceof AxiosError ? error.message : 'Erro desconhecido'}`)
		},
	})

	const executeDelete = useCallback(async () => {
		if (!deleteTarget) return
		await executeDeleteMutation.mutateAsync(deleteTarget.id)
	}, [deleteTarget, executeDeleteMutation])

	const executeUpdateMutation = useMutation({
		mutationFn: async (updated: EditForm & { id: string }) => {
			const response = await axiosInstance.put(`/regexes/${updated.id}`, updated)
			return response.data as Regex
		},
		onError: (error) => {
			toast.error(`Falha ao atualizar regex: ${error instanceof AxiosError ? error.message : 'Erro desconhecido'}`)
		},
	})

	const executeUpdate = useCallback(async () => {
		if (!editTarget) return

		await executeUpdateMutation.mutateAsync({
			id: editTarget.id,
			...editForm,
		})
	}, [editTarget, editForm, executeUpdateMutation])

	const saveEdit = useCallback(async () => {
		if (!editTarget) return
		await executeUpdate()
		await refetchRegexes()
		setEditTarget(null)
	}, [editTarget, executeUpdate, refetchRegexes])

	const filtered = useMemo(() => applyFilters(regexes, filters), [regexes, filters])

	const sorted = useMemo(() => applySort(filtered, sortField, sortDir), [filtered, sortField, sortDir])

	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
	const safePage = Math.min(page, totalPages)
	const paginatedItems = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)
	const totalItems = sorted.length

	const updateFilter = useCallback(<K extends keyof RegexFilters>(key: K, value: RegexFilters[K]) => {
		setFilters((prev) => ({ ...prev, [key]: value }))
		setPage(1)
	}, [])

	const resetFilters = useCallback(() => {
		setFilters({
			name: '',
			patternLike: '',
			patternExact: '',
			language: 'ALL',
			dateFrom: undefined,
			dateTo: undefined,
		})
		setDebouncedTextFilters({
			name: '',
			patternLike: '',
			patternExact: '',
		})
		setPage(1)
	}, [])

	const hasActiveFilters = useMemo(
		() =>
			filters.name !== '' ||
			filters.patternLike !== '' ||
			filters.patternExact !== '' ||
			filters.language !== 'ALL' ||
			filters.dateFrom !== undefined ||
			filters.dateTo !== undefined,
		[filters],
	)

	const toggleSort = useCallback(
		(field: SortField) => {
			if (sortField === field) {
				setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
			} else {
				setSortField(field)
				setSortDir('asc')
			}
		},
		[sortField],
	)

	const openEdit = useCallback((regex: Regex) => {
		setEditTarget(regex)
		setEditForm({
			name: regex.name,
			pattern: regex.pattern,
			language: regex.language,
			elements:
				typeof regex.elements === 'string'
					? (JSON.parse(regex.elements) as RegexElement[])
					: (regex.elements as RegexElement[]),
		})
	}, [])

	const closeEdit = useCallback(() => {
		setEditTarget(null)
	}, [])

	const openDelete = useCallback((regex: Regex) => {
		setDeleteTarget(regex)
	}, [])

	const closeDelete = useCallback(() => {
		setDeleteTarget(null)
	}, [])

	const confirmDelete = useCallback(async () => {
		if (!deleteTarget) return
		await executeDelete()
		await refetchRegexes()
		setDeleteTarget(null)
	}, [deleteTarget, executeDelete, refetchRegexes])

	const goToPage = useCallback((p: number) => setPage(p), [])
	const updatePageSize = useCallback((s: number) => {
		setPageSize(s)
		setPage(1)
	}, [])

	return {
		regexes: paginatedItems,
		filters,
		sortField,
		sortDir,
		page: safePage,
		pageSize,
		totalPages,
		totalItems,
		editTarget,
		deleteTarget,
		editForm,
		hasActiveFilters,
		pageSizeOptions: PAGE_SIZE_OPTIONS,
		updateFilter,
		resetFilters,
		toggleSort,
		openEdit,
		closeEdit,
		saveEdit,
		setEditForm,
		openDelete,
		closeDelete,
		confirmDelete,
		goToPage,
		updatePageSize,
		refetchRegexes,
	}
}
