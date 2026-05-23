import express from 'express';
import { createTask, getTasksByWorkspace, updateTaskStatus } from '../controllers/task.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/').post(protect, createTask);
router.route('/:workspaceId').get(protect, getTasksByWorkspace);
router.route('/:id/status').put(protect, updateTaskStatus);

export default router;
