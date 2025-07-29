"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  Send,
  Eye,
  MousePointer,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  BarChart3,
  Target,
  Clock,
} from "lucide-react"
import { RealTimeEmailComposer } from "@/components/email/real-time-email-composer"
import { SentEmails } from "@/components/email/sent-emails"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useUser } from "@clerk/nextjs"

interface DashboardStats {
  emailsSent: number
  openRate: number
  clickRate: number
  responseRate: number
  totalContacts: number
  activeTemplates: number
}

interface RecentActivity {
  id: string
  type: "email_sent" | "email_opened" | "email_clicked" | "response_received"
  description: string
  timestamp: string
  recipient?: string
}

export default function DashboardPage() {
  const { user } = useUser()
  const [stats, setStats] = useState<DashboardStats>({
    emailsSent: 0,
    openRate: 0,
    clickRate: 0,
    responseRate: 0,
    totalContacts: 0,
    activeTemplates: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/user/dashboard")
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setRecentActivity(data.recentActivity)
        } else {
          // Fallback to mock data
          setStats({
            emailsSent: 247,
            openRate: 68.5,
            clickRate: 23.2,
            responseRate: 12.8,
            totalContacts: 1543,
            activeTemplates: 8,
          })
          setRecentActivity([
            {
              id: "1",
              type: "email_sent",
              description: "Cold email sent to John Smith at TechCorp",
              timestamp: "2 minutes ago",
              recipient: "john.smith@techcorp.com",
            },
            {
              id: "2",
              type: "email_opened",
              description: "Sarah Johnson opened your email",
              timestamp: "15 minutes ago",
              recipient: "sarah.j@startup.io",
            },
            {
              id: "3",
              type: "response_received",
              description: "Mike Davis replied to your outreach",
              timestamp: "1 hour ago",
              recipient: "mike@company.com",
            },
            {
              id: "4",
              type: "email_clicked",
              description: "Lisa Chen clicked your calendar link",
              timestamp: "2 hours ago",
              recipient: "lisa.chen@enterprise.com",
            },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        // Use mock data on error
        setStats({
          emailsSent: 247,
          openRate: 68.5,
          clickRate: 23.2,
          responseRate: 12.8,
          totalContacts: 1543,
          activeTemplates: 8,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "email_sent":
        return <Send className="h-4 w-4 text-blue-600" />
      case "email_opened":
        return <Eye className="h-4 w-4 text-green-600" />
      case "email_clicked":
        return <MousePointer className="h-4 w-4 text-purple-600" />
      case "response_received":
        return <Mail className="h-4 w-4 text-orange-600" />
      default:
        return <Mail className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "email_sent":
        return "bg-blue-50 border-blue-200"
      case "email_opened":
        return "bg-green-50 border-green-200"
      case "email_clicked":
        return "bg-purple-50 border-purple-200"
      case "response_received":
        return "bg-orange-50 border-orange-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || "User"}!</h1>
                  <p className="text-gray-600">Here's what's happening with your cold email campaigns.</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.emailsSent}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.openRate}%</div>
                <Progress value={stats.openRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.clickRate}%</div>
                <Progress value={stats.clickRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.responseRate}%</div>
                <Progress value={stats.responseRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Email Composer */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="compose" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="compose">Compose</TabsTrigger>
                  <TabsTrigger value="sent">Sent Emails</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="compose">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Email Composer</CardTitle>
                      <CardDescription>Generate personalized cold emails using AI</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RealTimeEmailComposer />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sent">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sent Emails</CardTitle>
                      <CardDescription>Track your sent emails and their performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SentEmails />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Email Analytics</CardTitle>
                      <CardDescription>Detailed insights into your email performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-blue-600">{stats.totalContacts}</div>
                            <div className="text-sm text-gray-600">Total Contacts</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-600">{stats.activeTemplates}</div>
                            <div className="text-sm text-gray-600">Active Templates</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-purple-600">94%</div>
                            <div className="text-sm text-gray-600">Deliverability</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
                        <div className="flex items-start space-x-3">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                            {activity.recipient && <p className="text-xs text-gray-500 mt-1">{activity.recipient}</p>}
                            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Campaign
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Import Contacts
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
