'use client'

import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import axiosInstance from '@/lib/api'

const ELEMENT_PALETTE: RegexElement[] = [
	// Literais
	{
		id: 'pal-literal',
		type: 'literal',
		category: 'literal',
		label: 'abc',
		value: '',
		color: '#f59e0b',
		description: 'Corresponder ao texto exato',
		configurable: true,
		placeholder: 'texto...',
		input: '',
	},
	{
		id: 'pal-anychar',
		type: 'anyChar',
		category: 'charClass',
		label: '.',
		value: '.',
		color: '#22d3ee',
		description: 'Qualquer caractere (exceto nova linha)',
	},
	// Classes de caracteres
	{
		id: 'pal-digit',
		type: 'digit',
		category: 'charClass',
		label: '\\d',
		value: '\\d',
		color: '#22d3ee',
		description: 'Qualquer dígito (0-9)',
	},
	{
		id: 'pal-nondigit',
		type: 'nonDigit',
		category: 'charClass',
		label: '\\D',
		value: '\\D',
		color: '#22d3ee',
		description: 'Qualquer caractere não dígito',
	},
	{
		id: 'pal-word',
		type: 'word',
		category: 'charClass',
		label: '\\w',
		value: '\\w',
		color: '#22d3ee',
		description: 'Qualquer caractere de palavra (a-z, A-Z, 0-9, _)',
	},
	{
		id: 'pal-nonword',
		type: 'nonWord',
		category: 'charClass',
		label: '\\W',
		value: '\\W',
		color: '#22d3ee',
		description: 'Qualquer caractere não palavra',
	},
	{
		id: 'pal-space',
		type: 'whitespace',
		category: 'charClass',
		label: '\\s',
		value: '\\s',
		color: '#22d3ee',
		description: 'Qualquer caractere de espaço em branco',
	},
	{
		id: 'pal-nonspace',
		type: 'nonWhitespace',
		category: 'charClass',
		label: '\\S',
		value: '\\S',
		color: '#22d3ee',
		description: 'Qualquer caractere não espaço em branco',
	},
	{
		id: 'pal-charclass',
		type: 'charClass',
		category: 'charClass',
		label: '[abc]',
		value: '',
		color: '#06b6d4',
		description: 'Classe de caracteres — corresponde a qualquer caractere listado',
		configurable: true,
		placeholder: 'a-z0-9',
		input: '',
	},
	{
		id: 'pal-negclass',
		type: 'negClass',
		category: 'charClass',
		label: '[^abc]',
		value: '',
		color: '#0891b2',
		description: 'Classe negada — corresponde a qualquer caractere NÃO listado',
		configurable: true,
		placeholder: 'a-z0-9',
		input: '',
	},
	// Quantificadores
	{
		id: 'pal-star',
		type: 'zeroOrMore',
		category: 'quantifier',
		label: '*',
		value: '*',
		color: '#a855f7',
		description: 'Zero ou mais do elemento anterior',
	},
	{
		id: 'pal-plus',
		type: 'oneOrMore',
		category: 'quantifier',
		label: '+',
		value: '+',
		color: '#a855f7',
		description: 'Um ou mais do elemento anterior',
	},
	{
		id: 'pal-optional',
		type: 'zeroOrOne',
		category: 'quantifier',
		label: '?',
		value: '?',
		color: '#a855f7',
		description: 'Zero ou um do elemento anterior',
	},
	{
		id: 'pal-exactn',
		type: 'exactN',
		category: 'quantifier',
		label: '{n}',
		value: '',
		color: '#9333ea',
		description: 'Exatamente N ocorrências',
		configurable: true,
		placeholder: '3',
		input: '3',
	},
	{
		id: 'pal-between',
		type: 'between',
		category: 'quantifier',
		label: '{n,m}',
		value: '',
		color: '#9333ea',
		description: 'Entre N e M ocorrências',
		configurable: true,
		placeholder: '2,5',
		input: '2,5',
	},
	// Âncoras
	{
		id: 'pal-start',
		type: 'startAnchor',
		category: 'anchor',
		label: '^',
		value: '^',
		color: '#f43f5e',
		description: 'Início da string/linha',
	},
	{
		id: 'pal-end',
		type: 'endAnchor',
		category: 'anchor',
		label: '$',
		value: '$',
		color: '#f43f5e',
		description: 'Fim da string/linha',
	},
	{
		id: 'pal-boundary',
		type: 'wordBoundary',
		category: 'anchor',
		label: '\\b',
		value: '\\b',
		color: '#e11d48',
		description: 'Limite de palavra',
	},
	// Grupos
	{
		id: 'pal-group',
		type: 'group',
		category: 'group',
		label: '(…)',
		value: '',
		color: '#10b981',
		description: 'Grupo de captura',
		configurable: true,
		placeholder: 'padrão',
		input: '',
	},
	{
		id: 'pal-ncgroup',
		type: 'nonCapGroup',
		category: 'group',
		label: '(?:…)',
		value: '',
		color: '#059669',
		description: 'Grupo não capturante',
		configurable: true,
		placeholder: 'padrão',
		input: '',
	},
	{
		id: 'pal-namedgroup',
		type: 'namedGroup',
		category: 'group',
		label: '(?<name>…)',
		value: '',
		color: '#047857',
		description: 'Grupo de captura nomeado',
		configurable: true,
		placeholder: 'nome:padrão',
		input: '',
	},
	{
		id: 'pal-alt',
		type: 'alternation',
		category: 'group',
		label: 'a|b',
		value: '|',
		color: '#34d399',
		description: 'Alternância — corresponde a um lado ou outro',
	},
	// Lookaround
	{
		id: 'pal-lookahead',
		type: 'lookahead',
		category: 'lookaround',
		label: '(?=…)',
		value: '',
		color: '#f97316',
		description: 'Lookahead positivo',
		configurable: true,
		placeholder: 'padrão',
		input: '',
	},
	{
		id: 'pal-neglookahead',
		type: 'negLookahead',
		category: 'lookaround',
		label: '(?!…)',
		value: '',
		color: '#ea580c',
		description: 'Lookahead negativo',
		configurable: true,
		placeholder: 'padrão',
		input: '',
	},
	{
		id: 'pal-lookbehind',
		type: 'lookbehind',
		category: 'lookaround',
		label: '(?<=…)',
		value: '',
		color: '#fb923c',
		description: 'Lookbehind positivo',
		configurable: true,
		placeholder: 'padrão',
		input: '',
	},
	{
		id: 'pal-neglookbehind',
		type: 'negLookbehind',
		category: 'lookaround',
		label: '(?<!…)',
		value: '',
		color: '#fb923c',
		description: 'Lookbehind negativo',
		configurable: true,
		placeholder: 'padrão',
		input: '',
	},
]

