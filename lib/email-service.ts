"use client"

// Email service for sending real emails
export interface EmailData {
  to: string
  from: string
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  recipientName?: string
  scheduleDate?: string | null
  scheduleTime?: string | null
}

export interface EmailStatus {
  id: string
  status: "sending" | "sent" | "delivered" | "opened" | "clicked" | "replied" | "bounced" | "failed"
  sentAt: string
  deliveredAt?: string
  openedAt?: string
  clickedAt?: string
  repliedAt?: string
  error?: string
  trackingId?: string
}

class EmailService {
  private apiKey: string | null = null
  private baseUrl = "/api/email"

  constructor() {
    // In a real app, this would come from environment variables
    this.apiKey = process.env.NEXT_PUBLIC_EMAIL_API_KEY || null
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; emailId: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(emailData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email")
      }

      return {
        success: true,
        emailId: result.emailId,
      }
    } catch (error: any) {
      return {
        success: false,
        emailId: "",
        error: error.message,
      }
    }
  }

  async scheduleEmail(emailData: EmailData): Promise<{ success: boolean; emailId: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(emailData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to schedule email")
      }

      return {
        success: true,
        emailId: result.emailId,
      }
    } catch (error: any) {
      return {
        success: false,
        emailId: "",
        error: error.message,
      }
    }
  }

  async getEmailStatus(emailId: string): Promise<EmailStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/status/${emailId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to get email status")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching email status:", error)
      return null
    }
  }

  async getSentEmails(userId: string): Promise<EmailStatus[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sent?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to get sent emails")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching sent emails:", error)
      return []
    }
  }

  // Real-time email tracking using WebSocket or Server-Sent Events
  subscribeToEmailUpdates(emailId: string, callback: (status: EmailStatus) => void): () => void {
    const eventSource = new EventSource(`${this.baseUrl}/track/${emailId}`)

    eventSource.onmessage = (event) => {
      const status: EmailStatus = JSON.parse(event.data)
      callback(status)
    }

    eventSource.onerror = (error) => {
      console.error("Email tracking error:", error)
    }

    // Return cleanup function
    return () => {
      eventSource.close()
    }
  }
}

export const emailService = new EmailService()
