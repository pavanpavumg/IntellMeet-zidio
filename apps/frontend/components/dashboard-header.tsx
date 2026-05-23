'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Bell,
  Search,
  Video,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  MessageSquare,
  CheckSquare,
  Calendar,
} from 'lucide-react'
import { useTheme } from 'next-themes'

const notifications = [
  {
    id: 1,
    type: 'meeting',
    title: 'Team Standup',
    message: 'Starting in 15 minutes',
    time: '15 min',
    read: false,
  },
  {
    id: 2,
    type: 'mention',
    title: 'Sarah mentioned you',
    message: 'in #product-design channel',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'task',
    title: 'Task assigned to you',
    message: 'Review Q1 roadmap document',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'meeting',
    title: 'Meeting recording ready',
    message: 'Client call from yesterday',
    time: '1 day ago',
    read: true,
  },
]

import { useAuth } from './auth-provider'

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length
  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="h-4 w-4 text-primary" />
      case 'mention':
        return <MessageSquare className="h-4 w-4 text-accent" />
      case 'task':
        return <CheckSquare className="h-4 w-4 text-chart-2" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />

      <div className="flex-1 flex items-center gap-4">
        {/* Search - Desktop */}
        <div className="hidden md:flex relative max-w-md flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search meetings, chats, tasks..."
            className="pl-8 bg-muted/50"
          />
        </div>

        {/* Search - Mobile */}
        <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="h-auto">
            <SheetHeader>
              <SheetTitle>Search</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <Input
                type="search"
                placeholder="Search meetings, chats, tasks..."
                autoFocus
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-2">
        {/* Start Meeting Button */}
        <Button size="sm" asChild className="hidden sm:flex">
          <Link href="/meeting/lobby">
            <Video className="mr-2 h-4 w-4" />
            Start Meeting
          </Link>
        </Button>
        <Button size="icon" asChild className="sm:hidden">
          <Link href="/meeting/lobby">
            <Video className="h-4 w-4" />
          </Link>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 ${
                      !notification.read ? 'bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || 'Loading...'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
