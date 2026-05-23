"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.getTasksByWorkspace = exports.createTask = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const socket_1 = require("../socket"); // We will create this socket instance next
const createTask = async (req, res) => {
    try {
        const { title, description, status, workspaceId, assigneeId } = req.body;
        const task = await Task_1.default.create({
            title,
            description,
            status: status || 'TODO',
            workspace: workspaceId,
            assignee: assigneeId,
        });
        // Notify connected clients that a new task was created
        const io = (0, socket_1.getIO)();
        io.to(workspaceId).emit('TASK_CREATED', task);
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.createTask = createTask;
const getTasksByWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const tasks = await Task_1.default.find({ workspace: workspaceId }).populate('assignee', 'name email');
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getTasksByWorkspace = getTasksByWorkspace;
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const task = await Task_1.default.findByIdAndUpdate(id, { status }, { new: true }).populate('assignee', 'name email');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Emit the TASK_UPDATED event to the workspace room
        const io = (0, socket_1.getIO)();
        io.to(task.workspace.toString()).emit('TASK_UPDATED', task);
        res.status(200).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateTaskStatus = updateTaskStatus;
