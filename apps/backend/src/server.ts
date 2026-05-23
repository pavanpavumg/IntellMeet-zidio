import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import workspaceRoutes from './routes/workspace.routes';
import taskRoutes from './routes/task.routes';
import meetingRoutes from './routes/meeting.routes';
import aiRoutes from './routes/ai.routes';
import { createServer } from 'http';
import { initializeSocket } from './socket';

dotenv.config({ override: true }); // Ensure latest .env keys are always loaded into memory even without terminal restart

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initializeSocket(server);

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'intell-meet-backend' });
});

server.listen(PORT, () => {
  console.log(`Server & WebSockets running on port ${PORT}`);
});
