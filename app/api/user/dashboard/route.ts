import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user dashboard statistics
    const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM emails WHERE user_id = ${userId}) as total_emails,
        (SELECT COUNT(*) FROM emails WHERE user_id = ${userId} AND status = 'delivered') as delivered_emails,
        (SELECT COUNT(*) FROM emails WHERE user_id = ${userId} AND status = 'opened') as opened_emails,
        (SELECT COUNT(*) FROM emails WHERE user_id = ${userId} AND status = 'clicked') as clicked_emails,
        (SELECT COUNT(*) FROM emails WHERE user_id = ${userId} AND status = 'replied') as replied_emails,
        (SELECT COUNT(*) FROM email_templates WHERE user_id = ${userId}) as total_templates,
        (SELECT COUNT(*) FROM campaigns WHERE user_id = ${userId}) as total_campaigns
    `

    // Get recent activity
    const recentActivity = await sql`
      SELECT 
        'email' as type,
        e.id,
        e.recipient_email as title,
        e.status,
        e.created_at
      FROM emails e
      WHERE e.user_id = ${userId}
      ORDER BY e.created_at DESC
      LIMIT 10
    `

    // Get monthly usage
    const monthlyUsage = await sql`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as emails_sent
      FROM emails 
      WHERE user_id = ${userId}
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date DESC
    `

    return NextResponse.json({
      stats: stats[0],
      recentActivity,
      monthlyUsage,
    })
  } catch (error: any) {
    console.error("Get dashboard data error:", error)
    return NextResponse.json({ error: "Failed to get dashboard data" }, { status: 500 })
  }
}
