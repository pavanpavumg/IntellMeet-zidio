import express from 'express';
import { createWorkspace, getWorkspaces, inviteMember } from '../controllers/workspace.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/').post(protect, createWorkspace).get(protect, getWorkspaces);
router.route('/:id/invite').post(protect, inviteMember);

export default router;
