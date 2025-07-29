"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Send, Copy, Edit, Save, Clock, Eye, Mail, User, Calendar } from "lucide-react"
import { toast } from "sonner"

interface EmailComposerProps {
  subject: string
  emailBody: string
  recipientName?: string
  recipientEmail?: string
  onSend?: (emailData: any) => void
  onCopy?: () => void
  onSave?: () => void
}

export function EmailComposer({
  subject,
  emailBody,
  recipientName,
  recipientEmail,
  onSend,
  onCopy,
  onSave,
}: EmailComposerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [editedSubject, setEditedSubject] = useState(subject)
  const [editedBody, setEditedBody] = useState(emailBody)
  const [toEmail, setToEmail] = useState(recipientEmail || "")
  const [fromEmail, setFromEmail] = useState("your-email@company.com")
  const [ccEmails, setCcEmails] = useState("")
  const [bccEmails, setBccEmails] = useState("")
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [sendOption, setSendOption] = useState("now") // "now", "schedule", "draft"

  const handleSendEmail = async () => {
    if (!toEmail) {
      toast.error("Please enter recipient email address")
      return
    }

    setIsSending(true)

    try {
      const emailData = {
        to: toEmail,
        from: fromEmail,
        cc: ccEmails ? ccEmails.split(",").map((email) => email.trim()) : [],
        bcc: bccEmails ? bccEmails.split(",").map((email) => email.trim()) : [],
        subject: editedSubject,
        body: editedBody,
        recipientName,
        scheduleDate: sendOption === "schedule" ? scheduleDate : null,
        scheduleTime: sendOption === "schedule" ? scheduleTime : null,
      }

      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (sendOption === "schedule") {
        toast.success(`Email scheduled for ${scheduleDate} at ${scheduleTime}`)
      } else if (sendOption === "draft") {
        toast.success("Email saved as draft")
      } else {
        toast.success("Email sent successfully!")
      }

      onSend?.(emailData)
    } catch (error) {
      toast.error("Failed to send email")
    } finally {
      setIsSending(false)
    }
  }

  const handleScheduleEmail = () => {
    setIsScheduling(true)
    setSendOption("schedule")
  }

  const handlePreview = () => {
    // Open email preview in a new window or modal
    const previewWindow = window.open("", "_blank", "width=600,height=800")
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Email Preview</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              .email-header { border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
              .email-body { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <div class="email-header">
              <p><strong>To:</strong> ${toEmail}</p>
              <p><strong>From:</strong> ${fromEmail}</p>
              ${ccEmails ? `<p><strong>CC:</strong> ${ccEmails}</p>` : ""}
              <p><strong>Subject:</strong> ${editedSubject}</p>
            </div>
            <div class="email-body">${editedBody}</div>
          </body>
        </html>
      `)
      previewWindow.document.close()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2 text-slate-600" />
            Email Composer
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              <User className="w-3 h-3 mr-1" />
              {recipientName || "Recipient"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Headers */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from-email">From</Label>
              <Input
                id="from-email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="your-email@company.com"
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="to-email">To *</Label>
              <Input
                id="to-email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="recipient@company.com"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cc-emails">CC</Label>
              <Input
                id="cc-emails"
                value={ccEmails}
                onChange={(e) => setCcEmails(e.target.value)}
                placeholder="cc1@company.com, cc2@company.com"
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="bcc-emails">BCC</Label>
              <Input
                id="bcc-emails"
                value={bccEmails}
                onChange={(e) => setBccEmails(e.target.value)}
                placeholder="bcc1@company.com, bcc2@company.com"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Line */}
        <div>
          <Label htmlFor="subject">Subject Line</Label>
          {isEditing ? (
            <Input
              id="subject"
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
              className="font-medium"
            />
          ) : (
            <div className="mt-1 p-3 bg-slate-50 rounded-lg border">
              <p className="font-medium text-slate-900">{editedSubject}</p>
            </div>
          )}
        </div>

        {/* Email Body */}
        <div>
          <Label htmlFor="email-body">Email Body</Label>
          {isEditing ? (
            <Textarea
              id="email-body"
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows={12}
              className="leading-relaxed"
            />
          ) : (
            <div className="mt-1 p-4 bg-slate-50 rounded-lg border">
              <div className="whitespace-pre-wrap text-slate-900 leading-relaxed">{editedBody}</div>
            </div>
          )}
        </div>

        {/* Send Options */}
        {isEditing && (
          <div className="space-y-4">
            <Separator />
            <div>
              <Label>Send Options</Label>
              <Select value={sendOption} onValueChange={setSendOption}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Send Now</SelectItem>
                  <SelectItem value="schedule">Schedule Send</SelectItem>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sendOption === "schedule" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schedule-date">Date</Label>
                  <Input
                    id="schedule-date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="schedule-time">Time</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {sendOption === "now" && (
            <Button onClick={handleSendEmail} disabled={isSending || !toEmail} className="flex-1 sm:flex-none">
              {isSending ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          )}

          {sendOption === "schedule" && (
            <Button
              onClick={handleSendEmail}
              disabled={isSending || !toEmail || !scheduleDate || !scheduleTime}
              className="flex-1 sm:flex-none"
            >
              {isSending ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-pulse" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Email
                </>
              )}
            </Button>
          )}

          {sendOption === "draft" && (
            <Button
              onClick={handleSendEmail}
              disabled={isSending}
              variant="outline"
              className="flex-1 sm:flex-none bg-transparent"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          )}

          <Button variant="outline" onClick={handlePreview} className="bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>

          <Button variant="outline" onClick={onCopy} className="bg-transparent">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>

          <Button variant="outline" onClick={onSave} className="bg-transparent">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>

        {/* Email Status */}
        {sendOption === "schedule" && scheduleDate && scheduleTime && (
          <div className="flex items-center space-x-2 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg">
            <Calendar className="w-4 h-4" />
            <span>
              This email will be sent on {new Date(scheduleDate).toLocaleDateString()} at {scheduleTime}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
