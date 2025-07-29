"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Chrome, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"

interface SignInDialogProps {
  children: React.ReactNode
  mode?: "signin" | "signup"
}

export function SignInDialog({ children, mode = "signin" }: SignInDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(mode === "signup")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp, signInWithGoogle, user } = useAuth()

  // If user is already signed in, don't show the dialog
  if (user) {
    return null
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, name)
        toast.success("Account created successfully!")
      } else {
        await signIn(email, password)
        toast.success("Signed in successfully!")
      }
      setOpen(false)
      // Reset form
      setEmail("")
      setPassword("")
      setName("")
    } catch (error: any) {
      toast.error(error.message || "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      toast.success("Signed in with Google!")
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create your account" : "Welcome back"}</DialogTitle>
          <DialogDescription>
            {isSignUp ? "Sign up to start generating personalized cold emails" : "Sign in to your ColdReach account"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Google OAuth */}
          <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleAuth} disabled={isLoading}>
            <Chrome className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => setIsSignUp(false)}>
                  Sign in
                </Button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => setIsSignUp(true)}>
                  Sign up
                </Button>
              </>
            )}
          </div>

          {!isSignUp && (
            <div className="text-center">
              <Button variant="link" className="p-0 h-auto text-sm">
                Forgot your password?
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
