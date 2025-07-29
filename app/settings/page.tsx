"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Mail, Bell, Shield, Palette, Globe, Key, Trash2, Save } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { toast } from "sonner"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

function SettingsContent() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
    theme: "light",
    language: "en",
    timezone: "UTC",
    twoFactorEnabled: false,
  })

  const handleSave = async () => {
    try {
      // Here you would save settings to your backend
      toast.success("Settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save settings")
    }
  }

  const handleExportData = async () => {
    try {
      // Here you would trigger data export
      toast.success("Data export started. You'll receive an email when ready.")
    } catch (error) {
      toast.error("Failed to export data")
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
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                Profile
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-slate-600">Manage your account preferences and security settings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Settings Navigation */}
            <div className="space-y-2">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-700">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Palette className="w-4 h-4 mr-2" />
                      Appearance
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Globe className="w-4 h-4 mr-2" />
                      Language & Region
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-slate-600">Receive notifications about your account activity</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Marketing Emails</h4>
                      <p className="text-sm text-slate-600">Receive updates about new features and tips</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Weekly Digest</h4>
                      <p className="text-sm text-slate-600">Get a summary of your weekly activity</p>
                    </div>
                    <Switch
                      checked={settings.weeklyDigest}
                      onCheckedChange={(checked) => setSettings({ ...settings, weeklyDigest: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                      {settings.twoFactorEnabled && (
                        <Badge variant="secondary" className="text-xs">
                          Enabled
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      {settings.twoFactorEnabled ? "Manage" : "Enable"}
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-slate-600">Update your account password</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Key className="w-4 h-4 mr-2" />
                      Change
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Active Sessions</h4>
                      <p className="text-sm text-slate-600">Manage your active login sessions</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      View Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => setSettings({ ...settings, theme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Language & Region */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Language & Region
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) => setSettings({ ...settings, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.timezone}
                        onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">GMT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data & Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Export Data</h4>
                      <p className="text-sm text-slate-600">Download a copy of your account data</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExportData} className="bg-transparent">
                      Export
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-red-600">Delete Account</h4>
                      <p className="text-sm text-slate-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}
