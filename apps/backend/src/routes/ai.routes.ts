import express from 'express';
import { summarizeMeeting } from '../controllers/ai.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/summarize', protect, summarizeMeeting);

export default router;
