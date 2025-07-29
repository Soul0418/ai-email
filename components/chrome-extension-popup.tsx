"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, ExternalLink, Sparkles, Linkedin, Mail } from "lucide-react"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ChromeExtensionPopup() {
  const [profileData, setProfileData] = useState({
    name: "Sarah Chen",
    title: "VP of Engineering",
    company: "TechFlow",
    industry: "SaaS",
  })
  const [tone, setTone] = useState("friendly")
  const [useCase, setUseCase] = useState("demo")
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      setSubject("Quick question about TechFlow's engineering growth")
      setGeneratedEmail(`Hi Sarah,

I noticed TechFlow recently expanded the engineering team significantly. Impressive growth!

I'm curious - how are you handling code quality and deployment processes at this scale? Many SaaS companies at your stage face similar challenges.

Would you be open to a quick 15-minute chat about your current development workflow?

Best regards,
[Your Name]`)
      setIsGenerating(false)
      toast.success("Email generated!")
    }, 1500)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${generatedEmail}`)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="w-[380px] max-h-[600px] bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span className="font-semibold">ColdReach</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[520px] overflow-y-auto">
        {/* Profile Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
              LinkedIn Profile Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <Label className="text-xs text-slate-600">Name</Label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Title</Label>
                <Input
                  value={profileData.title}
                  onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <Label className="text-xs text-slate-600">Company</Label>
                <Input
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Industry</Label>
                <Input
                  value={profileData.industry}
                  onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card>
          <CardContent className="p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-slate-600">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="curious">Curious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Use Case</Label>
                <Select value={useCase} onValueChange={setUseCase}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Demo Request</SelectItem>
                    <SelectItem value="leadgen">Lead Gen</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full h-8 text-sm" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Sparkles className="w-3 h-3 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 mr-2" />
                  Generate Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Email */}
        {generatedEmail && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Generated Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-slate-600">Subject</Label>
                <div className="text-sm font-medium text-slate-900 p-2 bg-slate-50 rounded border">{subject}</div>
              </div>

              <Separator />

              <div>
                <Label className="text-xs text-slate-600">Email Body</Label>
                <div className="text-sm text-slate-900 p-2 bg-slate-50 rounded border max-h-32 overflow-y-auto">
                  <div className="whitespace-pre-wrap leading-relaxed">{generatedEmail}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCopy} className="flex-1 h-8 text-sm">
                  <Copy className="w-3 h-3 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" className="h-8 text-sm bg-transparent">
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Open App
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Stats */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-2">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-xs">
              4 of 20 left
            </Badge>
            <span>Pro: $29/mo</span>
          </div>
          <Button variant="link" className="text-xs p-0 h-auto text-blue-600">
            Upgrade
          </Button>
        </div>
      </div>
    </div>
  )
}
