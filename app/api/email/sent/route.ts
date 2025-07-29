import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const emails = await sql`
      SELECT 
        e.id,
        e.recipient_email,
        e.recipient_name,
        e.recipient_company,
        e.subject,
        e.status,
        e.created_at,
        e.opened_at,
        e.clicked_at,
        e.replied_at,
        et.name as template_name,
        c.name as campaign_name
      FROM emails e
      LEFT JOIN email_templates et ON e.template_id = et.id
      LEFT JOIN campaigns c ON e.campaign_id = c.id
      WHERE e.user_id = ${userId}
      ORDER BY e.created_at DESC
      LIMIT 50
    `

    return NextResponse.json(emails)
  } catch (error: any) {
    console.error("Get sent emails error:", error)
    return NextResponse.json({ error: "Failed to get sent emails" }, { status: 500 })
  }
}
