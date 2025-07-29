"use client"

import type React from "react"

import { StackProvider } from "@stack-auth/next-client"
import { stackClientApp } from "@/lib/stack"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <StackProvider app={stackClientApp}>{children}</StackProvider>
}
