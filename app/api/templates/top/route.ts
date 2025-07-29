import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const topTemplates = await sql`
      SELECT 
        et.name,
        COUNT(e.id) as total_emails,
        COUNT(CASE WHEN e.status = 'opened' THEN 1 END) as opened_emails,
        CASE 
          WHEN COUNT(e.id) > 0 
          THEN ROUND((COUNT(CASE WHEN e.status = 'opened' THEN 1 END)::float / COUNT(e.id)) * 100, 1)
          ELSE 0 
        END as open_rate
      FROM email_templates et
      LEFT JOIN emails e ON et.id = e.template_id
      WHERE et.user_id = ${userId}
      GROUP BY et.id, et.name
      HAVING COUNT(e.id) > 0
      ORDER BY open_rate DESC
      LIMIT 5
    `

    return NextResponse.json(topTemplates)
  } catch (error: any) {
    console.error("Get top templates error:", error)
    return NextResponse.json({ error: "Failed to get top templates" }, { status: 500 })
  }
}
