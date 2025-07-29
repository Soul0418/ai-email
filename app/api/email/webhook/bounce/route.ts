import { type NextRequest, NextResponse } from "next/server"
import { emailDatabase, emailStatusSubscribers } from "../../send/route"

// Webhook endpoint for handling email bounces
export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json()

    // Extract bounce information from webhook
    const { trackingId, messageId, bounceType, bounceReason, bouncedAt } = webhookData

    // Find email by tracking ID or message ID
    const emailIndex = emailDatabase.findIndex(
      (email) => email.trackingId === trackingId || email.messageId === messageId,
    )

    if (emailIndex !== -1) {
      const email = emailDatabase[emailIndex]

      // Update email status to bounced
      emailDatabase[emailIndex] = {
        ...email,
        status: "bounced",
        error: `Bounced: ${bounceReason || "Unknown reason"}`,
      }

      // Broadcast update to real-time subscribers
      broadcastEmailUpdate(email.id, {
        ...emailDatabase[emailIndex],
        bounceType,
        bounceReason,
        bouncedAt: bouncedAt || new Date().toISOString(),
      })

      console.log(`Email ${email.id} bounced: ${bounceReason}`)

      return NextResponse.json({ success: true, message: "Bounce tracked successfully" })
    } else {
      return NextResponse.json({ error: "Email not found" }, { status: 404 })
    }
  } catch (error: any) {
    console.error("Bounce webhook error:", error)
    return NextResponse.json({ error: error.message || "Failed to process bounce webhook" }, { status: 500 })
  }
}

function broadcastEmailUpdate(emailId: string, data: any) {
  const subscribers = emailStatusSubscribers.get(emailId)
  if (subscribers) {
    subscribers.forEach((callback) => {
      try {
        callback(data)
      } catch (error) {
        console.error("Error broadcasting update:", error)
      }
    })
  }
}
