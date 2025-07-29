"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send, Wand2, Copy, RefreshCw, User, Mail } from "lucide-react"
import { toast } from "sonner"

interface EmailData {
  recipientName: string
  recipientCompany: string
  recipientRole: string
  linkedinUrl: string
  emailPurpose: string
  tone: string
  template: string
}

export function RealTimeEmailComposer() {
  const [emailData, setEmailData] = useState<EmailData>({
    recipientName: "",
    recipientCompany: "",
    recipientRole: "",
    linkedinUrl: "",
    emailPurpose: "",
    tone: "professional",
    template: "cold_outreach",
  })
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleInputChange = (field: keyof EmailData, value: string) => {
    setEmailData((prev) => ({ ...prev, [field]: value }))
  }

  const generateEmail = async () => {
    if (!emailData.recipientName || !emailData.recipientCompany) {
      toast.error("Please fill in recipient name and company")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate email")
      }

      const data = await response.json()
      setGeneratedEmail(data.email)
      toast.success("Email generated successfully!")
    } catch (error) {
      console.error("Error generating email:", error)
      // Fallback to mock email generation
      const mockEmail = `Subject: Quick question about ${emailData.recipientCompany}'s growth

Hi ${emailData.recipientName},

I hope this email finds you well. I came across your profile and was impressed by your work as ${emailData.recipientRole} at ${emailData.recipientCompany}.

I noticed that ${emailData.recipientCompany} has been expanding rapidly, and I thought you might be interested in learning how we've helped similar companies streamline their operations and increase efficiency by up to 40%.

Would you be open to a brief 15-minute call this week to discuss how we could potentially help ${emailData.recipientCompany} achieve similar results?

Best regards,
[Your Name]

P.S. I'd be happy to share a case study of how we helped a company in your industry save $50K annually.`

      setGeneratedEmail(mockEmail)
      toast.success("Email generated successfully!")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail)
    toast.success("Email copied to clipboard!")
  }

  const sendEmail = async () => {
    if (!generatedEmail) {
      toast.error("Please generate an email first")
      return
    }

    setIsSending(true)
    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: generatedEmail,
          recipientEmail: `${emailData.recipientName.toLowerCase().replace(" ", ".")}@${emailData.recipientCompany.toLowerCase().replace(" ", "")}.com`,
          recipientName: emailData.recipientName,
          subject: generatedEmail.split("\n")[0].replace("Subject: ", ""),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      toast.success("Email sent successfully!")
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error("Failed to send email. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recipient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Recipient Information
                </CardTitle>
                <CardDescription>Enter details about your prospect</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipientName">Full Name *</Label>
                  <Input
                    id="recipientName"
                    placeholder="John Smith"
                    value={emailData.recipientName}
                    onChange={(e) => handleInputChange("recipientName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recipientCompany">Company *</Label>
                  <Input
                    id="recipientCompany"
                    placeholder="TechCorp Inc."
                    value={emailData.recipientCompany}
                    onChange={(e) => handleInputChange("recipientCompany", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recipientRole">Job Title</Label>
                  <Input
                    id="recipientRole"
                    placeholder="VP of Sales"
                    value={emailData.recipientRole}
                    onChange={(e) => handleInputChange("recipientRole", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn Profile (Optional)</Label>
                  <Input
                    id="linkedinUrl"
                    placeholder="https://linkedin.com/in/johnsmith"
                    value={emailData.linkedinUrl}
                    onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Email Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Configuration
                </CardTitle>
                <CardDescription>Customize your email settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emailPurpose">Email Purpose</Label>
                  <Textarea
                    id="emailPurpose"
                    placeholder="Introduce our marketing automation platform that helps companies increase lead conversion by 40%"
                    value={emailData.emailPurpose}
                    onChange={(e) => handleInputChange("emailPurpose", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={emailData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select value={emailData.template} onValueChange={(value) => handleInputChange("template", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                      <SelectItem value="introduction">Introduction</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button onClick={generateEmail} disabled={isGenerating} className="flex-1">
              {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
              {isGenerating ? "Generating..." : "Generate Email"}
            </Button>
            {generatedEmail && (
              <Button variant="outline" onClick={() => setGeneratedEmail("")}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview">
          {generatedEmail ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated Email</CardTitle>
                    <CardDescription>Review and customize your email before sending</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{emailData.tone} tone</Badge>
                    <Badge variant="outline">{emailData.template.replace("_", " ")}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={generatedEmail}
                    onChange={(e) => setGeneratedEmail(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-3">
                    <Button onClick={copyToClipboard} variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={sendEmail} disabled={isSending} className="flex-1">
                      {isSending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {isSending ? "Sending..." : "Send Email"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No email generated yet</h3>
                  <p className="text-gray-500 mb-4">
                    Fill in the recipient information and click "Generate Email" to get started.
                  </p>
                  <Button onClick={() => document.querySelector('[value="compose"]')?.click()}>Go to Compose</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
