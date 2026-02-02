import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from "@/providers/convex-client-provider"
import { dark } from '@clerk/themes'

import { Theme } from "@/providers/theme"; // Kept as per instruction, though not used in the new RootLayout
import "@/styles/globals.css";
// import { cx } from "@/utils/cx"; // Removed as it's no longer used
// import { Inter } from "next/font/google"; // Removed as it's no longer used
// import { RouteProvider } from "@/providers/router-provider"; // Removed as it's no longer used


export const metadata = {
  title: 'Nomerlo',
  description: 'Real Estate Platform',
}

// export const viewport: Viewport = { // Removed as per new metadata
//     themeColor: "#7f56d9",
//     colorScheme: "light dark",
// };

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
