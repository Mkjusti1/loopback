import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Loopback — Team feedback that works',
  description: 'Run meaningful performance reviews for your team',
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
