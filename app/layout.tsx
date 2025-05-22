import type { Metadata } from 'next'
import { Martian_Mono } from 'next/font/google'
import './globals.css'

const martianMono = Martian_Mono({
  subsets: ['latin'],
  variable: '--font-martian',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Miketify',
  description: 'Created by daudcrtv',
  generator: 'mikedaudnr',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={martianMono.variable}>
      <body className="font-sans"
      data-new-gr-c-s-check-loaded="14.1235.0"
      data-gr-ext-installed="">
        {children}
      </body>
    </html>
  )
}
