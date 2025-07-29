"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, User, Building, Calendar, Save, Crown, Zap } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { toast } from "sonner"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

function ProfileContent() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    company: "",
    jobTitle: "",
    location: "",
    bio: "",
  })

  const handleSave = async () => {
    try {
      // Here you would typically update the user profile via API
      // await updateUserProfile(formData)
      setIsEditing(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getUserPlan = () => {
    return "Free" // This would come from your subscription system
  }

  const getUsageStats = () => {
    return {
      emailsUsed: 4,
      emailsLimit: 20,
      templatesCreated: 12,
      responseRate: "24%",
    }
  }

  const stats = getUsageStats()

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
            <Link href="/templates">
              <Button variant="ghost" size="sm">
                Templates
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.profileImageUrl || ""} alt={user?.displayName || "User"} />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {getInitials(user?.displayName || user?.primaryEmail || "U")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-slate-900">{user?.displayName || "User"}</h1>
                    <Badge
                      className={`${getUserPlan() === "Pro" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {getUserPlan() === "Pro" && <Crown className="w-3 h-3 mr-1" />}
                      {getUserPlan()}
                    </Badge>
                  </div>
                  <p className="text-slate-600 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {user?.primaryEmail}
                  </p>
                  <p className="text-slate-500 text-sm flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member since {new Date(user?.createdAtMillis || Date.now()).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent">
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">Full Name</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        placeholder="Your company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        placeholder="Your job title"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-slate-600">Receive updates about your account and usage</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Configure
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Enable
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-600">Delete Account</h4>
                      <p className="text-sm text-slate-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Stats & Plan */}
            <div className="space-y-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-600" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{getUserPlan()}</h3>
                      <p className="text-slate-600">{getUserPlan() === "Free" ? "$0/month" : "$29/month"}</p>
                    </div>
                    {getUserPlan() === "Free" && (
                      <Link href="/pricing">
                        <Button className="w-full">
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade to Pro
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Usage Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Emails Generated</span>
                      <span>
                        {stats.emailsUsed} / {stats.emailsLimit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(stats.emailsUsed / stats.emailsLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Templates Created</span>
                      <span className="font-medium">{stats.templatesCreated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Avg. Response Rate</span>
                      <span className="font-medium text-green-600">{stats.responseRate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Mail className="w-4 h-4 mr-2" />
                      Generate Email
                    </Button>
                  </Link>
                  <Link href="/templates">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Building className="w-4 h-4 mr-2" />
                      View Templates
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}
