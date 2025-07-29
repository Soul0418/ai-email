import { StackServerApp } from "@stack-auth/next-server"
import { StackClientApp } from "@stack-auth/next-client"

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
})

export const stackClientApp = new StackClientApp({
  baseUrl: process.env.NEXT_PUBLIC_STACK_URL || "http://localhost:8101",
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
})
