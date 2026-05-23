'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Plus,
  Hash,
  Lock,
  Users,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Pin,
  Star,
  AtSign,
  Image,
  File,
  ChevronDown,
  Settings,
  Bell,
  BellOff,
} from 'lucide-react'

const channels = [
  { id: 1, name: 'general', type: 'channel', unread: 3 },
  { id: 2, name: 'product-design', type: 'channel', unread: 0 },
  { id: 3, name: 'engineering', type: 'channel', unread: 12 },
  { id: 4, name: 'announcements', type: 'channel', unread: 1, isPrivate: true },
  { id: 5, name: 'random', type: 'channel', unread: 0 },
]

const directMessages = [
  { id: 1, name: 'Sarah Chen', initials: 'SC', status: 'online', unread: 2 },
  { id: 2, name: 'Mike Rodriguez', initials: 'MR', status: 'away', unread: 0 },
  { id: 3, name: 'Emily Watson', initials: 'EW', status: 'online', unread: 0 },
  { id: 4, name: 'Alex Kim', initials: 'AK', status: 'offline', unread: 0 },
  { id: 5, name: 'Jessica Lee', initials: 'JL', status: 'online', unread: 5 },
]

const messages = [
  {
    id: 1,
    sender: 'Sarah Chen',
    initials: 'SC',
    time: '9:30 AM',
    content: 'Good morning everyone! Ready for the standup?',
    reactions: [{ emoji: '👋', count: 3 }],
  },
  {
    id: 2,
    sender: 'Mike Rodriguez',
    initials: 'MR',
    time: '9:32 AM',
    content: 'Morning! Yes, just finishing up my coffee ☕',
    reactions: [],
  },
  {
    id: 3,
    sender: 'Emily Watson',
    initials: 'EW',
    time: '9:35 AM',
    content: 'Hey team! I pushed the latest design updates to Figma. Would love to get your feedback on the new dashboard layout.',
    reactions: [{ emoji: '👀', count: 2 }, { emoji: '🔥', count: 1 }],
    attachments: [
      { type: 'image', name: 'dashboard-v2.png' }
    ]
  },
  {
    id: 4,
    sender: 'John Doe',
    initials: 'JD',
    time: '9:38 AM',
    content: 'Looks great @Emily! The new sidebar is much cleaner. A few thoughts:\n\n1. Love the new color scheme\n2. Maybe we can add more contrast to the secondary buttons\n3. The spacing looks perfect',
    reactions: [{ emoji: '💯', count: 4 }],
    isCurrentUser: true,
  },
  {
    id: 5,
    sender: 'Alex Kim',
    initials: 'AK',
    time: '9:42 AM',
    content: 'Agreed! The metrics cards are especially nice. Should we schedule a design review meeting?',
    reactions: [],
  },
  {
    id: 6,
    sender: 'Sarah Chen',
    initials: 'SC',
    time: '9:45 AM',
    content: 'Great idea! I can set one up for tomorrow at 2 PM. Does that work for everyone?',
    reactions: [{ emoji: '✅', count: 5 }],
  },
]

const pinnedMessages = [
  { id: 1, content: 'Q2 Roadmap document: https://docs.example.com/roadmap', sender: 'Sarah Chen' },
]

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState('general')
  const [message, setMessage] = useState('')
  const [showSidebar, setShowSidebar] = useState(true)
  const [isTyping, setIsTyping] = useState(true)

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('')
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] -mx-4 lg:-mx-6 -mt-4 lg:-mt-6 overflow-hidden">
      {/* Sidebar */}
      <div className={`w-64 border-r border-border bg-card flex-shrink-0 flex flex-col ${showSidebar ? '' : 'hidden'} lg:flex`}>
        {/* Search */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8 h-9 bg-muted/50"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {/* Channels */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Channels</span>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-0.5">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.name)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                    selectedChannel === channel.name
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {channel.isPrivate ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      <Hash className="h-3.5 w-3.5" />
                    )}
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <Badge variant={selectedChannel === channel.name ? 'secondary' : 'default'} className="h-5 px-1.5 text-xs">
                      {channel.unread}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Direct Messages */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Direct Messages</span>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-0.5">
              {directMessages.map((dm) => (
                <button
                  key={dm.id}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{dm.initials}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${
                        dm.status === 'online' ? 'bg-green-500' :
                        dm.status === 'away' ? 'bg-yellow-500' : 'bg-muted-foreground'
                      }`} />
                    </div>
                    <span className="truncate text-foreground">{dm.name}</span>
                  </div>
                  {dm.unread > 0 && (
                    <Badge className="h-5 px-1.5 text-xs">{dm.unread}</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold text-foreground">{selectedChannel}</h2>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              <Users className="mr-1 h-3 w-3" />
              12 members
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Pin className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  Star Channel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellOff className="mr-2 h-4 w-4" />
                  Mute Notifications
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Channel Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <div className="px-4 py-2 bg-muted/50 border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <Pin className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">Pinned:</span>
              <span className="truncate text-foreground">{pinnedMessages[0].content}</span>
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => {
              const showAvatar = idx === 0 || messages[idx - 1].sender !== msg.sender
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 group ${!showAvatar ? 'ml-11' : ''}`}
                >
                  {showAvatar && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs">{msg.initials}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    {showAvatar && (
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground">{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                    )}
                    <div className="relative">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                      
                      {/* Attachments */}
                      {msg.attachments && (
                        <div className="mt-2">
                          {msg.attachments.map((attachment, aIdx) => (
                            <div
                              key={aIdx}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border"
                            >
                              {attachment.type === 'image' ? (
                                <Image className="h-4 w-4 text-primary" />
                              ) : (
                                <File className="h-4 w-4 text-primary" />
                              )}
                              <span className="text-sm text-foreground">{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reactions */}
                      {msg.reactions.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          {msg.reactions.map((reaction, rIdx) => (
                            <button
                              key={rIdx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted hover:bg-muted/80 border border-border text-xs"
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-muted-foreground">{reaction.count}</span>
                            </button>
                          ))}
                          <button className="h-6 w-6 rounded-full hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Smile className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                      )}

                      {/* Hover Actions */}
                      <div className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-0.5 bg-card border border-border rounded-md shadow-sm p-0.5">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Smile className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <AtSign className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Emily is typing...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder={`Message #${selectedChannel}`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                className="pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Smile className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <AtSign className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
