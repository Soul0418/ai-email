"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Mail, User, Bell, Save, TestTube, AlertCircle, CheckCircle } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserMenu } from "@/components/auth/user-menu"
import { toast } from "sonner"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

function EmailSettingsContent() {
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    fromName: "",
    fromEmail: "",
    replyToEmail: "",
    enableTLS: true,
    provider: "custom", // "custom", "gmail", "outlook", "sendgrid"
  })

  const [signature, setSignature] = useState(`Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Phone]
[Your Website]`)

  const [trackingSettings, setTrackingSettings] = useState({
    enableOpenTracking: true,
    enableClickTracking: true,
    enableReplyTracking: true,
    enableUnsubscribeLink: true,
  })

  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSaveSettings = async () => {
    try {
      // Here you would save settings to your backend
      toast.success("Email settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save email settings")
    }
  }

  const handleTestConnection = async () => {
    setIsTestingConnection(true)

    try {
      // Simulate testing email connection
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setConnectionStatus("success")
      toast.success("Email connection test successful!")
    } catch (error) {
      setConnectionStatus("error")
      toast.error("Email connection test failed")
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleSendTestEmail = async () => {
    try {
      // Simulate sending test email
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Test email sent successfully!")
    } catch (error) {
      toast.error("Failed to send test email")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ColdReach</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            </Link>
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Email Settings</h1>
            <p className="text-slate-600">Configure your email sending preferences and SMTP settings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Settings Navigation */}
            <div className="space-y-2">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-700">
                      <Mail className="w-4 h-4 mr-2" />
                      SMTP Configuration
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Sender Identity
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="w-4 h-4 mr-2" />
                      Tracking Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <TestTube className="w-4 h-4 mr-2" />
                      Test & Verify
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Email Provider Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Email Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Choose your email provider</Label>
                    <Select
                      value={emailConfig.provider}
                      onValueChange={(value) => setEmailConfig({ ...emailConfig, provider: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gmail">Gmail</SelectItem>
                        <SelectItem value="outlook">Outlook</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="custom">Custom SMTP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {emailConfig.provider === "custom" && (
                    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="smtp-host">SMTP Host</Label>
                          <Input
                            id="smtp-host"
                            placeholder="smtp.gmail.com"
                            value={emailConfig.smtpHost}
                            onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="smtp-port">SMTP Port</Label>
                          <Input
                            id="smtp-port"
                            placeholder="587"
                            value={emailConfig.smtpPort}
                            onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="smtp-username">Username</Label>
                        <Input
                          id="smtp-username"
                          placeholder="your-email@gmail.com"
                          value={emailConfig.smtpUsername}
                          onChange={(e) => setEmailConfig({ ...emailConfig, smtpUsername: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="smtp-password">Password / App Password</Label>
                        <Input
                          id="smtp-password"
                          type="password"
                          placeholder="Your app password"
                          value={emailConfig.smtpPassword}
                          onChange={(e) => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Enable TLS/SSL</Label>
                          <p className="text-sm text-slate-600">Recommended for secure email sending</p>
                        </div>
                        <Switch
                          checked={emailConfig.enableTLS}
                          onCheckedChange={(checked) => setEmailConfig({ ...emailConfig, enableTLS: checked })}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sender Identity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Sender Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from-name">From Name</Label>
                      <Input
                        id="from-name"
                        placeholder="Your Name"
                        value={emailConfig.fromName}
                        onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="from-email">From Email</Label>
                      <Input
                        id="from-email"
                        type="email"
                        placeholder="your-email@company.com"
                        value={emailConfig.fromEmail}
                        onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reply-to">Reply-To Email</Label>
                    <Input
                      id="reply-to"
                      type="email"
                      placeholder="replies@company.com"
                      value={emailConfig.replyToEmail}
                      onChange={(e) => setEmailConfig({ ...emailConfig, replyToEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signature">Email Signature</Label>
                    <Textarea
                      id="signature"
                      rows={6}
                      placeholder="Your email signature..."
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Email Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Open Tracking</h4>
                      <p className="text-sm text-slate-600">Track when recipients open your emails</p>
                    </div>
                    <Switch
                      checked={trackingSettings.enableOpenTracking}
                      onCheckedChange={(checked) =>
                        setTrackingSettings({ ...trackingSettings, enableOpenTracking: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Click Tracking</h4>
                      <p className="text-sm text-slate-600">Track when recipients click links in your emails</p>
                    </div>
                    <Switch
                      checked={trackingSettings.enableClickTracking}
                      onCheckedChange={(checked) =>
                        setTrackingSettings({ ...trackingSettings, enableClickTracking: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Reply Tracking</h4>
                      <p className="text-sm text-slate-600">Get notified when recipients reply to your emails</p>
                    </div>
                    <Switch
                      checked={trackingSettings.enableReplyTracking}
                      onCheckedChange={(checked) =>
                        setTrackingSettings({ ...trackingSettings, enableReplyTracking: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Unsubscribe Link</h4>
                      <p className="text-sm text-slate-600">Include unsubscribe link in emails (recommended)</p>
                    </div>
                    <Switch
                      checked={trackingSettings.enableUnsubscribeLink}
                      onCheckedChange={(checked) =>
                        setTrackingSettings({ ...trackingSettings, enableUnsubscribeLink: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Test & Verify */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TestTube className="w-5 h-5 mr-2" />
                    Test & Verify
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Test SMTP Connection</h4>
                      <p className="text-sm text-slate-600">Verify your email configuration is working</p>
                      {connectionStatus === "success" && (
                        <div className="flex items-center space-x-1 mt-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Connection successful</span>
                        </div>
                      )}
                      {connectionStatus === "error" && (
                        <div className="flex items-center space-x-1 mt-1">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-600">Connection failed</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleTestConnection}
                      disabled={isTestingConnection}
                      className="bg-transparent"
                    >
                      {isTestingConnection ? "Testing..." : "Test Connection"}
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Send Test Email</h4>
                      <p className="text-sm text-slate-600">Send a test email to verify everything works</p>
                    </div>
                    <Button variant="outline" onClick={handleSendTestEmail} className="bg-transparent">
                      Send Test
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Email Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmailSettingsPage() {
  return (
    <ProtectedRoute>
      <EmailSettingsContent />
    </ProtectedRoute>
  )
}
