'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  Zap,
  Video,
  AlertCircle,
  Loader2,
} from 'lucide-react'

export default function JoinMeetingPage() {
  const [meetingCode, setMeetingCode] = useState('')
  const [name, setName] = useState('John Doe')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!meetingCode.trim()) {
      setError('Please enter a meeting code')
      return
    }

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    setError('')
    setIsLoading(true)

    // Simulate joining
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo, show error for invalid codes
    if (meetingCode.toLowerCase() === 'invalid') {
      setError('Invalid meeting code. Please check and try again.')
      setIsLoading(false)
      return
    }

    router.push('/meeting/room')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 ml-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">IntellMeet</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-foreground">Join Meeting</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter the meeting code to join
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-foreground">Meeting Code</Label>
              <Input
                id="code"
                placeholder="ABC-123-XYZ"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                className={`text-center font-mono text-lg tracking-wider uppercase ${error ? 'border-destructive' : ''}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Meeting'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Want to start your own meeting?{' '}
              <Link href="/meeting/lobby" className="text-primary hover:underline font-medium">
                Start a meeting
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
