import { type NextRequest, NextResponse } from "next/server"
import { emailDatabase, emailStatusSubscribers } from "../../send/route"

// Webhook endpoint for handling email replies
// This would be called by your email service provider (SendGrid, Mailgun, etc.)
export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json()

    // Extract tracking information from webhook
    // Format depends on your email service provider
    const { trackingId, messageId, replyContent, replyFrom, replyAt } = webhookData

    // Find email by tracking ID or message ID
    const emailIndex = emailDatabase.findIndex(
      (email) => email.trackingId === trackingId || email.messageId === messageId,
    )

    if (emailIndex !== -1) {
      const email = emailDatabase[emailIndex]

      // Update email status to replied
      emailDatabase[emailIndex] = {
        ...email,
        status: "replied",
        repliedAt: replyAt || new Date().toISOString(),
      }

      // Broadcast update to real-time subscribers
      broadcastEmailUpdate(email.id, {
        ...emailDatabase[emailIndex],
        replyContent,
        replyFrom,
      })

      console.log(`Email ${email.id} replied by ${email.to} at ${replyAt || new Date().toISOString()}`)

      return NextResponse.json({ success: true, message: "Reply tracked successfully" })
    } else {
      return NextResponse.json({ error: "Email not found" }, { status: 404 })
    }
  } catch (error: any) {
    console.error("Reply webhook error:", error)
    return NextResponse.json({ error: error.message || "Failed to process reply webhook" }, { status: 500 })
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
