import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Socket, io } from 'socket.io-client';
import { Container } from '../components/Container';
import { Card } from '../components/ui/card';
import { DashboardNav } from '../components/DashboardNav';
import { FirstComer } from '../components/FirstComer';
import { getRooms } from '../services';

export const Dashboard = () => {
  const { getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);

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

  useEffect(() => {
    async function fetchRooms() {
      const rooms = await getRooms(getToken);
      setRooms(rooms);
    }

    fetchRooms();
  }, []);

  return (
    <Container>
      <Card className='w-[600px] h-[700px] shadow-xl'>
        <DashboardNav isActive={false} roomId='Byugvyg345' />
        {rooms.length === 0 && <FirstComer />}
      </Card>
    </Container>
  );
};
