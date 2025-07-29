import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { sql } from "@/lib/database"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { to, subject, body, recipientName, recipientCompany } = await request.json()

    // Validate required fields
    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check email configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Generate tracking ID
    const trackingId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Add tracking pixel to email body
    const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_APP_URL}/api/email/track/open/${trackingId}" width="1" height="1" style="display:none;" />`
    const emailBodyWithTracking = body + trackingPixel

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html: emailBodyWithTracking,
    })

    // Save to database
    const result = await sql`
      INSERT INTO emails (
        user_id, recipient_email, recipient_name, recipient_company,
        subject, body, status, tracking_id, message_id, created_at
      ) VALUES (
        ${userId}, ${to}, ${recipientName || ""}, ${recipientCompany || ""},
        ${subject}, ${body}, 'sent', ${trackingId}, ${info.messageId}, NOW()
      )
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      emailId: result[0].id,
      messageId: info.messageId,
    })
  } catch (error: any) {
    console.error("Send email error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
