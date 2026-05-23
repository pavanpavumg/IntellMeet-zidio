'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { LiveKitRoom, RoomAudioRenderer, GridLayout, ParticipantTile, useTracks, useChat } from '@livekit/components-react'
import { Track } from 'livekit-client'
import '@livekit/components-styles'
import { fetchWithAuth } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Circle,
  PhoneOff,
  MessageSquare,
  Users,
  Brain,
  MoreVertical,
  Hand,
  Smile,
  PanelRightClose,
  PanelRightOpen,
  Settings,
  Send,
  Paperclip,
  CheckCircle,
  Clock,
  ChevronDown,
  Copy,
  Pin,
} from 'lucide-react'

const participants = [
  { id: 1, name: 'John Doe', initials: 'JD', isHost: true, isMuted: false, isVideoOn: true },
  { id: 2, name: 'Sarah Chen', initials: 'SC', isHost: false, isMuted: true, isVideoOn: true },
  { id: 3, name: 'Mike Rodriguez', initials: 'MR', isHost: false, isMuted: false, isVideoOn: false },
  { id: 4, name: 'Emily Watson', initials: 'EW', isHost: false, isMuted: false, isVideoOn: true },
  { id: 5, name: 'Alex Kim', initials: 'AK', isHost: false, isMuted: true, isVideoOn: true },
  { id: 6, name: 'Jessica Lee', initials: 'JL', isHost: false, isMuted: false, isVideoOn: true },
]

// Static Mock removed in favor of real-time WebRTC useChat

const aiSummary = {
  keyPoints: [
    'Q1 revenue exceeded targets by 15%',
    'New product launch scheduled for April',
    'Customer satisfaction improved to 92%',
    'Engineering team expanding by 5 members',
  ],
  actionItems: [
    { task: 'Prepare Q2 roadmap presentation', assignee: 'Sarah Chen', due: 'Tomorrow' },
    { task: 'Review design mockups', assignee: 'Emily Watson', due: 'Friday' },
    { task: 'Schedule customer interviews', assignee: 'Mike Rodriguez', due: 'Next week' },
    { task: 'Send meeting summary to stakeholders', assignee: 'John Doe', due: 'Today' },
  ],
}

// Provide a stable hoisted wrapper for LiveKit's ephemeral DataChannel hook
const ChatContext = createContext<ReturnType<typeof useChat> | null>(null)

function ChatProvider({ children }: { children: React.ReactNode }) {
  const chatState = useChat()
  return <ChatContext.Provider value={chatState}>{children}</ChatContext.Provider>
}

export function useGlobalChat() {
  const context = useContext(ChatContext)
  if (!context) throw new Error('useGlobalChat must be used within a ChatProvider')
  return context
}

