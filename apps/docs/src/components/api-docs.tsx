'use client'

import '@scalar/api-reference-react/style.css'
import { ApiReferenceReact } from '@scalar/api-reference-react'

export default function ApiDocs() {
	return (
		<ApiReferenceReact
			configuration={{
				url: '/api/openapi',
			}}
		/>
	)
}
