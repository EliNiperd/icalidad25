import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './providers/theme-provider'
const ThemeProviderAny = ThemeProvider as any

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'iCalidad - Niperd',
  description: 'Sistema de gestión de calidad',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
          <ThemeProviderAny
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProviderAny>
      </body>
    </html>
  )
}
