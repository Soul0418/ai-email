import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { trackingId: string } }) {
  try {
    const { trackingId } = params

    // Update email status to opened
    await sql`
      UPDATE emails 
      SET status = 'opened', opened_at = NOW()
      WHERE tracking_id = ${trackingId} AND status != 'opened'
    `

    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "base64",
    )

    return new NextResponse(pixel, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Track email open error:", error)
    // Still return pixel even if tracking fails
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "base64",
    )
    return new NextResponse(pixel, {
      headers: { "Content-Type": "image/png" },
    })
  }
}
