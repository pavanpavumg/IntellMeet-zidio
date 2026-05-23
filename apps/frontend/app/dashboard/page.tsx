'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Video,
  Calendar,
  CheckSquare,
  Users,
  Clock,
  ArrowRight,
  Play,
  TrendingUp,
  MessageSquare,
} from 'lucide-react'

import { useState, useEffect } from 'react'
import { fetchWithAuth } from '@/lib/api'

import { useAuth } from '@/components/auth-provider'

export default function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name ? user.name.split(' ')[0] : 'there'

  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  
  useEffect(() => {
    fetchWithAuth('/workspaces')
      .then(async (data) => {
        setWorkspaces(data || [])
        if (data && data.length > 0) {
           const allTasks = await fetchWithAuth(`/tasks/${data[0]._id}`);
           setTasks(allTasks || []);
        }
      })
      .catch(console.error)
  }, [])

  const stats = [
    { label: 'Active Workspaces', value: workspaces.length.toString(), icon: Calendar, trend: 'Persistent Rooms' },
    { label: 'Tasks Due', value: tasks.length.toString(), icon: CheckSquare, trend: 'Across your boards' },
    { label: 'Team Members', value: workspaces[0]?.members?.length?.toString() || '1', icon: Users, trend: 'In primary space' },
    { label: 'Meeting Engine', value: 'LiveKit', icon: Video, trend: 'WebRTC Active' },
  ]

  const defaultParticipants = user?.name ? [user.name.substring(0, 2).toUpperCase()] : ['U']

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning, {firstName}</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/meeting/join">Join Meeting</Link>
          </Button>
          <Button asChild>
            <Link href="/meeting/lobby">
              <Video className="mr-2 h-4 w-4" />
              Start Meeting
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Meetings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Upcoming Meetings</CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/meetings">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workspaces.map((ws) => (
                <div
                  key={ws._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-primary">
                      <Video className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{ws.name}</p>
                        <Badge variant="default" className="text-xs">Available</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Persistent Meeting Space
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {defaultParticipants.map((participant, idx) => (
                        <Avatar key={idx} className="h-7 w-7 border-2 border-background">
                          <AvatarFallback className="text-xs">{participant}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Button size="sm" variant="default" asChild>
                      <Link href={`/meeting/room`}>
                        <Play className="mr-1 h-3 w-3" />
                        Join Space
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Tasks</CardTitle>
              <CardDescription>Action items for you</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/tasks">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    task.priority === 'high' ? 'bg-destructive' :
                    task.priority === 'medium' ? 'bg-chart-4' : 'bg-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {task.dueDate || 'No Date'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Meetings & Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Meetings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Recent Meetings</CardTitle>
              <CardDescription>Your past meetings and recordings</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/recordings">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workspaces.map((meeting) => (
                <div
                  key={meeting._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{meeting.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Workspace Session
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Active</Badge>
                    <Badge variant="outline">AI Features</Badge>
                    <Button size="sm" variant="ghost">
                      Logs
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity / Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Weekly Activity</CardTitle>
            <CardDescription>Your engagement this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Meeting Attendance</span>
                <span className="font-medium text-foreground">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tasks Completed</span>
                <span className="font-medium text-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Chat Engagement</span>
                <span className="font-medium text-foreground">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">12% increase from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
