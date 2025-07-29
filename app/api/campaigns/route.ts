import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "user_123"

    const campaigns = await sql`
      SELECT 
        c.*,
        COUNT(e.id) as total_emails,
        COUNT(CASE WHEN e.status = 'delivered' THEN 1 END) as delivered_count,
        COUNT(CASE WHEN e.status = 'opened' THEN 1 END) as opened_count,
        COUNT(CASE WHEN e.status = 'clicked' THEN 1 END) as clicked_count,
        COUNT(CASE WHEN e.status = 'replied' THEN 1 END) as replied_count
      FROM campaigns c
      LEFT JOIN emails e ON c.id = e.campaign_id
      WHERE c.user_id = ${userId}
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `

    return NextResponse.json(campaigns)
  } catch (error: any) {
    console.error("Get campaigns error:", error)
    return NextResponse.json({ error: "Failed to get campaigns" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "user_123"
    const { name, description, template_id, contact_list_id, schedule_type, schedule_data } = await request.json()

    const result = await sql`
      INSERT INTO campaigns (
        user_id, name, description, template_id, contact_list_id, 
        schedule_type, schedule_data, status
      ) VALUES (
        ${userId}, ${name}, ${description}, ${template_id}, ${contact_list_id},
        ${schedule_type}, ${JSON.stringify(schedule_data)}, 'draft'
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Create campaign error:", error)
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
