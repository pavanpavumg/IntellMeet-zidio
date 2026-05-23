'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchWithAuth } from '@/lib/api'
import { useKanbanSocket } from '@/hooks/useKanbanSocket'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Plus,
  MoreVertical,
  Calendar,
  User,
  Flag,
  Pencil,
  Trash2,
  MessageSquare,
  Link,
  Clock,
  GripVertical,
  Search,
  Filter,
  LayoutGrid,
  List,
} from 'lucide-react'

type TaskStatus = 'todo' | 'in-progress' | 'done'

interface Task {
  id: string | number
  title: string
  description?: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  assignee: { name: string; initials: string }
  dueDate: string
  comments: number
  linkedMeeting?: string
}

const initialTasks: Task[] = []

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'bg-muted' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-primary/20' },
  { id: 'done', title: 'Done', color: 'bg-accent/20' },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<string | number | null>(null)
  const [workspaceId, setWorkspaceId] = useState<string>('');
  
  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')

  useEffect(() => {
    fetchWithAuth('/workspaces')
      .then(async workspaces => {
        if (workspaces && workspaces.length > 0) {
          setWorkspaceId(workspaces[0]._id);
        } else {
          try {
             // Auto-Initialize First Workspace implicitly so tasks have a target
             const ws = await fetchWithAuth('/workspaces', {
                method: 'POST',
                body: JSON.stringify({ name: 'My Workspace' })
             });
             setWorkspaceId(ws._id);
          } catch(err) {
             setTasks([]);
          }
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!workspaceId) return;

    fetchWithAuth(`/tasks/${workspaceId}`)
      .then(data => {
        if (!data || data.length === 0) {
           setTasks([]);
           return;
        }
        const mappedTasks = data.map((t: any) => ({
          id: t._id,
          title: t.title,
          description: t.description,
          status: t.status.toLowerCase().replace('_', '-'),
          priority: t.priority || 'medium',
          assignee: { name: t.assignee?.name || 'Unassigned', initials: t.assignee?.name?.[0] || 'U' },
          dueDate: t.dueDate || 'No Date',
          comments: 0
        }))
        setTasks(mappedTasks)
      })
      .catch(console.error)
  }, [workspaceId])

  const handleTaskSocketUpdate = useCallback((updatedTask: any) => {
    setTasks(prev => {
       const mappedStatus = updatedTask.status.toLowerCase().replace('_', '-');
       // If it doesn't exist, we add it (from TASK_CREATED)
       const exists = prev.find(t => t.id === updatedTask._id);
       if (!exists) {
          return [...prev, {
            id: updatedTask._id,
            title: updatedTask.title,
            description: updatedTask.description,
            status: mappedStatus,
            priority: updatedTask.priority || 'medium',
            assignee: { name: 'Unassigned', initials: 'U' },
            dueDate: updatedTask.dueDate || 'No Date',
            comments: 0
          }];
       }
       // Otherwise update
       return prev.map(t => t.id === updatedTask._id ? { ...t, status: mappedStatus } : t)
    })
  }, [])

  useKanbanSocket(workspaceId, handleTaskSocketUpdate)

  const handleDragStart = (taskId: string | number) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (status: TaskStatus) => {
    if (draggedTask) {
      // Optimistic UI update
      setTasks(tasks.map(task => 
        task.id === draggedTask ? { ...task, status } : task
      ))
      
      const dbStatus = status.toUpperCase().replace('-', '_')
      try {
        await fetchWithAuth(`/tasks/${draggedTask}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status: dbStatus })
        })
      } catch (err) {
        console.error('Failed to change status on backend', err)
      }
      
      setDraggedTask(null)
    }
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground'
      case 'medium': return 'bg-chart-4 text-foreground'
      case 'low': return 'bg-muted text-muted-foreground'
      default: return 'bg-muted'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground">Manage and track your action items</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === 'board' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('board')}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task to your board</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                     placeholder="Task title" 
                     value={newTaskTitle} 
                     onChange={(e) => setNewTaskTitle(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                     placeholder="Task description (optional)" 
                     value={newTaskDesc}
                     onChange={(e) => setNewTaskDesc(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input 
                       type="date" 
                       value={newTaskDueDate}
                       onChange={(e) => setNewTaskDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewTaskDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={async () => {
                  try {
                    await fetchWithAuth('/tasks', {
                       method: 'POST',
                       body: JSON.stringify({
                          title: newTaskTitle,
                          description: newTaskDesc,
                          priority: newTaskPriority,
                          dueDate: newTaskDueDate,
                          workspaceId: workspaceId
                       })
                    });
                    setNewTaskDialogOpen(false);
                    setNewTaskTitle('');
                    setNewTaskDesc('');
                    // Local Optimistic Reload or rely on Socket
                  } catch(err) {
                    console.error("Failed to create task", err);
                  }
                }}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'board' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg ${column.color}`}>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {getTasksByStatus(column.id).length}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1 min-h-[200px] max-h-[calc(100vh-20rem)]">
                <div className="space-y-3 p-3 bg-muted/30 rounded-b-lg min-h-[200px]">
                  {getTasksByStatus(column.id).map((task) => (
                    <Card
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className={`cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                        draggedTask === task.id ? 'opacity-50' : ''
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="font-medium text-sm text-foreground">{task.title}</p>
                              {task.linkedMeeting && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                  <Link className="h-3 w-3" />
                                  {task.linkedMeeting}
                                </div>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Reassign
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                              <Flag className="mr-1 h-2 w-2" />
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {task.comments > 0 && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />
                                {task.comments}
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {task.dueDate}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {getTasksByStatus(column.id).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No tasks
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">All Tasks</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search tasks..." className="pl-9 w-64" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <Checkbox checked={task.status === 'done'} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-foreground ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>{task.assignee.name}</span>
                      <span>·</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                  <Badge className={`${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline">
                    {task.status === 'todo' ? 'To Do' : task.status === 'in-progress' ? 'In Progress' : 'Done'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-lg">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">{selectedTask.title}</DialogTitle>
                <DialogDescription>{selectedTask.description || 'No description'}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Badge variant="outline">
                      {selectedTask.status === 'todo' ? 'To Do' : selectedTask.status === 'in-progress' ? 'In Progress' : 'Done'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Priority</Label>
                    <Badge className={getPriorityColor(selectedTask.priority)}>
                      {selectedTask.priority}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Assignee</Label>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{selectedTask.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">{selectedTask.assignee.name}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Due Date</Label>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Calendar className="h-4 w-4" />
                      {selectedTask.dueDate}
                    </div>
                  </div>
                </div>
                {selectedTask.linkedMeeting && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <Link className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Linked from:</span>
                      <span className="font-medium text-foreground">{selectedTask.linkedMeeting}</span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  Close
                </Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
