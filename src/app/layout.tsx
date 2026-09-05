import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import { loadContent } from '@/lib/content'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap',
})

export function generateMetadata(): Metadata {
  const { metadata } = loadContent()
  return {
    title: metadata.title,
    description: metadata.subtitle,
    applicationName: metadata.title,
    other: {
      'project-year': metadata.year,
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
