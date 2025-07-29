"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: "free" | "pro" | "teams"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("coldreach_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      plan: "free",
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("coldreach_user", JSON.stringify(mockUser))
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: "1",
      email,
      name,
      plan: "free",
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("coldreach_user", JSON.stringify(mockUser))
  }

  const signInWithGoogle = async () => {
    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockUser: User = {
      id: "1",
      email: "user@gmail.com",
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      plan: "free",
      createdAt: new Date().toISOString(),
    }

    setUser(mockUser)
    localStorage.setItem("coldreach_user", JSON.stringify(mockUser))
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("coldreach_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }
  return userId
}

export async function getCurrentUser(): Promise<User | null> {
  const user = await currentUser()
  if (!user) return null

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || "",
    name: user.fullName || user.firstName || "User",
    avatar: user.imageUrl,
    plan: "free", // Default plan, you can enhance this with metadata
    createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
  }
}

export async function getUserId() {
  const { userId } = await auth()
  return userId
}
