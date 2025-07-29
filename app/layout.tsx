import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ColdReach - AI-Powered Personalized Email Generator",
  description: "Write better cold emails instantly. Personalized outreach based on LinkedIn profiles, powered by AI.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the clean publishable key
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()

  // Validate the key format
  const isValidKey = clerkPublishableKey && clerkPublishableKey.startsWith("pk_")

  if (!isValidKey) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuration Required</h1>
                <p className="text-gray-600 mb-4">Please fix your environment variables.</p>
                <div className="bg-gray-100 p-4 rounded-md text-left mb-4">
                  <p className="text-sm font-mono text-gray-800">
                    Your .env.local should have each variable on a separate line:
                  </p>
                  <br />
                  <p className="text-sm font-mono text-gray-800">
                    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
                    <br />
                    CLERK_SECRET_KEY=sk_test_...
                    <br />
                    DATABASE_URL=postgresql://...
                    <br />
                    OPENAI_API_KEY=sk-proj-...
                  </p>
                </div>
                {clerkPublishableKey && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                    <p className="text-sm text-red-600">Current key: {clerkPublishableKey.substring(0, 30)}...</p>
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Get your key at{" "}
                  <a
                    href="https://dashboard.clerk.com/last-active?path=api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    dashboard.clerk.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
