import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json()

    if (!testEmail) {
      return NextResponse.json({ error: "Test email address is required" }, { status: 400 })
    }

    // Create transporter with current SMTP settings
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Verify connection
    await transporter.verify()

    // Send test email
    const testMailOptions = {
      from: process.env.SMTP_USER,
      to: testEmail,
      subject: "ColdReach Email Test - Configuration Successful",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">🎉 Email Configuration Test Successful!</h2>
          
          <p>Congratulations! Your ColdReach email configuration is working correctly.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">Test Details:</h3>
            <ul style="color: #64748b;">
              <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST || "smtp.gmail.com"}</li>
              <li><strong>SMTP Port:</strong> ${process.env.SMTP_PORT || "587"}</li>
              <li><strong>From Email:</strong> ${process.env.SMTP_USER}</li>
              <li><strong>Test Time:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          
          <p>You can now send live emails through ColdReach with real-time tracking!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
            <p>This is an automated test email from ColdReach.</p>
          </div>
        </div>
      `,
    }

    const info = await transporter.sendMail(testMailOptions)

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      messageId: info.messageId,
      testEmail,
    })
  } catch (error: any) {
    console.error("Test email error:", error)

    let errorMessage = "Failed to send test email"
    if (error.code === "EAUTH") {
      errorMessage = "Authentication failed. Please check your email credentials."
    } else if (error.code === "ECONNECTION") {
      errorMessage = "Connection failed. Please check your SMTP settings."
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error.code || "UNKNOWN_ERROR",
      },
      { status: 500 },
    )
  }
}