function buildPattern(elements: RegexElement[], language: Language): string {
	return elements
		.map((el) => {
			switch (el.type) {
				case 'literal':
					return (el.input ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
				case 'charClass':
					return `[${el.input ?? ''}]`
				case 'negClass':
					return `[^${el.input ?? ''}]`
				case 'exactN':
					return `{${el.input ?? '1'}}`
				case 'between':
					return `{${el.input ?? '1,3'}}`
				case 'group':
					return `(${el.input ?? ''})`
				case 'nonCapGroup':
					return `(?:${el.input ?? ''})`
				case 'namedGroup': {
					const [name, ...patternParts] = (el.input ?? 'nome:').split(':')
					const pat = patternParts.join(':')
					if (language === 'PYTHON') return `(?P<${name}>${pat})`
					return `(?<${name}>${pat})`
				}
				case 'lookahead':
					return `(?=${el.input ?? ''})`
				case 'negLookahead':
					return `(?!${el.input ?? ''})`
				case 'lookbehind':
					return `(?<=${el.input ?? ''})`
				case 'negLookbehind':
					return `(?<!${el.input ?? ''})`
				case 'custom':
					return el.input ?? el.value
				default:
					return el.value
			}
		})
		.join('')
}

function buildCodeSnippet(pattern: string, language: Language): string {
	switch (language) {
		case 'JAVA':
			return `Pattern p = Pattern.compile("${pattern}", Pattern.MULTILINE);\nMatcher m = p.matcher(testString);\nwhile (m.find()) {\n    System.out.println(m.group());\n}`
		case 'PYTHON':
			return `import re\npattern = re.compile(r"${pattern}", re.MULTILINE)\nmatches = pattern.findall(test_string)\nfor match in matches:\n    print(match)`
		case 'JAVASCRIPT':
			return `const pattern = /${pattern}/gm;\nconst matches = testString.match(pattern);\nconsole.log(matches);`
	}
}

export function useDashboard(regexId?: string | null) {
	const [language, setLanguage] = useState<Language>('JAVASCRIPT')
	const [canvasElements, setCanvasElements] = useState<RegexElement[]>([])
	const [testString, setTestString] = useState<string>('Olá Mundo! Teste 123 abc@exemplo.com')
	const [showSaveDialog, setShowSaveDialog] = useState(false)
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
	const [mode, setMode] = useState<Mode>('visual')
	const [manualPattern, setManualPattern] = useState<string>('')
	const [isPaletteOpen, setIsPaletteOpen] = useState(false)
	const [isReferenceOpen, setIsReferenceOpen] = useState(false)

	const [loadedRegex, setLoadedRegex] = useState<Regex | null>(null)
	const [isLoadingRegex, setIsLoadingRegex] = useState(false)

	// Buscar regex por ID quando existir
	useEffect(() => {
		if (!regexId) {
			setLoadedRegex(null)
			return
		}

		const fetchRegex = async () => {
			setIsLoadingRegex(true)

			try {
				const response = await axiosInstance.get(`/regexes/${regexId}`)

				const data = response.data

				setLoadedRegex({
					...data,
					elements: JSON.parse(data.elements),
				})
			} catch (_error) {
				toast.error('Erro ao carregar regex')
			} finally {
				setIsLoadingRegex(false)
			}
		}

		fetchRegex()
	}, [regexId])

	useEffect(() => {
		if (loadedRegex) {
			setLanguage(loadedRegex.language)
			setCanvasElements(loadedRegex.elements)
			setMode('visual')
			setManualPattern('')
		}
	}, [loadedRegex])

	const pattern = useMemo(() => {
		if (mode === 'text') return manualPattern
		return buildPattern(canvasElements, language)
	}, [canvasElements, language, mode, manualPattern])

	const codeSnippet = useMemo(() => buildCodeSnippet(pattern, language), [pattern, language])

	const addElement = useCallback((paletteEl: RegexElement, insertAt?: number) => {
		const newEl: RegexElement = {
			...paletteEl,
			id: `el-${Date.now()}-${Math.random().toString(36).slice(2)}`,
		}
		setCanvasElements((prev) => {
			if (insertAt !== undefined && insertAt >= 0) {
				const next = [...prev]
				next.splice(insertAt, 0, newEl)
				return next
			}
			return [...prev, newEl]
		})
	}, [])

	const removeElement = useCallback((id: string) => {
		setCanvasElements((prev) => prev.filter((el) => el.id !== id))
	}, [])

	const updateElementInput = useCallback((id: string, input: string) => {
		setCanvasElements((prev) => prev.map((el) => (el.id === id ? { ...el, input } : el)))
	}, [])

	const reorderElements = useCallback((fromIndex: number, toIndex: number) => {
		setCanvasElements((prev) => {
			const next = [...prev]
			const [removed] = next.splice(fromIndex, 1)
			next.splice(toIndex, 0, removed)
			return next
		})
	}, [])

	const executeRegexMutation = useMutation({
		mutationFn: async ({
			pattern,
			testString,
			language,
		}: {
			pattern: string
			testString: string
			language: string
		}): Promise<ExecutionResult> => {
			const response = await axiosInstance.post('/regexes/execute', {
				pattern,
				testString,
				language,
			})

			return response.data
		},
	})

	const executeRegex = () => {
		if (!pattern || !testString) return

		executeRegexMutation.mutate({
			pattern,
			testString,
			language,
		})
	}

	const clearCanvas = useCallback(() => {
		setCanvasElements([])
		executeRegexMutation.reset()
	}, [executeRegexMutation])

	const createRegexMutation = useMutation({
		mutationFn: async (regex: SaveRegex) => {
			const response = await axiosInstance.post('/regexes', regex)
			return response.data
		},
		onSuccess: () => {
			toast.success('Regex salva com sucesso!')
		},
		onError: (error) => {
			toast.error(`Erro ao salvar regex: ${error instanceof AxiosError ? error.message : 'Erro desconhecido'}`)
		},
	})

	const updateRegexMutation = useMutation({
		mutationFn: async ({ id, ...regex }: { id: string } & SaveRegex) => {
			const response = await axiosInstance.put(`/regexes/${id}`, regex)
			return response.data
		},
		onSuccess: () => {
			toast.success('Regex atualizada com sucesso!')
		},
		onError: (error) => {
			toast.error(`Erro ao atualizar regex: ${error instanceof AxiosError ? error.message : 'Erro desconhecido'}`)
		},
	})

	const saveRegex = (name: string) => {
		let elementsToSave = canvasElements
		if (mode === 'text' && manualPattern) {
			const customEl: RegexElement = {
				id: `custom-${Date.now()}`,
				type: 'custom',
				category: 'literal',
				label: 'Manual',
				value: manualPattern,
				color: '#f59e0b',
				description: 'Regex digitada manualmente',
				configurable: true,
				placeholder: 'regex...',
				input: manualPattern,
			}
			elementsToSave = [customEl]
		} else if (mode === 'text' && !manualPattern) {
			elementsToSave = []
		}
		const saved: SaveRegex = {
			name,
			pattern: mode === 'text' ? manualPattern : pattern,
			language,
			elements: elementsToSave,
		}
		if (loadedRegex) {
			updateRegexMutation.mutate({ id: loadedRegex.id, ...saved })
		} else {
			createRegexMutation.mutate(saved)
		}
		setShowSaveDialog(false)
		if (mode === 'text' && manualPattern) {
			setCanvasElements(elementsToSave)
			setMode('visual')
			setManualPattern('')
		}
	}

	const loadRegex = useCallback(
		(regex: Regex) => {
			setLanguage(regex.language)
			setCanvasElements(regex.elements)
			executeRegexMutation.reset()
			setMode('visual')
			setManualPattern('')
		},
		[executeRegexMutation],
	)

	const switchMode = useCallback(
		(newMode: Mode) => {
			if (newMode === mode) return
			if (newMode === 'text') {
				setManualPattern(pattern)
			} else {
				if (manualPattern && manualPattern !== pattern) {
					const customEl: RegexElement = {
						id: `custom-${Date.now()}`,
						type: 'custom',
						category: 'literal',
						label: 'Manual',
						value: manualPattern,
						color: '#f59e0b',
						description: 'Regex digitada manualmente',
						configurable: true,
						placeholder: 'regex...',
						input: manualPattern,
					}
					setCanvasElements([customEl])
				} else if (!manualPattern) {
					setCanvasElements([])
				}
				setManualPattern('')
			}
			setMode(newMode)
		},
		[mode, pattern, manualPattern],
	)

	const palette = ELEMENT_PALETTE

	const paletteByCategory = useMemo(() => {
		const groups: Record<string, RegexElement[]> = {}
		for (const el of palette) {
			if (!groups[el.category]) groups[el.category] = []
			groups[el.category].push(el)
		}
		return groups
	}, [palette])

	return {
		// Estado
		language,
		setLanguage,
		canvasElements,
		testString,
		setTestString,
		showSaveDialog,
		setShowSaveDialog,
		dragOverIndex,
		setDragOverIndex,
		mode,
		setMode: switchMode,
		manualPattern,
		setManualPattern,
		isPaletteOpen,
		setIsPaletteOpen,
		isReferenceOpen,
		setIsReferenceOpen,
		isLoadingRegex,
		loadedRegex,
		// Derivados
		pattern,
		codeSnippet,
		palette,
		paletteByCategory,
		// Ações
		addElement,
		removeElement,
		updateElementInput,
		reorderElements,
		clearCanvas,
		executeRegex,
		saveRegex,
		loadRegex,
		executeRegexMutation,
		createRegexMutation,
		updateRegexMutation,
	}
}
