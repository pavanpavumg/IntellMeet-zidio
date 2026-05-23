"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteMember = exports.getWorkspaces = exports.createWorkspace = void 0;
const Workspace_1 = __importDefault(require("../models/Workspace"));
const createWorkspace = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;
        const workspace = await Workspace_1.default.create({
            name,
            owner: userId,
            members: [userId],
        });
        res.status(201).json(workspace);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createWorkspace = createWorkspace;
const getWorkspaces = async (req, res) => {
    try {
        const userId = req.user._id;
        const workspaces = await Workspace_1.default.find({ members: userId }).populate('owner', 'name email').populate('members', 'name email');
        res.status(200).json(workspaces);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getWorkspaces = getWorkspaces;
const inviteMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { userIdToAdd } = req.body;
        const workspace = await Workspace_1.default.findById(id);
        if (!workspace)
            return res.status(404).json({ message: 'Workspace not found' });
        if (!workspace.members.includes(userIdToAdd)) {
            workspace.members.push(userIdToAdd);
            await workspace.save();
        }
        res.status(200).json(workspace);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.inviteMember = inviteMember;
