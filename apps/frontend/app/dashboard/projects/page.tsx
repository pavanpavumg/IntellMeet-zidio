'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  FolderKanban,
  Search,
  MoreVertical,
  Users,
  CheckSquare,
  Calendar,
  ArrowRight,
} from 'lucide-react'

const projects = [
  {
    id: 1,
    name: 'Dashboard Redesign',
    description: 'Complete overhaul of the analytics dashboard with new features and improved UX',
    status: 'active',
    progress: 68,
    tasksCompleted: 17,
    totalTasks: 25,
    members: ['JD', 'EW', 'SC', 'AK'],
    dueDate: 'Apr 15, 2024',
    color: 'from-primary to-accent',
  },
  {
    id: 2,
    name: 'Mobile App Launch',
    description: 'Native mobile application for iOS and Android platforms',
    status: 'active',
    progress: 42,
    tasksCompleted: 8,
    totalTasks: 19,
    members: ['MR', 'AK', 'JL'],
    dueDate: 'May 1, 2024',
    color: 'from-accent to-chart-2',
  },
  {
    id: 3,
    name: 'API Documentation',
    description: 'Comprehensive API documentation for external developers',
    status: 'active',
    progress: 85,
    tasksCompleted: 11,
    totalTasks: 13,
    members: ['SC', 'JD'],
    dueDate: 'Mar 30, 2024',
    color: 'from-chart-3 to-primary',
  },
  {
    id: 4,
    name: 'Customer Portal',
    description: 'Self-service portal for customers to manage their accounts',
    status: 'planning',
    progress: 15,
    tasksCompleted: 3,
    totalTasks: 20,
    members: ['EW', 'MR', 'JL', 'SC'],
    dueDate: 'Jun 1, 2024',
    color: 'from-chart-4 to-accent',
  },
  {
    id: 5,
    name: 'Security Audit',
    description: 'Comprehensive security review and penetration testing',
    status: 'completed',
    progress: 100,
    tasksCompleted: 15,
    totalTasks: 15,
    members: ['AK', 'JD'],
    dueDate: 'Mar 10, 2024',
    color: 'from-chart-5 to-chart-2',
  },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [newProjectOpen, setNewProjectOpen] = useState(false)

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-primary">Active</Badge>
      case 'planning':
        return <Badge variant="secondary">Planning</Badge>
      case 'completed':
        return <Badge variant="outline" className="text-accent border-accent">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage your team projects and track progress</p>
        </div>
        <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Set up a new project for your team to collaborate on.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input placeholder="Enter project name" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe your project" />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewProjectOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setNewProjectOpen(false)}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                  <FolderKanban className="h-5 w-5 text-white" />
                </div>
                {getStatusBadge(project.status)}
              </div>
              <CardTitle className="text-foreground mt-3">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <CheckSquare className="h-4 w-4" />
                    <span>{project.tasksCompleted}/{project.totalTasks} tasks</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{project.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((member, idx) => (
                      <Avatar key={idx} className="h-7 w-7 border-2 border-background">
                        <AvatarFallback className="text-xs">{member}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.members.length > 4 && (
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground border-2 border-background">
                        +{project.members.length - 4}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/tasks`}>
                      View
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
