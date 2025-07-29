import { type NextRequest, NextResponse } from "next/server"
import { emailDatabase, emailStatusSubscribers } from "../../../send/route"

export async function GET(request: NextRequest, { params }: { params: { trackingId: string } }) {
  const trackingId = params.trackingId
  const url = request.nextUrl.searchParams.get("url")

  try {
    // Find email by tracking ID
    const emailIndex = emailDatabase.findIndex((email) => email.trackingId === trackingId)

    if (emailIndex !== -1) {
      const email = emailDatabase[emailIndex]

      // Update email status to clicked (if not already replied)
      if (email.status !== "replied") {
        emailDatabase[emailIndex] = {
          ...email,
          status: "clicked",
          clickedAt: new Date().toISOString(),
        }

        // Broadcast update to real-time subscribers
        broadcastEmailUpdate(email.id, emailDatabase[emailIndex])

        console.log(`Email ${email.id} link clicked by ${email.to} at ${new Date().toISOString()}`)
      }
    }

    // Redirect to the original URL
    if (url) {
      return NextResponse.redirect(url)
    } else {
      return NextResponse.json({ message: "Link tracked successfully" })
    }
  } catch (error) {
    console.error("Click tracking error:", error)

    // Redirect to URL even on error
    if (url) {
      return NextResponse.redirect(url)
    }

    return NextResponse.json({ error: "Tracking failed" }, { status: 500 })
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
