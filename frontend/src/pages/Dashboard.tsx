import { useAuth, UserButton } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Socket, io } from 'socket.io-client';
import { Container } from '../components/Container';
import { Card } from '../components/ui/card';
import { DashboardNav } from '../components/DashboardNav';

export const Dashboard = () => {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const connectSocket = async () => {
      const token = await getToken();
      const socketConnection = io(import.meta.env.VITE_WEBSOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      socketConnection.on('connect', () => {
        toast.success(
          'Successfully Connected to SocketIO ' + socketConnection.id,
          { duration: 3000 }
        );
      });

      socketConnection.on('disconnect', (reason) => {
        toast.error('SocketIO disconnected due to ' + reason);
      });

      setSocket(socketConnection);
    };

    connectSocket();

    return () => {
      socket?.disconnect();
    };
  }, [getToken]);

  return (
    <Container>
      <Card className='w-[600px] h-[700px] shadow-xl'>
        <DashboardNav />
      </Card>
    </Container>
  );
};
