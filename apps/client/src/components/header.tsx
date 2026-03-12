'use client'

import { motion, type Variants } from 'framer-motion'
import { Code, FileText, LayoutDashboard, LogOut, Moon, Sun, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/providers/auth-context'

const navLinks = [
	{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/regexes', label: 'Expressões Regulares', icon: Code },
	{ href: '/collections', label: 'Coleções', icon: FileText },
]

export function Header() {
	const { user, logout } = useAuth()
	const router = useRouter()
	const pathname = usePathname()
	const { theme, setTheme } = useTheme()

	// Animação para o header
	const headerVariants = {
		hidden: { y: -20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				stiffness: 300,
				damping: 30,
				when: 'beforeChildren',
				staggerChildren: 0.1,
			},
		},
	}

	// Animação para os itens do header
	const itemVariants = {
		hidden: { y: -10, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	}

	const handleLogout = () => {
		logout()
		router.push('/auth/login')
	}

	return (
		<motion.header
			variants={headerVariants as Variants}
			initial="hidden"
			animate="visible"
			className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
		>
			<div className="flex h-16 items-center justify-between px-4 md:px-6">
				{/* Logo e nome do app */}
				<motion.div variants={itemVariants} className="flex items-center gap-2">
					<Link href="/dashboard" className="flex items-center gap-2">
						<Image src="/logo.png" alt="Logo do Regex Builder" width={32} height={32} className="h-8 w-8 rounded-full" />
						<span className="text-lg font-bold text-primary hidden sm:inline">Regex Builder</span>
					</Link>
				</motion.div>

				{/* Navegação principal */}
				<motion.nav variants={itemVariants} className="hidden md:flex items-center gap-1">
					{navLinks.map((link) => {
						const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
						const Icon = link.icon

						return (
							<Link key={link.href} href={link.href}>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 m-2 ${
										isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
									}`}
								>
									<Icon className="h-4 w-4" />
									{link.label}
									{isActive && (
										<motion.div
											layoutId="active-nav"
											className="absolute inset-0 rounded-md border-2 border-primary/30"
											transition={{
												type: 'spring',
												stiffness: 300,
												damping: 30,
											}}
										/>
									)}
								</motion.div>
							</Link>
						)
					})}
				</motion.nav>

				{/* Ações da direita */}
				<motion.div variants={itemVariants} className="flex items-center gap-2">
					{/* Botão de tema */}
					<motion.div whileHover={{ rotate: 30, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							aria-label="Alternar tema"
							className="cursor-pointer"
						>
							<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
							<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						</Button>
					</motion.div>

					{/* Menu do usuário */}
					<DropdownMenu>
						<DropdownMenuTrigger className="cursor-pointer" asChild>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
							>
								<Avatar className="h-8 w-8 border-2 border-primary/20">
									<AvatarImage src={user?.imageUrl} alt={user?.name} className="object-cover" />
									<AvatarFallback className="bg-primary/10 text-primary">
										{user?.name
											.split(' ')
											.map((n) => n[0])
											.join('')
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</motion.button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="end" forceMount>
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">{user?.name}</p>
									<p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem asChild>
									<Link href="/profile" className="cursor-pointer">
										<User className="mr-2 h-4 w-4" />
										<span>Perfil</span>
									</Link>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />

							<AlertDialog>
								<AlertDialogTrigger onSelect={(e) => e.preventDefault()} asChild>
									<DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400">
										<LogOut className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
										<span>Sair</span>
									</DropdownMenuItem>
								</AlertDialogTrigger>
								<AlertDialogContent size="sm">
									<AlertDialogHeader>
										<AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
											<LogOut />
										</AlertDialogMedia>
										<AlertDialogTitle>Sair da conta?</AlertDialogTitle>
										<AlertDialogDescription>
											Isso irá desconectar sua conta. Você pode voltar a qualquer momento.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel className="cursor-pointer" variant="outline">
											Cancelar
										</AlertDialogCancel>
										<AlertDialogAction className="cursor-pointer" onClick={handleLogout} variant="destructive">
											Sair
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DropdownMenuContent>
					</DropdownMenu>
				</motion.div>
			</div>

			{/* Navegação mobile */}
			<motion.div
				variants={itemVariants}
				className="md:hidden border-t px-4 py-2 flex justify-around bg-background/80 backdrop-blur-md"
			>
				{navLinks.map((link) => {
					const isActive = pathname === link.href
					const Icon = link.icon
					return (
						<Link key={link.href} href={link.href}>
							<motion.div
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								className={`flex flex-col items-center p-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
							>
								<Icon className="h-5 w-5" />
								<span className="text-xs">{link.label}</span>
							</motion.div>
						</Link>
					)
				})}
			</motion.div>
		</motion.header>
	)
}
