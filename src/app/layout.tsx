// // app/layout.tsx
// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import './globals.css'
// import { AuthProvider } from '@/context/AuthContext'
// import EmailPromptModal from '@/components/EmailPromptModal'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'HR Management System',
//   description: 'HR and Employee Management Dashboard with authentication',
//   icons: { icon: '/favicon.ico' },
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <AuthProvider>
//           {children}
//           <EmailPromptModal />
//         </AuthProvider>
//       </body>
//     </html>
//   )
// }


// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import EmailPromptModal from "@/components/EmailPromptModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HR Management System",
  description: "HR and Employee Management Dashboard with authentication",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HRMS",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ iOS PWA meta tags */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HRMS" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <EmailPromptModal />
        </AuthProvider>
      </body>
    </html>
  );
}