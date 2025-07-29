"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, MousePointer, Mail, Search, Filter, Calendar, TrendingUp, ExternalLink } from "lucide-react"

interface SentEmail {
  id: string
  subject: string
  recipient: string
  recipientCompany: string
  sentAt: string
  status: "sent" | "delivered" | "opened" | "clicked" | "replied"
  openCount: number
  clickCount: number
  template: string
}

export function SentEmails() {
  const [emails, setEmails] = useState<SentEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchSentEmails = async () => {
      try {
        const response = await fetch("/api/email/sent")
        if (response.ok) {
          const data = await response.json()
          setEmails(data.emails)
        } else {
          // Fallback to mock data
          setEmails([
            {
              id: "1",
              subject: "Quick question about TechCorp's growth",
              recipient: "john.smith@techcorp.com",
              recipientCompany: "TechCorp Inc.",
              sentAt: "2025-01-29T10:30:00Z",
              status: "opened",
              openCount: 3,
              clickCount: 1,
              template: "cold_outreach",
            },
            {
              id: "2",
              subject: "Partnership opportunity with StartupXYZ",
              recipient: "sarah.johnson@startupxyz.com",
              recipientCompany: "StartupXYZ",
              sentAt: "2025-01-29T09:15:00Z",
              status: "replied",
              openCount: 2,
              clickCount: 2,
              template: "partnership",
            },
            {
              id: "3",
              subject: "Following up on our conversation",
              recipient: "mike.davis@company.com",
              recipientCompany: "Company Ltd.",
              sentAt: "2025-01-28T16:45:00Z",
              status: "clicked",
              openCount: 1,
              clickCount: 1,
              template: "follow_up",
            },
            {
              id: "4",
              subject: "Introduction to our marketing platform",
              recipient: "lisa.chen@enterprise.com",
              recipientCompany: "Enterprise Corp",
              sentAt: "2025-01-28T14:20:00Z",
              status: "delivered",
              openCount: 0,
              clickCount: 0,
              template: "introduction",
            },
            {
              id: "5",
              subject: "Streamline your sales process",
              recipient: "alex.brown@business.io",
              recipientCompany: "Business.io",
              sentAt: "2025-01-27T11:30:00Z",
              status: "sent",
              openCount: 0,
              clickCount: 0,
              template: "cold_outreach",
            },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch sent emails:", error)
        // Use mock data on error
        setEmails([])
      } finally {
        setLoading(false)
      }
    }

    fetchSentEmails()
  }, [])

  const getStatusColor = (status: SentEmail["status"]) => {
    switch (status) {
      case "sent":
        return "bg-gray-100 text-gray-800"
      case "delivered":
        return "bg-blue-100 text-blue-800"
      case "opened":
        return "bg-green-100 text-green-800"
      case "clicked":
        return "bg-purple-100 text-purple-800"
      case "replied":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: SentEmail["status"]) => {
    switch (status) {
      case "opened":
        return <Eye className="h-3 w-3" />
      case "clicked":
        return <MousePointer className="h-3 w-3" />
      case "replied":
        return <Mail className="h-3 w-3" />
      default:
        return null
    }
  }

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.recipientCompany.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || email.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="opened">Opened</SelectItem>
            <SelectItem value="clicked">Clicked</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Email List */}
      <div className="space-y-4">
        {filteredEmails.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start by composing and sending your first email."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredEmails.map((email) => (
            <Card key={email.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{email.subject}</h3>
                      <Badge className={getStatusColor(email.status)}>
                        {getStatusIcon(email.status)}
                        <span className="ml-1 capitalize">{email.status}</span>
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {email.recipient}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(email.sentAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-gray-600">
                        Company: <span className="font-medium">{email.recipientCompany}</span>
                      </span>
                      <span className="text-gray-600">
                        Template: <span className="font-medium capitalize">{email.template.replace("_", " ")}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-4">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center text-green-600">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{email.openCount}</span>
                      </div>
                      <div className="flex items-center text-purple-600">
                        <MousePointer className="h-4 w-4 mr-1" />
                        <span>{email.clickCount}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {filteredEmails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Summary Statistics
            </CardTitle>
            <CardDescription>Performance overview for {filteredEmails.length} emails</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredEmails.filter((e) => e.status !== "sent").length}
                </div>
                <div className="text-sm text-gray-600">Delivered</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {filteredEmails.filter((e) => ["opened", "clicked", "replied"].includes(e.status)).length}
                </div>
                <div className="text-sm text-gray-600">Opened</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredEmails.filter((e) => ["clicked", "replied"].includes(e.status)).length}
                </div>
                <div className="text-sm text-gray-600">Clicked</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredEmails.filter((e) => e.status === "replied").length}
                </div>
                <div className="text-sm text-gray-600">Replied</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
