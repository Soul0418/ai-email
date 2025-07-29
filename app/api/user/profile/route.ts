import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Get user ID from Stack Auth or session
    const userId = request.headers.get("x-user-id") || "user_123" // Replace with actual auth

    const user = await sql`
      SELECT 
        id,
        email,
        name,
        avatar_url,
        plan,
        created_at,
        updated_at
      FROM users 
      WHERE id = ${userId}
    `

    if (!user[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user[0])
  } catch (error: any) {
    console.error("Get user profile error:", error)
    return NextResponse.json({ error: "Failed to get user profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "user_123"
    const { name, avatar_url } = await request.json()

    const result = await sql`
      UPDATE users 
      SET 
        name = ${name},
        avatar_url = ${avatar_url},
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Update user profile error:", error)
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
  }
}
