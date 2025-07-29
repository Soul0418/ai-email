import { type NextRequest, NextResponse } from "next/server"
import { emailStatusSubscribers } from "../../send/route"

export async function GET(request: NextRequest, { params }: { params: { emailId: string } }) {
  const emailId = params.emailId

  // Set up Server-Sent Events
  const encoder = new TextEncoder()

  const customReadable = new ReadableStream({
    start(controller) {
      // Add subscriber for this email
      if (!emailStatusSubscribers.has(emailId)) {
        emailStatusSubscribers.set(emailId, new Set())
      }

      const subscribers = emailStatusSubscribers.get(emailId)!

      const sendUpdate = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      // Add this connection to subscribers
      subscribers.add(sendUpdate)

      // Send initial connection message
      sendUpdate({ type: "connected", emailId, timestamp: new Date().toISOString() })

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        subscribers.delete(sendUpdate)
        if (subscribers.size === 0) {
          emailStatusSubscribers.delete(emailId)
        }
        controller.close()
      })

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        if (!request.signal.aborted) {
          sendUpdate({ type: "heartbeat", timestamp: new Date().toISOString() })
        } else {
          clearInterval(heartbeat)
        }
      }, 30000) // 30 seconds

      // Clean up heartbeat on abort
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
      })
    },
  })

  return new NextResponse(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
