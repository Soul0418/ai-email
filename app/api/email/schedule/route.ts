import { type NextRequest, NextResponse } from "next/server"

interface ScheduledEmail {
  id: string
  userId: string
  emailData: any
  scheduledFor: string
  status: "scheduled" | "sent" | "failed"
  createdAt: string
}

// In-memory storage for scheduled emails
const scheduledEmails: ScheduledEmail[] = []

export async function POST(request: NextRequest) {
  try {
    const emailData = await request.json()
    const { scheduleDate, scheduleTime, ...restEmailData } = emailData

    // Get user ID from headers or auth
    const userId = request.headers.get("x-user-id") || "user_123"

    // Validate schedule date and time
    if (!scheduleDate || !scheduleTime) {
      return NextResponse.json({ error: "Schedule date and time are required" }, { status: 400 })
    }

    // Create scheduled datetime
    const scheduledFor = new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
    const now = new Date().toISOString()

    if (scheduledFor <= now) {
      return NextResponse.json({ error: "Scheduled time must be in the future" }, { status: 400 })
    }

    // Generate unique ID
    const emailId = `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create scheduled email record
    const scheduledEmail: ScheduledEmail = {
      id: emailId,
      userId,
      emailData: restEmailData,
      scheduledFor,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    }

    // Store in database
    scheduledEmails.push(scheduledEmail)

    // Schedule the email sending
    scheduleEmailSending(scheduledEmail)

    return NextResponse.json({
      success: true,
      emailId,
      scheduledFor,
      status: "scheduled",
    })
  } catch (error: any) {
    console.error("Schedule email error:", error)
    return NextResponse.json({ error: error.message || "Failed to schedule email" }, { status: 500 })
  }
}

function scheduleEmailSending(scheduledEmail: ScheduledEmail) {
  const now = new Date().getTime()
  const scheduledTime = new Date(scheduledEmail.scheduledFor).getTime()
  const delay = scheduledTime - now

  if (delay > 0) {
    setTimeout(async () => {
      try {
        // Send the email using the send API
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": scheduledEmail.userId,
          },
          body: JSON.stringify(scheduledEmail.emailData),
        })

        const result = await response.json()

        // Update scheduled email status
        const index = scheduledEmails.findIndex((email) => email.id === scheduledEmail.id)
        if (index !== -1) {
          scheduledEmails[index].status = result.success ? "sent" : "failed"
        }
      } catch (error) {
        console.error("Error sending scheduled email:", error)
        // Update status to failed
        const index = scheduledEmails.findIndex((email) => email.id === scheduledEmail.id)
        if (index !== -1) {
          scheduledEmails[index].status = "failed"
        }
      }
    }, delay)
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id") || "user_123"
    const userScheduledEmails = scheduledEmails.filter((email) => email.userId === userId)

    return NextResponse.json(userScheduledEmails)
  } catch (error: any) {
    console.error("Get scheduled emails error:", error)
    return NextResponse.json({ error: error.message || "Failed to get scheduled emails" }, { status: 500 })
  }
}
