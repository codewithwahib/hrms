// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import EmailPromptModal from '@/components/EmailPromptModal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HR Management System',
  description: 'HR and Employee Management Dashboard with authentication',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <EmailPromptModal />
        </AuthProvider>
      </body>
    </html>
  )
}