'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Shield,
  ShieldCheck,
  Settings,
  Trash2,
  Crown,
  Video,
  MessageSquare,
  Calendar,
} from 'lucide-react'

const teamMembers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@company.com',
    role: 'Admin',
    department: 'Engineering',
    status: 'online',
    initials: 'JD',
    meetingsThisWeek: 8,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    role: 'Admin',
    department: 'Product',
    status: 'online',
    initials: 'SC',
    meetingsThisWeek: 12,
  },
  {
    id: 3,
    name: 'Mike Rodriguez',
    email: 'mike@company.com',
    role: 'Member',
    department: 'Engineering',
    status: 'away',
    initials: 'MR',
    meetingsThisWeek: 6,
  },
  {
    id: 4,
    name: 'Emily Watson',
    email: 'emily@company.com',
    role: 'Member',
    department: 'Design',
    status: 'online',
    initials: 'EW',
    meetingsThisWeek: 9,
  },
  {
    id: 5,
    name: 'Alex Kim',
    email: 'alex@company.com',
    role: 'Member',
    department: 'Engineering',
    status: 'offline',
    initials: 'AK',
    meetingsThisWeek: 5,
  },
  {
    id: 6,
    name: 'Jessica Lee',
    email: 'jessica@company.com',
    role: 'Member',
    department: 'Marketing',
    status: 'online',
    initials: 'JL',
    meetingsThisWeek: 7,
  },
]

const pendingInvites = [
  { id: 1, email: 'david@company.com', role: 'Member', sentAt: '2 days ago' },
  { id: 2, email: 'lisa@company.com', role: 'Member', sentAt: '1 day ago' },
]

const teamStats = [
  { label: 'Total Members', value: '12', icon: Users },
  { label: 'Meetings This Week', value: '47', icon: Video },
  { label: 'Active Channels', value: '8', icon: MessageSquare },
  { label: 'Scheduled Today', value: '6', icon: Calendar },
]

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInvite = () => {
    setInviteDialogOpen(false)
    setInviteEmail('')
    setInviteRole('member')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Workspace</h1>
          <p className="text-muted-foreground">Manage your team members and permissions</p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Admins can manage team settings and invite new members.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite}>Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {teamStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            Members ({teamMembers.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Mail className="mr-2 h-4 w-4" />
            Pending ({pendingInvites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground">Team Members</CardTitle>
                  <CardDescription>View and manage team member roles and permissions</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/avatars/${member.id}.jpg`} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${
                          member.status === 'online' ? 'bg-green-500' :
                          member.status === 'away' ? 'bg-yellow-500' : 'bg-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{member.name}</span>
                          {member.role === 'Admin' && (
                            <Badge variant="secondary" className="text-xs">
                              <ShieldCheck className="mr-1 h-3 w-3" />
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-right">
                        <p className="text-sm text-foreground">{member.department}</p>
                        <p className="text-xs text-muted-foreground">{member.meetingsThisWeek} meetings this week</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Video className="mr-2 h-4 w-4" />
                            Start Call
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove from Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Pending Invitations</CardTitle>
              <CardDescription>Invitations waiting to be accepted</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingInvites.length > 0 ? (
                <div className="space-y-4">
                  {pendingInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{invite.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Invited as {invite.role} · Sent {invite.sentAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Resend
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending invitations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
