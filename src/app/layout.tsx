import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from "@/providers/convex-client-provider"
import { dark } from '@clerk/themes'

import { Theme } from "@/providers/theme"; // Kept as per instruction, though not used in the new RootLayout
import "@/styles/globals.css";

// Force dynamic rendering to prevent Clerk prerender errors during build
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Nomerlo',
  description: 'Real Estate Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#6366f1' }
      }}
    >
      <ConvexClientProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  )
}
