import { type NextRequest, NextResponse } from "next/server"
import { emailDatabase } from "../send/route"

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || "user_123"
    const timeframe = request.nextUrl.searchParams.get("timeframe") || "7d" // 7d, 30d, 90d

    // Calculate date range
    const now = new Date()
    const daysBack = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Filter emails by user and date range
    const userEmails = emailDatabase.filter((email) => email.userId === userId && new Date(email.sentAt) >= startDate)

    // Calculate analytics
    const totalSent = userEmails.length
    const totalDelivered = userEmails.filter((email) => email.status === "delivered" || email.openedAt).length
    const totalOpened = userEmails.filter((email) => email.openedAt).length
    const totalClicked = userEmails.filter((email) => email.clickedAt).length
    const totalReplied = userEmails.filter((email) => email.repliedAt).length
    const totalBounced = userEmails.filter((email) => email.status === "bounced").length
    const totalFailed = userEmails.filter((email) => email.status === "failed").length

    // Calculate rates
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0
    const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0
    const replyRate = totalDelivered > 0 ? (totalReplied / totalDelivered) * 100 : 0
    const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0

    // Daily breakdown
    const dailyStats = []
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

      const dayEmails = userEmails.filter((email) => {
        const emailDate = new Date(email.sentAt)
        return emailDate >= dayStart && emailDate < dayEnd
      })

      dailyStats.push({
        date: dayStart.toISOString().split("T")[0],
        sent: dayEmails.length,
        delivered: dayEmails.filter((email) => email.status === "delivered" || email.openedAt).length,
        opened: dayEmails.filter((email) => email.openedAt).length,
        clicked: dayEmails.filter((email) => email.clickedAt).length,
        replied: dayEmails.filter((email) => email.repliedAt).length,
      })
    }

    // Top performing emails
    const topEmails = userEmails
      .filter((email) => email.openedAt)
      .sort((a, b) => {
        const aScore = (a.openedAt ? 1 : 0) + (a.clickedAt ? 2 : 0) + (a.repliedAt ? 3 : 0)
        const bScore = (b.openedAt ? 1 : 0) + (b.clickedAt ? 2 : 0) + (b.repliedAt ? 3 : 0)
        return bScore - aScore
      })
      .slice(0, 10)
      .map((email) => ({
        id: email.id,
        subject: email.subject,
        to: email.to,
        sentAt: email.sentAt,
        openedAt: email.openedAt,
        clickedAt: email.clickedAt,
        repliedAt: email.repliedAt,
      }))

    return NextResponse.json({
      summary: {
        totalSent,
        totalDelivered,
        totalOpened,
        totalClicked,
        totalReplied,
        totalBounced,
        totalFailed,
        deliveryRate: Math.round(deliveryRate * 100) / 100,
        openRate: Math.round(openRate * 100) / 100,
        clickRate: Math.round(clickRate * 100) / 100,
        replyRate: Math.round(replyRate * 100) / 100,
        bounceRate: Math.round(bounceRate * 100) / 100,
      },
      dailyStats,
      topEmails,
      timeframe,
    })
  } catch (error: any) {
    console.error("Error fetching email analytics:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 })
  }
}
