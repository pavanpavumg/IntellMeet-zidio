import { Request, Response } from 'express';
import Workspace from '../models/Workspace';

export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = (req as any).user._id;

    const workspace = await Workspace.create({
      name,
      owner: userId,
      members: [userId],
    });

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getWorkspaces = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const workspaces = await Workspace.find({ members: userId }).populate('owner', 'name email').populate('members', 'name email');
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const inviteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userIdToAdd } = req.body;

    const workspace = await Workspace.findById(id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    if (!workspace.members.includes(userIdToAdd)) {
      workspace.members.push(userIdToAdd);
      await workspace.save();
    }

    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
