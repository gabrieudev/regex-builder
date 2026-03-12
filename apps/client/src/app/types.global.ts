export {}

declare global {
	export type CollectionColor =
		| '#00d4ff'
		| '#a855f7'
		| '#10b981'
		| '#f59e0b'
		| '#f43f5e'
		| '#3b82f6'
		| '#f97316'
		| '#6366f1'

	export interface Collection {
		id: string
		name: string
		description: string
		color: CollectionColor
		icon: string
		regexes: Regex[]
		createdAt: string
		updatedAt: string
		pinned: boolean
		tags: string[]
	}

	export interface CollectionRegexes {
		id: string
		collection: Collection
		regex: Regex
		addedAt: string
	}

	export interface CollectionForm {
		name: string
		description: string
		color: CollectionColor
		icon: string
		tags: string
	}

	export type ViewMode = 'grid' | 'list'

	export type AuthProvider = 'local' | 'google' | 'github'

	export interface LoginRequest {
		email: string
		password: string
	}

	export interface SignupRequest {
		name: string
		email: string
		password: string
	}

	export interface AuthResponse {
		accessToken: string
		tokenType: string
	}

	export interface ApiError {
		message: string
		status?: number
	}

	export interface User {
		id?: string
		name: string
		email: string
		imageUrl?: string
		emailVerified: boolean
		password?: string
		provider: AuthProvider
		providerId?: string
		emailVerificationToken?: string
		emailVerificationTokenExpiry?: string
	}

	export interface RegexFilters {
		name: string
		patternLike: string
		patternExact: string
		language: Language | 'ALL'
		dateFrom: Date | undefined
		dateTo: Date | undefined
	}

	type EditForm = {
		name: string
		pattern: string
		language: Language
		elements: RegexElement[]
	}

	export type Language = 'JAVA' | 'PYTHON' | 'JAVASCRIPT'
	export type Mode = 'visual' | 'text'
	export type SortField = 'name' | 'pattern' | 'language' | 'createdAt'
	export type SortDir = 'asc' | 'desc'

	export type ElementCategory = 'literal' | 'charClass' | 'quantifier' | 'anchor' | 'group' | 'lookaround'

	export interface RegexElement {
		id: string
		type: string
		category: ElementCategory
		label: string
		value: string
		color: string
		description: string
		input?: string
		configurable?: boolean
		placeholder?: string
	}

	export interface ExecutionResult {
		success: boolean
		matches: string[]
		error: string
		executionTimeMs: number
		matchCount: number
		matchRanges: Array<Record<string, number>>
		groups: string[][]
		namedGroups: Record<string, string[]>
		isFullMatch: boolean
		warnings: string[]
		meta: Record<string, unknown>
	}

	export interface SaveRegex {
		name: string
		pattern: string
		language: Language
		elements: RegexElement[]
	}

	export interface Regex {
		id: string
		name: string
		pattern: string
		language: Language
		elements: RegexElement[]
		createdAt: string
		createdBy: User
	}
}
