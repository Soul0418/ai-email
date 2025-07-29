import { type NextRequest, NextResponse } from "next/server"
import { emailDatabase } from "../../send/route"

export async function GET(request: NextRequest, { params }: { params: { emailId: string } }) {
  const emailId = params.emailId

  try {
    // Find email by ID
    const email = emailDatabase.find((email) => email.id === emailId)

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 })
    }

    // Return email status
    return NextResponse.json({
      id: email.id,
      status: email.status,
      to: email.to,
      from: email.from,
      subject: email.subject,
      sentAt: email.sentAt,
      deliveredAt: email.deliveredAt,
      openedAt: email.openedAt,
      clickedAt: email.clickedAt,
      repliedAt: email.repliedAt,
      trackingId: email.trackingId,
      error: email.error,
    })
  } catch (error: any) {
    console.error("Error fetching email status:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch email status" }, { status: 500 })
  }
}
