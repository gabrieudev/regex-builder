'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { PrivateRouteProvider } from '@/providers/private-route'

const queryClient = new QueryClient()

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<PrivateRouteProvider>
			<QueryClientProvider client={queryClient}>
				<Header />
				<main>{children}</main>
				<Footer />
			</QueryClientProvider>
		</PrivateRouteProvider>
	)
}