export default function MeetingRoomPage() {
  const [micEnabled, setMicEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('chat')
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [handRaised, setHandRaised] = useState(false)

  const [token, setToken] = useState<string | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    fetchWithAuth('/workspaces')
      .then(workspaces => {
        if (workspaces && workspaces.length > 0) {
           const workspaceId = workspaces[0]._id;
           fetchWithAuth(`/meetings/${workspaceId}/token`, { method: 'POST' })
             .then(data => {
                if (data && data.token) setToken(data.token);
                else setConnectionError('Failed to generate token');
             })
             .catch(e => setConnectionError(e.message))
        } else {
           setConnectionError('No workspace found to join');
        }
      })
      .catch(e => setConnectionError(e.message))
  }, [])

  const meetingTime = '00:32:15'

  if (connectionError) {
    return <div className="h-screen flex items-center justify-center text-destructive">{connectionError}</div>
  }

  if (!token) {
    return (
      <div className="h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4 text-white">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        <p className="text-xl font-medium animate-pulse">Joining meeting...</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <LiveKitRoom
        video={videoEnabled}
        audio={micEnabled}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        className="h-screen bg-[#0a0a0f] flex flex-col"
      >
       <ChatProvider>
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isRecording && (
                <Badge variant="destructive" className="gap-1">
                  <Circle className="h-2 w-2 fill-current animate-pulse" />
                  Recording
                </Badge>
              )}
              <span className="font-mono text-sm text-muted-foreground">{meetingTime}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm font-medium text-foreground">Team Standup</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {participants.length}
            </Badge>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Video Grid */}
          <div className={`flex-1 p-4 transition-all ${rightPanelOpen ? 'lg:pr-0' : ''}`}>
             <DynamicVideoGrid />
          </div>

          {/* Right Panel - Desktop */}
          {rightPanelOpen && (
            <div className="hidden lg:flex w-80 border-l border-border/50 flex-col bg-background">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-12 px-2">
                  <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-muted">
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="participants" className="gap-2 data-[state=active]:bg-muted">
                    <Users className="h-4 w-4" />
                    People
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="gap-2 data-[state=active]:bg-muted">
                    <Brain className="h-4 w-4" />
                    AI Notes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
                  <LiveChatPanel />
                </TabsContent>

                <TabsContent value="participants" className="flex-1 m-0 p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-2">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">{participant.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {participant.name}
                                {participant.isHost && (
                                  <Badge variant="secondary" className="ml-2 text-xs">Host</Badge>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {participant.isMuted ? (
                              <MicOff className="h-4 w-4 text-destructive" />
                            ) : (
                              <Mic className="h-4 w-4 text-muted-foreground" />
                            )}
                            {participant.isVideoOn ? (
                              <Video className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <VideoOff className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="ai" className="flex-1 m-0 p-0 overflow-hidden">
                  <AIReportPanel />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-background">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{meetingTime}</span>
            </div>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={micEnabled ? 'secondary' : 'destructive'}
                  size="icon"
                  className="h-11 w-11 rounded-full"
                  onClick={() => setMicEnabled(!micEnabled)}
                >
                  {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{micEnabled ? 'Mute' : 'Unmute'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={videoEnabled ? 'secondary' : 'destructive'}
                  size="icon"
                  className="h-11 w-11 rounded-full"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                >
                  {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{videoEnabled ? 'Stop Video' : 'Start Video'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" className="h-11 w-11 rounded-full">
                  <Monitor className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share Screen</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isRecording ? 'destructive' : 'secondary'}
                  size="icon"
                  className="h-11 w-11 rounded-full"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <Circle className={`h-5 w-5 ${isRecording ? 'fill-current' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isRecording ? 'Stop Recording' : 'Start Recording'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={handRaised ? 'default' : 'secondary'}
                  size="icon"
                  className="h-11 w-11 rounded-full hidden sm:flex"
                  onClick={() => setHandRaised(!handRaised)}
                >
                  <Hand className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{handRaised ? 'Lower Hand' : 'Raise Hand'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" className="h-11 w-11 rounded-full hidden sm:flex">
                  <Smile className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reactions</TooltipContent>
            </Tooltip>

            <Button
              variant="destructive"
              size="icon"
              className="h-11 w-11 rounded-full"
              onClick={() => setShowLeaveDialog(true)}
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Mobile Panel Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96 p-0">
                <Tabs defaultValue="chat" className="flex-1 flex flex-col h-full">
                  <SheetHeader className="px-4 pt-4">
                    <SheetTitle>Meeting Panel</SheetTitle>
                  </SheetHeader>
                  <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-12 px-2">
                    <TabsTrigger value="chat" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="participants" className="gap-2">
                      <Users className="h-4 w-4" />
                      People
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="gap-2">
                      <Brain className="h-4 w-4" />
                      AI
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
                    <LiveChatPanel />
                  </TabsContent>
                  <TabsContent value="participants" className="flex-1 m-0 px-4">
                    <ScrollArea className="h-full">
                      <div className="space-y-2 py-4">
                        {participants.map((participant) => (
                          <div
                            key={participant.id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{participant.initials}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{participant.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="ai" className="flex-1 m-0 px-4">
                    <ScrollArea className="h-full">
                      <div className="space-y-4 py-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Key Points</h4>
                          <ul className="space-y-2">
                            {aiSummary.keyPoints.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </SheetContent>
            </Sheet>

            {/* Desktop Panel Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex"
                  onClick={() => setRightPanelOpen(!rightPanelOpen)}
                >
                  {rightPanelOpen ? (
                    <PanelRightClose className="h-5 w-5" />
                  ) : (
                    <PanelRightOpen className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{rightPanelOpen ? 'Hide Panel' : 'Show Panel'}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Leave Meeting Dialog */}
        <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave Meeting?</DialogTitle>
              <DialogDescription>
                Are you sure you want to leave this meeting? You can rejoin later using the meeting code.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" asChild>
                <Link href="/dashboard">Leave Meeting</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <RoomAudioRenderer />
       </ChatProvider>
      </LiveKitRoom>
    </TooltipProvider>
  )
}

function DynamicVideoGrid() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: '100%', width: '100%' }}>
      <ParticipantTile />
    </GridLayout>
  );
}

function LiveChatPanel({ className = "" }: { className?: string }) {
  const { send, chatMessages, isSending } = useGlobalChat();
  const [message, setChatMessage] = useState('');

  const handleSendMessage = async () => {
    if (message.trim() && send) {
      try {
        await send(message);
        setChatMessage('');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className={`flex-1 flex flex-col ${className}`}>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs">
                  {msg.from?.name ? msg.from.name.substring(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {msg.from?.name || 'Unknown User'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 mt-1">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isSending}
            className="text-foreground bg-background"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={isSending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function AIReportPanel({ className = "" }: { className?: string }) {
  const { chatMessages } = useGlobalChat();
  const [summary, setSummary] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async () => {
     if (chatMessages.length === 0) {
        setError('No chat history to summarize. Please type some meeting logs first.');
        return;
     }

     setIsGenerating(true);
     setError('');

     try {
       const logsPayload = chatMessages.map(msg => ({
          time: new Date(msg.timestamp).toLocaleTimeString(),
          sender: msg.from?.name || 'Unknown',
          message: msg.message
       }));

       const res = await fetchWithAuth('/ai/summarize', {
          method: 'POST',
          body: JSON.stringify({ chatLogs: logsPayload })
       });

       if (res && (res.keyPoints || res.actionItems)) {
         setSummary(res);
       } else {
         setError('Gemini returned an invalid response.');
       }
     } catch (e: any) {
       setError(e.message || 'Failed to generate summary');
     } finally {
       setIsGenerating(false);
     }
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${className}`}>
      <div className="p-4 border-b flex justify-between items-center bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          Intelligence
        </h4>
        <Button 
          size="sm" 
          onClick={handleGenerateSummary} 
          disabled={isGenerating}
          variant={error ? "destructive" : "default"}
        >
          {isGenerating ? 'Generating summary...' : error ? 'Retry Generation' : 'Generate Summary'}
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {error ? (
           <div className="flex flex-col items-center justify-center p-6 gap-4 text-center border border-destructive/30 rounded-lg bg-destructive/10">
              <span className="text-destructive text-sm font-medium">{error}</span>
              <Button size="sm" variant="outline" onClick={handleGenerateSummary}>Try Again</Button>
           </div>
        ) : !summary ? (
           <div className="text-muted-foreground text-sm flex flex-col items-center justify-center py-10 gap-4 opacity-70">
              <Brain className="h-12 w-12 text-primary/50" />
              <p className="text-center font-medium px-4">No summary generated yet.</p>
              <p className="text-xs text-center px-4 max-w-xs">Click the button above to analyze the meeting chat logs using Google Gemini 1.5 Flash.</p>
           </div>
        ) : (
          <div className="space-y-6 pb-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Key Points
              </h4>
              <ul className="space-y-2">
                {summary.keyPoints?.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                Action Items
              </h4>
              <div className="space-y-3">
                {summary.actionItems?.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm font-medium text-foreground">{item.task}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{item.assignee || 'Unassigned'}</span>
                      <span>•</span>
                      <span>Due: {item.due || 'TBD'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
