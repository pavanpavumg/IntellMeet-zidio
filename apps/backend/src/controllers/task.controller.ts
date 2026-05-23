import { Request, Response } from 'express';
import Task from '../models/Task';
import { getIO } from '../socket'; // We will create this socket instance next

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, dueDate, workspaceId, assigneeId } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'TODO',
      priority: priority || 'medium',
      dueDate,
      workspace: workspaceId,
      assignee: assigneeId,
    });

    // Notify connected clients that a new task was created
    const io = getIO();
    io.to(workspaceId).emit('TASK_CREATED', task);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTasksByWorkspace = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const tasks = await Task.find({ workspace: workspaceId }).populate('assignee', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true }).populate('assignee', 'name email');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Emit the TASK_UPDATED event to the workspace room
    const io = getIO();
    io.to(task.workspace.toString()).emit('TASK_UPDATED', task);

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
