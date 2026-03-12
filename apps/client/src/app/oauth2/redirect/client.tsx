'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/providers/auth-context'

export default function OAuthRedirectClient() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { login } = useAuth()

	useEffect(() => {
		const token = searchParams.get('token')
		const error = searchParams.get('error')

		if (token) {
			;(async () => {
				const u = await login(token)
				if (u) router.replace('/dashboard')
				else {
					router.replace('/auth/login')
				}
			})()
		} else if (error) {
			router.replace('/auth/login')
		} else {
			router.replace('/auth/login')
		}
	}, [searchParams, router, login])

	return (
		<div className="flex h-screen items-center justify-center">
			<Card className="w-full max-w-xs">
				<CardHeader>
					<Skeleton className="h-4 w-2/3" />
					<Skeleton className="h-4 w-1/2" />
				</CardHeader>
				<CardContent>
					<Skeleton className="aspect-video w-full" />
				</CardContent>
			</Card>
		</div>
	)
}
