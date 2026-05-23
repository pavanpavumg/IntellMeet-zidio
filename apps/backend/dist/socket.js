"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initializeSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        // Join a specific workspace room to receive task updates
        socket.on('JOIN_WORKSPACE_ROOM', (workspaceId) => {
            socket.join(workspaceId);
            console.log(`Socket ${socket.id} joined workspace ${workspaceId}`);
        });
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
exports.initializeSocket = initializeSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io is not initialized. Please call initializeSocket() first.');
    }
    return io;
};
exports.getIO = getIO;
