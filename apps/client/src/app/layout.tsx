import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/providers/auth-context'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'

export const metadata: Metadata = {
	title: 'Regex Builder',
	description: 'Construa, teste e gerencie expressões regulares com facilidade.',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body className={inter.className}>
				<AuthProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						<TooltipProvider>
							<main>{children}</main>
						</TooltipProvider>
						<Toaster richColors position="top-right" />
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	)
}
