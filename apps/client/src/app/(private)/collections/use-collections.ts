'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import {
	BarChart3,
	Calendar,
	Dna,
	Flag,
	Globe,
	Key,
	Lightbulb,
	Lock,
	Mail,
	Package,
	Palette,
	Puzzle,
	Rocket,
	Search,
	Shield,
	Zap,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import axiosInstance from '@/lib/api'

export const COLOR_OPTIONS: CollectionColor[] = [
	'#00d4ff',
	'#a855f7',
	'#10b981',
	'#f59e0b',
	'#f43f5e',
	'#3b82f6',
	'#f97316',
	'#6366f1',
]

export const iconMap = {
	mail: Mail,
	lock: Lock,
	globe: Globe,
	calendar: Calendar,
	palette: Palette,
	flag: Flag,
	search: Search,
	zap: Zap,
	package: Package,
	puzzle: Puzzle,
	shield: Shield,
	key: Key,
	chart: BarChart3,
	lightbulb: Lightbulb,
	rocket: Rocket,
	dna: Dna,
}

export function useCollections() {
	const [search, setSearch] = useState('')
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [createOpen, setCreateOpen] = useState(false)
	const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null)
	const [editTarget, setEditTarget] = useState<Collection | null>(null)

	const [form, setForm] = useState<CollectionForm>({
		name: '',
		description: '',
		color: '#00d4ff',
		icon: 'package',
		tags: '',
	})

	const { data: fetchedCollections = [], refetch: refetchCollections } = useQuery<Collection[]>({
		queryKey: ['collections', search],
		queryFn: () => fetchCollections(search),
	})

	async function fetchCollections(name: string) {
		const params = new URLSearchParams()
		if (name.trim()) params.append('search', name.trim())
		const response = await axiosInstance.get(`/collections?${params.toString()}`)
		return response.data.content as Collection[]
	}

	async function fetchRegexes() {
		const response = await axiosInstance.get('/regexes')
		return response.data.content as Regex[]
	}

	const { data: fetchedRegexes = [] } = useQuery<Regex[]>({
		queryKey: ['regexes'],
		queryFn: fetchRegexes,
	})

	const executeCreateMutation = useMutation({
		mutationFn: async (data: CollectionForm) => {
			const response = await axiosInstance.post('/collections', {
				...data,
				tags: data.tags
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean),
			})
			return response.data
		},
		onSuccess: () => {
			toast.success('Coleção criada com sucesso')
			refetchCollections()
		},
		onError: (error) => {
			toast.error(`Falha ao criar coleção: ${error instanceof AxiosError ? error.message : 'Erro desconhecido'}`)
		},
	})

	const executeUpdateMutation = useMutation({
		mutationFn: async (data: CollectionForm & { id: string; pinned: boolean }) => {
			const response = await axiosInstance.put(`/collections/${data.id}`, {
				...data,
				tags: data.tags
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean),
			})
			return response.data
		},
		onSuccess: () => {
			toast.success('Coleção atualizada com sucesso')
			refetchCollections()
		},
		onError: (error) => {
			toast.error(`Falha ao atualizar coleção: ${error instanceof AxiosError ? error.message : 'Erro desconhecido'}`)
		},
	})

	const executeDeleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await axiosInstance.delete(`/collections/${id}`)
			return response.data
		},
		onSuccess: () => {
			toast.success('Coleção excluída com sucesso')
			refetchCollections()
		},
		onError: (error) => {
			toast.error(`Falha ao deletar coleção: ${error instanceof AxiosError ? error.message : 'Erro desconhecido'}`)
		},
	})

	const executeAddRegexMutation = useMutation({
		mutationFn: async (data: { collectionId: string; regexIds: string[] }) => {
			const response = await axiosInstance.post(`/collections/${data.collectionId}/regexes`, {
				regexIds: data.regexIds,
			})
			return response.data
		},
		onSuccess: () => {
			toast.success('Regex(es) adicionada(s) com sucesso')
			refetchCollections()
		},
		onError: (error) => {
			toast.error(
				`Falha ao adicionar regex à coleção: ${error instanceof AxiosError ? error.message : 'Erro desconhecido'}`,
			)
		},
	})

	const executeRemoveRegexMutation = useMutation({
		mutationFn: async (data: { collectionId: string; regexId: string }) => {
			const response = await axiosInstance.delete(`/collections/${data.collectionId}/regexes/${data.regexId}`)
			return response.data
		},
		onSuccess: () => {
			toast.success('Regex removida da coleção')
			refetchCollections()
		},
		onError: (error) => {
			toast.error(
				`Falha ao remover regex da coleção: ${error instanceof AxiosError ? error.message : 'Erro desconhecido'}`,
			)
		},
	})

	const addRegexesToCollection = useCallback(
		(colId: string, regexIds: string[]) => {
			if (regexIds.length === 0) return
			executeAddRegexMutation.mutate({ collectionId: colId, regexIds })
		},
		[executeAddRegexMutation],
	)

	const sorted = useMemo(() => {
		const pinned = fetchedCollections.filter((c) => c.pinned)
		const rest = fetchedCollections.filter((c) => !c.pinned)
		return [...pinned, ...rest]
	}, [fetchedCollections])

	const selectedCollection = useMemo(
		() => fetchedCollections.find((c) => c.id === selectedId) ?? null,
		[fetchedCollections, selectedId],
	)

	const selectedRegexes = useMemo(() => {
		if (!selectedCollection) return []
		return selectedCollection.regexes
	}, [selectedCollection])

	const openCreate = useCallback(() => {
		setForm({
			name: '',
			description: '',
			color: '#00d4ff',
			icon: 'package',
			tags: '',
		})
		setCreateOpen(true)
	}, [])

	const openEdit = useCallback((col: Collection) => {
		setEditTarget(col)
		setForm({
			name: col.name,
			description: col.description,
			color: col.color,
			icon: col.icon,
			tags: col.tags.join(', '),
		})
		setCreateOpen(true)
	}, [])

	const closeCreate = useCallback(() => {
		setCreateOpen(false)
		setEditTarget(null)
	}, [])

	const saveCollection = useCallback(async () => {
		if (editTarget) {
			executeUpdateMutation.mutate({
				id: editTarget.id,
				name: form.name,
				description: form.description,
				color: form.color,
				icon: form.icon,
				tags: form.tags,
				pinned: editTarget.pinned,
			})
		} else {
			const newCol: CollectionForm = {
				name: form.name,
				description: form.description,
				color: form.color,
				icon: form.icon,
				tags: form.tags,
			}
			executeCreateMutation.mutate(newCol)
		}
		setCreateOpen(false)
		setEditTarget(null)
	}, [form, editTarget, executeUpdateMutation, executeCreateMutation])

	const togglePin = useCallback(
		(id: string) => {
			const col = fetchedCollections.find((c) => c.id === id)
			if (!col) return
			executeUpdateMutation.mutate({
				id,
				name: col.name,
				description: col.description,
				color: col.color,
				icon: col.icon,
				tags: col.tags.join(', '),
				pinned: !col.pinned,
			})
		},
		[fetchedCollections, executeUpdateMutation],
	)

	const openDelete = useCallback((col: Collection) => setDeleteTarget(col), [])
	const closeDelete = useCallback(() => setDeleteTarget(null), [])

	const confirmDelete = useCallback(async () => {
		if (!deleteTarget) return
		executeDeleteMutation.mutate(deleteTarget.id)
		if (selectedId === deleteTarget.id) setSelectedId(null)
		setDeleteTarget(null)
	}, [deleteTarget, selectedId, executeDeleteMutation])

	const removeRegexFromCollection = useCallback(
		(colId: string, regexId: string) => {
			executeRemoveRegexMutation.mutate({ collectionId: colId, regexId })
		},
		[executeRemoveRegexMutation],
	)

	return {
		collections: sorted,
		search,
		setSearch,
		viewMode,
		setViewMode,
		selectedId,
		setSelectedId,
		selectedCollection,
		selectedRegexes,
		createOpen,
		deleteTarget,
		editTarget,
		form,
		setForm,
		openCreate,
		openEdit,
		closeCreate,
		saveCollection,
		togglePin,
		openDelete,
		closeDelete,
		confirmDelete,
		removeRegexFromCollection,
		addRegexesToCollection,
		fetchedRegexes,
		isCreating: executeCreateMutation.isPending,
		isUpdating: executeUpdateMutation.isPending,
		isDeleting: executeDeleteMutation.isPending,
		isAddingRegex: executeAddRegexMutation.isPending,
		isRemovingRegex: executeRemoveRegexMutation.isPending,
	}
}
