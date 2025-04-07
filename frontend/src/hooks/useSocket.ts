import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

export const useSocket = (getToken: () => Promise<string | null>) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await getToken();
      const socketConnection = io(import.meta.env.VITE_WEBSOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      socketConnection.on('connect', () => {
        toast.success('User is online ', {
          duration: 3000,
        });
      });

      socketConnection.on('disconnect', (reason) => {
        toast.error('SocketIO disconnected: ' + reason);
      });

      socketConnection.on('activeUsers', ({ users }) => {
        setActiveUsers(users);
      });

      socketConnection.on('userLeft', ({ roomId }) => {
        toast.success('User Left', { duration: 3000 });
      });

      setSocket(socketConnection);
    };

    connectSocket();

    return () => {
      socket?.disconnect();
      socket?.removeAllListeners();
    };
  }, [getToken]);

  return { socket, activeUsers };
};
