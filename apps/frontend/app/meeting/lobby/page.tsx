'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  ArrowLeft,
  Zap,
  Users,
  Copy,
  Check,
} from 'lucide-react'

export default function MeetingLobbyPage() {
  const [micEnabled, setMicEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [meetingTitle, setMeetingTitle] = useState('Quick Meeting')
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const meetingCode = 'ABC-123-XYZ'
  const meetingLink = `https://intellmeet.app/join/${meetingCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(meetingLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStartMeeting = () => {
    router.push('/meeting/room')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold text-foreground">IntellMeet</span>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Camera Preview */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Ready to join?</h1>
            <p className="text-muted-foreground">Check your audio and video before joining.</p>
            
            <div className="relative aspect-video rounded-xl bg-muted overflow-hidden">
              {videoEnabled ? (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  {/* Simulated video preview */}
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/avatars/user.jpg" alt="You" />
                    <AvatarFallback className="text-3xl">JD</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                      <VideoOff className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Camera is off</p>
                  </div>
                </div>
              )}

              {/* Name Tag */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur">
                <span className="text-sm font-medium text-foreground">John Doe</span>
                {!micEnabled && <MicOff className="h-3 w-3 text-destructive" />}
              </div>
            </div>

            {/* Audio/Video Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={micEnabled ? 'outline' : 'destructive'}
                size="lg"
                className="h-14 w-14 rounded-full"
                onClick={() => setMicEnabled(!micEnabled)}
              >
                {micEnabled ? (
                  <Mic className="h-6 w-6" />
                ) : (
                  <MicOff className="h-6 w-6" />
                )}
              </Button>
              <Button
                variant={videoEnabled ? 'outline' : 'destructive'}
                size="lg"
                className="h-14 w-14 rounded-full"
                onClick={() => setVideoEnabled(!videoEnabled)}
              >
                {videoEnabled ? (
                  <Video className="h-6 w-6" />
                ) : (
                  <VideoOff className="h-6 w-6" />
                )}
              </Button>
            </div>

            {/* Device Selection */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground">Microphone</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Select microphone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Microphone</SelectItem>
                    <SelectItem value="airpods">AirPods Pro</SelectItem>
                    <SelectItem value="built-in">Built-in Microphone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Camera</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Select camera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">FaceTime HD Camera</SelectItem>
                    <SelectItem value="external">External Webcam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Meeting Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Meeting Settings</CardTitle>
                <CardDescription>Configure your meeting before starting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground">Meeting Title</Label>
                  <Input
                    id="title"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="Enter meeting title"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Enable waiting room</Label>
                      <p className="text-sm text-muted-foreground">
                        Admit participants before they can join
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">Record meeting</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically record this meeting
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-foreground">AI Summary</Label>
                      <p className="text-sm text-muted-foreground">
                        Generate AI meeting notes and action items
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Invite Participants</CardTitle>
                <CardDescription>Share the meeting link with others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={meetingLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Meeting code: <span className="font-mono font-medium text-foreground">{meetingCode}</span></span>
                </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              className="w-full"
              onClick={handleStartMeeting}
            >
              Start Meeting
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
