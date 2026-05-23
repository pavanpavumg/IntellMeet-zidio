import express from 'express';
import { generateMeetingToken } from '../controllers/meeting.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Changed to POST internally to accommodate Requirement #1 (No logging/caching params in URLs)
router.post('/:id/token', protect, generateMeetingToken);

export default router;
