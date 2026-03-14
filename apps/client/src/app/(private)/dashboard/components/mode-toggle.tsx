'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
	mode: 'visual' | 'text'
	onChange: (mode: 'visual' | 'text') => void
}

export function ModeToggle({ mode, onChange }: Props) {
	return (
		<Tabs value={mode} onValueChange={(v) => onChange(v as 'visual' | 'text')} className="w-fit">
			<TabsList className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
				<TabsTrigger
					value="visual"
					className="text-xs font-mono font-bold data-[state=active]:text-cyan-600 cursor-pointer"
				>
					Visual
				</TabsTrigger>
				<TabsTrigger value="text" className="text-xs font-mono font-bold data-[state=active]:text-cyan-600 cursor-pointer">
					Texto
				</TabsTrigger>
			</TabsList>
		</Tabs>
	)
}
