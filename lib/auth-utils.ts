import { headers } from "next/headers"

export async function getCurrentUser() {
  // This would integrate with Stack Auth
  // For now, returning mock data
  return {
    id: "user_123",
    email: "user@example.com",
    name: "John Doe",
    plan: "free",
  }
}

export async function getUserIdFromRequest() {
  const headersList = headers()
  return headersList.get("x-user-id") || "user_123"
}

export function requireAuth(handler: Function) {
  return async (request: Request) => {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }
    return handler(request)
  }
}
