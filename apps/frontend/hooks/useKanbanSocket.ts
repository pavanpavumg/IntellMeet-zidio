import { useEffect } from 'react';
import { getSocket } from '../lib/socket';

export const useKanbanSocket = (workspaceId: string, onTaskUpdated: (task: any) => void) => {
  useEffect(() => {
    if (!workspaceId) return;

    const socket = getSocket();

    // Join the workspace room to receive events
    socket.emit('JOIN_WORKSPACE_ROOM', workspaceId);

    // Listen for real-time task updates
    socket.on('TASK_UPDATED', (task) => {
      onTaskUpdated(task);
    });

    socket.on('TASK_CREATED', (task) => {
      onTaskUpdated(task);
    });

    return () => {
      // Cleanup listener to prevent memory leaks or duplicate events
      socket.off('TASK_UPDATED');
      socket.off('TASK_CREATED');
    };
  }, [workspaceId, onTaskUpdated]);
};
