'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import '@scalar/api-reference-react/style.css'
import { ApiReferenceReact } from '@scalar/api-reference-react'

export default function ApiDocs() {
	const { resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	const isDark = resolvedTheme === 'dark'

	return (
		<div className="not-prose bg-background">
			<ApiReferenceReact
				key={resolvedTheme}
				configuration={{
					url: '/api/openapi',

					theme: isDark ? 'moon' : 'default',
					darkMode: isDark,

					hideDarkModeToggle: true,
					withDefaultFonts: false,
				}}
			/>
		</div>
	)
}
