import { Suspense } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import OAuthRedirectClient from './client'

export default function OAuth2RedirectPage() {
	return (
		<Suspense
			fallback={
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
			}
		>
			<OAuthRedirectClient />
		</Suspense>
	)
}
