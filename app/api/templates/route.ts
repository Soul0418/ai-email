import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const templates = await sql`
      SELECT 
        id,
        name,
        subject,
        body,
        category,
        variables,
        is_active,
        created_at,
        updated_at
      FROM email_templates 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    return NextResponse.json(templates)
  } catch (error: any) {
    console.error("Get templates error:", error)
    return NextResponse.json({ error: "Failed to get templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, subject, body, category, variables } = await request.json()

    const result = await sql`
      INSERT INTO email_templates (
        user_id, name, subject, body, category, variables
      ) VALUES (
        ${userId}, ${name}, ${subject}, ${body}, ${category}, ${JSON.stringify(variables)}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Create template error:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
