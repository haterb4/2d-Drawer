import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import Providers from './providers'
import NextTopLoader from "nextjs-toploader"
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '2D Form drawer',
  description: 'Designed by ANZIE SEVERIN BRADLEY',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <ClerkProvider>
        <html lang="en">
            <body className={inter.className}>
              <NextTopLoader />
              <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
              >
                  {children}
                  <Toaster />
              </ThemeProvider>
            </body>
        </html>
      </ClerkProvider>
    </Providers>
  )
}
