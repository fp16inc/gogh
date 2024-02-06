import { Logo } from '@/components/logo'
import { MobileGuard } from '@/components/mobile-guard'
import { ProgressStatus } from '@/features/progress/components/progress-status'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter, Merriweather, Noto_Sans_JP } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-merriweather',
})

export const metadata: Metadata = {
  title: 'Gogh - StableDiffusion',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={'dark'} suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          notoSansJP.variable,
          merriweather.variable,
          'font-sans',
        )}
      >
        <MobileGuard>
          <header className={'fixed z-10 flex items-center gap-4 py-4 px-6'}>
            <Logo />
            <ProgressStatus />
          </header>

          <main>{children}</main>
        </MobileGuard>

        <Toaster />
      </body>
    </html>
  )
}
