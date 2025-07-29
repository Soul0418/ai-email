import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

// Database helper functions
export async function getUserById(userId: string) {
  const result = await sql`
    SELECT * FROM users WHERE id = ${userId}
  `
  return result[0] || null
}

export async function getUserSettings(userId: string) {
  const result = await sql`
    SELECT * FROM user_settings WHERE user_id = ${userId}
  `
  return result[0] || null
}

export async function getUserEmailStats(userId: string) {
  const result = await sql`
    SELECT 
      COUNT(*) as total_sent,
      COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered,
      COUNT(CASE WHEN status = 'opened' THEN 1 END) as opened,
      COUNT(CASE WHEN status = 'clicked' THEN 1 END) as clicked,
      COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied
    FROM emails 
    WHERE user_id = ${userId}
      AND created_at >= CURRENT_DATE - INTERVAL '30 days'
  `
  return result[0] || { total_sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0 }
}

export async function getUserTemplates(userId: string) {
  const result = await sql`
    SELECT * FROM email_templates 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `
  return result
}

export async function getUserCampaigns(userId: string) {
  const result = await sql`
    SELECT c.*, 
           COUNT(e.id) as total_emails,
           COUNT(CASE WHEN e.status = 'delivered' THEN 1 END) as delivered_count
    FROM campaigns c
    LEFT JOIN emails e ON c.id = e.campaign_id
    WHERE c.user_id = ${userId}
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `
  return result
}

export async function getUserRecentEmails(userId: string, limit = 10) {
  const result = await sql`
    SELECT e.*, et.subject, et.recipient_name
    FROM emails e
    LEFT JOIN email_templates et ON e.template_id = et.id
    WHERE e.user_id = ${userId}
    ORDER BY e.created_at DESC
    LIMIT ${limit}
  `
  return result
}
