import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a specific workspace room to receive task updates
    socket.on('JOIN_WORKSPACE_ROOM', (workspaceId: string) => {
      socket.join(workspaceId);
      console.log(`Socket ${socket.id} joined workspace ${workspaceId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized. Please call initializeSocket() first.');
  }
  return io;
};
