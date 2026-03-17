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
						<Toaster
							richColors
							position="bottom-right"
							theme="light"
							visibleToasts={3}
							toastOptions={{
								duration: 3000,
								style: {
									background: 'rgba(255, 255, 255, 0.1)',
									backdropFilter: 'blur(16px)',
									WebkitBackdropFilter: 'blur(16px)',
									border: '1px solid rgba(255, 255, 255, 0.2)',
									borderRadius: '16px',
									color: '#fff',
									boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
								},
							}}
						/>
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	)
}
