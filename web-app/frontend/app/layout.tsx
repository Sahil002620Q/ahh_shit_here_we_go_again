import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Electronic Parts Marketplace',
  description: 'Buy and sell old, broken, and spare electronic devices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
