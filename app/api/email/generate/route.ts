import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { sql } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      recipientName,
      recipientEmail,
      recipientCompany,
      recipientRole,
      linkedinUrl,
      tone,
      purpose,
      includePersonalization,
    } = await request.json()

    // Check if user has OpenAI API key configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Generate email using OpenAI
    const prompt = `Generate a personalized cold email with the following details:
    
Recipient: ${recipientName}
Company: ${recipientCompany || "Unknown"}
Role: ${recipientRole || "Unknown"}
LinkedIn: ${linkedinUrl || "Not provided"}
Purpose: ${purpose}
Tone: ${tone}
Include Personalization: ${includePersonalization}

Generate both a subject line and email body. The email should be professional, concise, and personalized based on the recipient information provided.

Return the response in JSON format with 'subject' and 'body' fields.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert email copywriter specializing in cold outreach. Generate professional, personalized emails that get responses.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate email with OpenAI")
    }

    const aiResponse = await response.json()
    const generatedContent = aiResponse.choices[0].message.content

    // Try to parse as JSON, fallback to manual parsing
    let subject = ""
    let body = ""

    try {
      const parsed = JSON.parse(generatedContent)
      subject = parsed.subject
      body = parsed.body
    } catch {
      // Manual parsing if JSON parsing fails
      const lines = generatedContent.split("\n")
      const subjectLine = lines.find((line: string) => line.toLowerCase().includes("subject"))
      const bodyStart = lines.findIndex(
        (line: string) => line.toLowerCase().includes("body") || line.toLowerCase().includes("email"),
      )

      if (subjectLine) {
        subject = subjectLine.replace(/subject:?/i, "").trim()
      }
      if (bodyStart !== -1) {
        body = lines
          .slice(bodyStart + 1)
          .join("\n")
          .trim()
      }

      // Fallback
      if (!subject || !body) {
        subject = `Partnership Opportunity with ${recipientCompany || "Your Company"}`
        body = generatedContent
      }
    }

    // Save generation to database
    await sql`
      INSERT INTO email_generations (
        user_id, recipient_name, recipient_email, recipient_company,
        subject, body, purpose, tone, created_at
      ) VALUES (
        ${userId}, ${recipientName}, ${recipientEmail}, ${recipientCompany || ""},
        ${subject}, ${body}, ${purpose}, ${tone}, NOW()
      )
    `

    return NextResponse.json({ subject, body })
  } catch (error: any) {
    console.error("Generate email error:", error)
    return NextResponse.json({ error: "Failed to generate email" }, { status: 500 })
  }
}
