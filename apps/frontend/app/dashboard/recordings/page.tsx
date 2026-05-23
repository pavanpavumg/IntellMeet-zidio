'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Play,
  Clock,
  Calendar,
  Users,
  Brain,
  Download,
  Share,
  Trash2,
  MoreVertical,
  Filter,
  CheckCircle,
  FileText,
  ChevronRight,
  Eye,
} from 'lucide-react'

const recordings = [
  {
    id: 1,
    title: 'Sprint Planning - Week 15',
    date: 'Today',
    time: '10:00 AM',
    duration: '1h 15m',
    participants: ['JD', 'SC', 'MR', 'EW', 'AK'],
    hasAISummary: true,
    actionItems: 5,
    thumbnailColor: 'from-primary/20 to-accent/20',
  },
  {
    id: 2,
    title: 'Design Review - Dashboard V2',
    date: 'Yesterday',
    time: '2:00 PM',
    duration: '45m',
    participants: ['JD', 'EW', 'JL'],
    hasAISummary: true,
    actionItems: 3,
    thumbnailColor: 'from-accent/20 to-chart-2/20',
  },
  {
    id: 3,
    title: 'Client Call - Acme Corp',
    date: 'Mar 25, 2024',
    time: '4:30 PM',
    duration: '30m',
    participants: ['JD', 'MR'],
    hasAISummary: true,
    actionItems: 4,
    thumbnailColor: 'from-chart-3/20 to-primary/20',
  },
  {
    id: 4,
    title: 'Weekly Team Sync',
    date: 'Mar 24, 2024',
    time: '9:00 AM',
    duration: '55m',
    participants: ['JD', 'SC', 'MR', 'EW', 'AK', 'JL'],
    hasAISummary: true,
    actionItems: 7,
    thumbnailColor: 'from-chart-4/20 to-accent/20',
  },
]

const selectedRecording = {
  id: 1,
  title: 'Sprint Planning - Week 15',
  date: 'Today, 10:00 AM',
  duration: '1h 15m',
  summary: `
## Meeting Summary

The team discussed Q1 progress and planned for the upcoming sprint. Key highlights include:

- **Product Launch**: New feature release scheduled for April 15th
- **Performance**: Q1 revenue targets exceeded by 15%
- **Team Growth**: Engineering team expanding by 5 members

### Discussion Points

1. Sarah presented the updated roadmap with revised timelines
2. Mike shared customer feedback from recent user interviews
3. Emily demoed the new dashboard designs

### Decisions Made

- Approved the new color scheme for the dashboard
- Agreed to implement dark mode as a priority feature
- Scheduled customer interviews for next week
  `,
  keyPoints: [
    'Q1 revenue exceeded targets by 15%',
    'New product launch scheduled for April 15th',
    'Dashboard redesign approved by stakeholders',
    'Engineering team expanding by 5 members',
    'Customer satisfaction improved to 92%',
  ],
  actionItems: [
    { id: 1, task: 'Prepare Q2 roadmap presentation', assignee: 'Sarah Chen', due: 'Tomorrow', completed: false },
    { id: 2, task: 'Review design mockups', assignee: 'Emily Watson', due: 'Friday', completed: true },
    { id: 3, task: 'Schedule customer interviews', assignee: 'Mike Rodriguez', due: 'Next week', completed: false },
    { id: 4, task: 'Send meeting summary to stakeholders', assignee: 'John Doe', due: 'Today', completed: true },
    { id: 5, task: 'Update sprint backlog', assignee: 'Alex Kim', due: 'Tomorrow', completed: false },
  ],
}

export default function RecordingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recordings</h1>
          <p className="text-muted-foreground">Access meeting recordings and AI summaries</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meetings</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Recordings List */}
        <div className="w-full lg:w-96 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-3 pr-4">
              {recordings.map((recording) => (
                <Card
                  key={recording.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedId === recording.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedId(recording.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className={`h-16 w-24 rounded-lg bg-gradient-to-br ${recording.thumbnailColor} flex items-center justify-center shrink-0`}>
                        <Play className="h-6 w-6 text-foreground/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{recording.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{recording.date}</span>
                          <span>·</span>
                          <Clock className="h-3 w-3" />
                          <span>{recording.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-1.5">
                            {recording.participants.slice(0, 3).map((p, idx) => (
                              <Avatar key={idx} className="h-5 w-5 border border-background">
                                <AvatarFallback className="text-[10px]">{p}</AvatarFallback>
                              </Avatar>
                            ))}
                            {recording.participants.length > 3 && (
                              <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground border border-background">
                                +{recording.participants.length - 3}
                              </div>
                            )}
                          </div>
                          {recording.hasAISummary && (
                            <Badge variant="secondary" className="text-xs">
                              <Brain className="mr-1 h-3 w-3" />
                              AI Summary
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Recording Detail */}
        {selectedId && (
          <div className="flex-1 space-y-6">
            {/* Video Player */}
            <Card>
              <CardContent className="p-0">
                <div className={`aspect-video rounded-t-lg bg-gradient-to-br ${recordings.find(r => r.id === selectedId)?.thumbnailColor} flex items-center justify-center`}>
                  <Button size="lg" className="h-16 w-16 rounded-full">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{selectedRecording.title}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedRecording.date} · {selectedRecording.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Transcript
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Export Notes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Recording
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Summary Tabs */}
            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">AI Summary</TabsTrigger>
                <TabsTrigger value="keypoints">Key Points</TabsTrigger>
                <TabsTrigger value="actions">Action Items</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <CardTitle>AI-Generated Summary</CardTitle>
                    </div>
                    <CardDescription>Automatically generated from the meeting transcript</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div className="space-y-4 text-foreground">
                        <h3 className="text-lg font-semibold">Meeting Summary</h3>
                        <p className="text-muted-foreground">
                          The team discussed Q1 progress and planned for the upcoming sprint. Key highlights include the new product launch scheduled for April 15th, Q1 revenue targets exceeded by 15%, and engineering team expansion.
                        </p>
                        <h4 className="text-base font-semibold mt-4">Discussion Points</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Sarah presented the updated roadmap with revised timelines</li>
                          <li>Mike shared customer feedback from recent user interviews</li>
                          <li>Emily demoed the new dashboard designs</li>
                        </ul>
                        <h4 className="text-base font-semibold mt-4">Decisions Made</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Approved the new color scheme for the dashboard</li>
                          <li>Agreed to implement dark mode as a priority feature</li>
                          <li>Scheduled customer interviews for next week</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="keypoints" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <CardTitle>Key Points</CardTitle>
                    </div>
                    <CardDescription>Important highlights from the meeting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {selectedRecording.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-accent" />
                      <CardTitle>Action Items</CardTitle>
                    </div>
                    <CardDescription>Tasks extracted from the meeting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedRecording.actionItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox checked={item.completed} />
                          <div className="flex-1">
                            <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {item.task}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <span>{item.assignee}</span>
                              <span>·</span>
                              <span>Due: {item.due}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
